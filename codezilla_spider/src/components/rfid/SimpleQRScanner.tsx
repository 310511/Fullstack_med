import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, QrCode, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import jsQR from 'jsqr';

interface QRCodeData {
  rfid_tag_id: string;
  item_name: string;
  item_id: string;
  timestamp: string;
  checksum: string;
}

interface SimpleQRScannerProps {
  onQRCodeScanned: (data: QRCodeData) => void;
  onScanError?: (error: string) => void;
}

export const SimpleQRScanner: React.FC<SimpleQRScannerProps> = ({
  onQRCodeScanned,
  onScanError
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready to scan');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      setStatus('Starting camera...');
      setIsScanning(true);
      setScanError(null);
      setScanResult(null);

      // Use the exact same approach as the working test
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play().then(() => {
            console.log('Video started playing successfully');
            setStatus('Camera working! Point at QR code');
            startQRScanning();
          }).catch((error) => {
            console.error('Failed to play video:', error);
            setScanError(`Failed to play video: ${error.message}`);
            setIsScanning(false);
          });
        };
        
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error);
          setScanError(`Video error: ${error}`);
          setIsScanning(false);
        };
      }
      
    } catch (error: any) {
      console.error('Camera error:', error);
      let msg = 'Camera failed: ';
      
      if (error.name === 'NotAllowedError') {
        msg += 'Permission denied. Please allow camera access.';
      } else if (error.name === 'NotFoundError') {
        msg += 'No camera found.';
      } else if (error.name === 'NotReadableError') {
        msg += 'Camera in use by another app.';
      } else {
        msg += error.message;
      }
      
      setScanError(msg);
      setIsScanning(false);
      setStatus('Camera failed');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setIsScanning(false);
    setStatus('Camera stopped');
  };

  const startQRScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        console.log('QR Code detected:', code.data);
        onScanSuccess(code.data, code);
      }
    }, 100);
  };

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    try {
      let qrData: QRCodeData;
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        qrData = {
          rfid_tag_id: decodedText.substring(0, 8) || 'RFID_' + Math.random().toString(36).substr(2, 5),
          item_name: decodedText.substring(8, 20) || 'Unknown Item',
          item_id: 'ITEM_' + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          checksum: Math.random().toString(36).substr(2, 8)
        };
      }

      setScanResult(qrData);
      setScanError(null);
      setStatus('QR Code detected!');
      onQRCodeScanned(qrData);
      
      // Stop scanning after successful detection
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      
    } catch (error) {
      console.error('Error processing QR code:', error);
      setScanError('Invalid QR code format');
      onScanError?.('Invalid QR code format');
    }
  };

  const testCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      alert('Camera test successful! Camera is working.');
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      alert(`Camera test failed: ${error.message}`);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Simple QR Scanner</h2>
        </div>
      </div>

      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700">
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        ) : (
          <Button onClick={stopCamera} variant="destructive">
            <Camera className="w-4 h-4 mr-2" />
            Stop Camera
          </Button>
        )}
        
        <Button onClick={testCamera} variant="outline">
          <Camera className="w-4 h-4 mr-2" />
          Test Camera
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isScanning ? (
          <div className="relative">
            <video 
              ref={videoRef}
              className="w-full aspect-square bg-black"
              autoPlay 
              playsInline 
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* QR Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 relative">
                  <div className="absolute top-0 left-0 w-8 h-8">
                    <div className="absolute top-0 left-0 w-4 h-1 bg-green-400"></div>
                    <div className="absolute top-0 left-0 w-1 h-4 bg-green-400"></div>
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8">
                    <div className="absolute top-0 right-0 w-4 h-1 bg-green-400"></div>
                    <div className="absolute top-0 right-0 w-1 h-4 bg-green-400"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-8 h-8">
                    <div className="absolute bottom-0 left-0 w-4 h-1 bg-green-400"></div>
                    <div className="absolute bottom-0 left-0 w-1 h-4 bg-green-400"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-4 h-1 bg-green-400"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-4 bg-green-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <QrCode className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Ready to Scan
            </p>
            <p className="text-sm text-gray-600">
              Click "Start Camera" to begin scanning
            </p>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">{status}</p>
      </div>

      {scanError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{scanError}</span>
          </div>
        </div>
      )}

      {scanResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">QR Code Detected</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-green-700">RFID Tag ID:</span>
              <span className="text-green-800 ml-2">{scanResult.rfid_tag_id}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Item Name:</span>
              <span className="text-green-800 ml-2">{scanResult.item_name}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Item ID:</span>
              <span className="text-green-800 ml-2">{scanResult.item_id}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Timestamp:</span>
              <span className="text-green-800 ml-2">{new Date(scanResult.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
