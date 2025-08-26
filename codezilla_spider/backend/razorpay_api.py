"""
Razorpay Payment API for MedChain Marketplace
Handles payment processing and verification
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import razorpay
import os
import hmac
import hashlib
import json
import logging
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(title="MedChain Razorpay API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv('RAZORPAY_KEY_ID', 'rzp_test_YOUR_TEST_KEY'), 
          os.getenv('RAZORPAY_KEY_SECRET', 'YOUR_TEST_SECRET'))
)

logger = logging.getLogger(__name__)

# Pydantic models
class CreateOrderRequest(BaseModel):
    amount: int  # Amount in paise
    currency: str = "INR"
    receipt: str
    notes: Optional[Dict[str, str]] = None

class VerifyPaymentRequest(BaseModel):
    paymentId: str
    orderId: str
    signature: str

class RefundRequest(BaseModel):
    paymentId: str
    amount: Optional[int] = None  # Amount in paise
    reason: Optional[str] = None

class PaymentResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "razorpay-api"}

@app.post("/api/razorpay/create-order")
async def create_order(request: CreateOrderRequest):
    """Create a new Razorpay order"""
    try:
        order_data = {
            "amount": request.amount,
            "currency": request.currency,
            "receipt": request.receipt,
        }
        
        if request.notes:
            order_data["notes"] = request.notes

        order = razorpay_client.order.create(data=order_data)
        
        logger.info(f"Created order: {order['id']}")
        
        return {
            "success": True,
            "data": {
                "id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "receipt": order["receipt"],
                "status": order["status"],
                "created_at": order["created_at"]
            }
        }
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@app.post("/api/razorpay/verify-payment")
async def verify_payment(request: VerifyPaymentRequest):
    """Verify payment signature"""
    try:
        # Create the signature string
        signature_string = f"{request.orderId}|{request.paymentId}"
        
        # Generate expected signature
        expected_signature = hmac.new(
            os.getenv('RAZORPAY_KEY_SECRET', 'YOUR_TEST_SECRET').encode(),
            signature_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures
        is_valid = hmac.compare_digest(expected_signature, request.signature)
        
        if is_valid:
            # Get payment details
            payment = razorpay_client.payment.fetch(request.paymentId)
            
            return {
                "success": True,
                "verified": True,
                "data": {
                    "payment_id": payment["id"],
                    "order_id": payment["order_id"],
                    "amount": payment["amount"],
                    "currency": payment["currency"],
                    "status": payment["status"],
                    "method": payment["method"],
                    "email": payment["email"],
                    "contact": payment["contact"],
                    "created_at": payment["created_at"]
                }
            }
        else:
            return {
                "success": False,
                "verified": False,
                "error": "Invalid signature"
            }
    except Exception as e:
        logger.error(f"Error verifying payment: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to verify payment: {str(e)}")

@app.get("/api/razorpay/payment/{payment_id}")
async def get_payment_details(payment_id: str):
    """Get payment details by payment ID"""
    try:
        payment = razorpay_client.payment.fetch(payment_id)
        
        return {
            "success": True,
            "data": {
                "id": payment["id"],
                "order_id": payment["order_id"],
                "amount": payment["amount"],
                "currency": payment["currency"],
                "status": payment["status"],
                "method": payment["method"],
                "email": payment["email"],
                "contact": payment["contact"],
                "created_at": payment["created_at"],
                "description": payment.get("description", ""),
                "notes": payment.get("notes", {})
            }
        }
    except Exception as e:
        logger.error(f"Error fetching payment details: {e}")
        raise HTTPException(status_code=404, detail=f"Payment not found: {str(e)}")

@app.post("/api/razorpay/refund")
async def refund_payment(request: RefundRequest):
    """Refund a payment"""
    try:
        refund_data = {
            "payment_id": request.paymentId
        }
        
        if request.amount:
            refund_data["amount"] = request.amount
        
        if request.reason:
            refund_data["notes"] = {"reason": request.reason}
        
        refund = razorpay_client.payment.refund(refund_data)
        
        logger.info(f"Refunded payment: {request.paymentId}")
        
        return {
            "success": True,
            "data": {
                "id": refund["id"],
                "payment_id": refund["payment_id"],
                "amount": refund["amount"],
                "currency": refund["currency"],
                "status": refund["status"],
                "created_at": refund["created_at"]
            }
        }
    except Exception as e:
        logger.error(f"Error refunding payment: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to refund payment: {str(e)}")

@app.post("/api/razorpay/webhook")
async def webhook_handler(request: Request):
    """Handle Razorpay webhooks"""
    try:
        # Get the webhook payload
        payload = await request.body()
        signature = request.headers.get("X-Razorpay-Signature")
        
        if not signature:
            raise HTTPException(status_code=400, detail="Missing signature")
        
        # Verify webhook signature
        expected_signature = hmac.new(
            os.getenv('RAZORPAY_WEBHOOK_SECRET', 'YOUR_WEBHOOK_SECRET').encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(expected_signature, signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Parse the webhook payload
        webhook_data = json.loads(payload)
        event = webhook_data.get("event")
        
        logger.info(f"Received webhook event: {event}")
        
        # Handle different webhook events
        if event == "payment.captured":
            payment_data = webhook_data.get("payload", {}).get("payment", {}).get("entity", {})
            await handle_payment_captured(payment_data)
        elif event == "payment.failed":
            payment_data = webhook_data.get("payload", {}).get("payment", {}).get("entity", {})
            await handle_payment_failed(payment_data)
        elif event == "refund.processed":
            refund_data = webhook_data.get("payload", {}).get("refund", {}).get("entity", {})
            await handle_refund_processed(refund_data)
        
        return {"success": True, "message": "Webhook processed successfully"}
        
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

async def handle_payment_captured(payment_data: Dict[str, Any]):
    """Handle payment captured event"""
    logger.info(f"Payment captured: {payment_data.get('id')}")
    # TODO: Update order status in database
    # TODO: Send confirmation email
    # TODO: Update inventory

async def handle_payment_failed(payment_data: Dict[str, Any]):
    """Handle payment failed event"""
    logger.info(f"Payment failed: {payment_data.get('id')}")
    # TODO: Update order status in database
    # TODO: Send failure notification
    # TODO: Restore inventory

async def handle_refund_processed(refund_data: Dict[str, Any]):
    """Handle refund processed event"""
    logger.info(f"Refund processed: {refund_data.get('id')}")
    # TODO: Update order status in database
    # TODO: Send refund confirmation
    # TODO: Update inventory

@app.get("/api/razorpay/config")
async def get_config():
    """Get Razorpay configuration for frontend"""
    return {
        "key_id": os.getenv('RAZORPAY_KEY_ID', 'rzp_test_YOUR_TEST_KEY'),
        "currency": "INR",
        "name": "MedChain Marketplace",
        "description": "Medical supplies marketplace",
        "theme": {
            "color": "#6366f1"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)


