# Supplier Dashboard for MedChain Marketplace

This document provides a comprehensive guide for the Supplier Dashboard in the MedChain marketplace, allowing suppliers to manage their products, track orders, and monitor performance.

## 🎯 Features

- **Product Management**: Add, edit, and manage product listings
- **Order Tracking**: View and manage customer orders
- **Performance Analytics**: Monitor sales, revenue, and growth metrics
- **Inventory Management**: Track stock levels and set alerts
- **Blockchain Integration**: Verified product listings on blockchain
- **Real-time Updates**: Live data synchronization

## 🏗️ Dashboard Sections

### 1. Overview Tab
- **Recent Orders**: Latest customer orders with status
- **Performance Metrics**: Key performance indicators
- **Quick Stats**: Total products, revenue, orders, ratings

### 2. Products Tab
- **Product Grid**: Visual display of all products
- **Search & Filter**: Find products by name, category
- **Add Product**: Create new product listings
- **Edit/Delete**: Manage existing products

### 3. Orders Tab
- **Order List**: All customer orders with details
- **Status Filter**: Filter by order status
- **Order Actions**: Update order status, view details

### 4. Analytics Tab
- **Revenue Overview**: Monthly revenue tracking
- **Product Performance**: Top-selling products
- **Growth Metrics**: Performance trends

## 🔧 Setup Instructions

### 1. Access Supplier Dashboard

1. **Connect Wallet**: Ensure your wallet is connected to the application
2. **Navigate**: Go to `/supplier` route or click "Supplier Dashboard" in navigation
3. **Authentication**: The dashboard requires a connected wallet

### 2. Initial Setup

```typescript
// The dashboard automatically loads when wallet is connected
const { address, connectWallet } = useBlockchain();

// Dashboard will show connection prompt if no wallet
if (!address) {
  return <ConnectWalletPrompt />;
}
```

## 📊 Dashboard Components

### Stats Overview

```typescript
interface SupplierStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyGrowth: number;
}
```

### Product Management

```typescript
interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  inventoryLevel: number;
  thresholdQuantity: number;
  expiryDate: string;
  supplier: string;
}
```

## 🚀 Usage Guide

### Adding Products

1. **Navigate to Products Tab**
2. **Click "Add Product"**
3. **Fill Product Details**:
   - Product Name
   - Description
   - Category (Antibiotics, Consumables, Equipment, etc.)
   - Price
   - Inventory Level
4. **Submit**: Product will be added to blockchain

### Managing Orders

1. **View Orders Tab**
2. **Filter by Status**: Pending, Confirmed, Shipped, Delivered
3. **Update Status**: Click on order to update status
4. **Track Transactions**: View blockchain transaction hashes

### Monitoring Performance

1. **Overview Tab**: Quick performance metrics
2. **Analytics Tab**: Detailed revenue and growth data
3. **Real-time Updates**: Data refreshes automatically

## 🔌 API Integration

### Product Operations

```typescript
// Add new product
const success = await createProductListing({
  name: "Product Name",
  description: "Product description",
  category: "Antibiotics",
  price: 25.99,
  inventoryLevel: 100,
  supplier: address,
  blockchainVerified: true
});

// Get supplier products
const products = await getProductListings();
const supplierProducts = products.filter(p => p.supplier === address);
```

### Order Management

```typescript
// Get supplier orders
const orders = await getUserOrders(address);

// Filter orders by status
const pendingOrders = orders.filter(o => o.status === "pending");
const completedOrders = orders.filter(o => o.status === "delivered");
```

## 📈 Analytics Features

### Revenue Tracking

- **Total Revenue**: Cumulative sales
- **Monthly Revenue**: Current month performance
- **Growth Rate**: Month-over-month growth
- **Revenue Trends**: Historical data visualization

### Product Performance

- **Top Selling**: Best performing products
- **Low Stock Alerts**: Products needing restocking
- **Out of Stock**: Products with zero inventory
- **Category Performance**: Sales by product category

### Order Analytics

- **Order Status Distribution**: Pending, confirmed, shipped, delivered
- **Average Order Value**: Revenue per order
- **Order Completion Rate**: Success metrics
- **Customer Satisfaction**: Rating analysis

## 🔒 Security Features

### Blockchain Verification

- **Product Verification**: All products verified on blockchain
- **Immutable Records**: Order history cannot be altered
- **Transparent Transactions**: All transactions visible on blockchain
- **Smart Contract Integration**: Automated order processing

### Access Control

- **Wallet Authentication**: Only connected wallets can access
- **Supplier Verification**: Products linked to supplier address
- **Role-based Access**: Supplier-specific features only

## 🎨 UI Components

### Dashboard Layout

```tsx
<div className="min-h-screen bg-background">
  {/* Header */}
  <div className="border-b bg-card">
    <div className="container mx-auto px-6 py-4">
      {/* Dashboard title and actions */}
    </div>
  </div>

  {/* Stats Overview */}
  <div className="container mx-auto px-6 py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat cards */}
    </div>
  </div>

  {/* Tabs */}
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="products">Products</TabsTrigger>
      <TabsTrigger value="orders">Orders</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
    </TabsList>
  </Tabs>
</div>
```

### Product Cards

```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardContent className="p-4">
    {/* Product image placeholder */}
    <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4">
      <Package className="h-12 w-12 text-blue-500 mx-auto" />
    </div>
    
    {/* Product details */}
    <h3 className="font-semibold">{product.name}</h3>
    <p className="text-sm text-muted-foreground">{product.description}</p>
    <div className="flex items-center justify-between">
      <span className="font-bold">${product.price}</span>
      <span>Stock: {product.inventoryLevel}</span>
    </div>
    
    {/* Action buttons */}
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  </CardContent>
</Card>
```

## 🔄 Data Flow

### 1. Product Creation Flow

```
User Input → Form Validation → Blockchain Transaction → Product Listed → UI Update
```

### 2. Order Management Flow

```
Order Received → Status Update → Blockchain Record → UI Refresh → Analytics Update
```

### 3. Analytics Flow

```
Data Collection → Blockchain Query → Calculation → Display → Real-time Update
```

## 🛠️ Customization

### Adding New Categories

```typescript
const categories = [
  "Antibiotics", "Consumables", "Equipment", "Diabetes Care", 
  "Pain Management", "Cardiovascular", "Respiratory", "Vitamins",
  "Your New Category" // Add here
];
```

### Custom Analytics

```typescript
// Add custom metrics
const customStats = {
  ...stats,
  customMetric: calculateCustomMetric(data),
  customChart: generateCustomChart(data)
};
```

### Styling Customization

```css
/* Custom dashboard styles */
.supplier-dashboard {
  --dashboard-primary: #6366f1;
  --dashboard-secondary: #f3f4f6;
  --dashboard-accent: #10b981;
}

.dashboard-card {
  background: var(--dashboard-secondary);
  border: 1px solid var(--dashboard-primary);
}
```

## 🚨 Error Handling

### Common Issues

1. **Wallet Not Connected**
   - Prompt user to connect wallet
   - Show connection instructions

2. **Transaction Failed**
   - Display error message
   - Retry mechanism
   - Fallback options

3. **Data Loading Issues**
   - Loading states
   - Error boundaries
   - Retry functionality

### Error Recovery

```typescript
try {
  const result = await createProductListing(productData);
  // Handle success
} catch (error) {
  console.error("Product creation failed:", error);
  addAppNotification("Failed to create product", "error");
  // Show retry option
}
```

## 📱 Mobile Responsiveness

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop Enhancement**: Full feature set on larger screens

### Touch Interactions

- **Swipe Navigation**: Tab switching on mobile
- **Touch-friendly Buttons**: Larger touch targets
- **Mobile Menus**: Collapsible navigation

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Analytics**
   - Predictive analytics
   - Customer behavior analysis
   - Inventory optimization

2. **Automation**
   - Auto-restocking alerts
   - Price optimization
   - Order fulfillment automation

3. **Integration**
   - ERP system integration
   - Accounting software
   - Shipping providers

4. **AI Features**
   - Demand forecasting
   - Price recommendations
   - Customer insights

## 📞 Support

### Getting Help

- **Documentation**: Check this guide for common issues
- **Error Logs**: Review browser console for errors
- **Community**: Join MedChain community forums
- **Support Team**: Contact support for technical issues

### Troubleshooting

1. **Dashboard Not Loading**
   - Check wallet connection
   - Refresh page
   - Clear browser cache

2. **Products Not Showing**
   - Verify blockchain connection
   - Check product creation success
   - Review transaction status

3. **Orders Not Updating**
   - Check network connectivity
   - Verify blockchain sync
   - Refresh data manually

## 🎉 Success Metrics

### Key Performance Indicators

- **Product Listings**: Number of active products
- **Order Volume**: Total orders received
- **Revenue Growth**: Month-over-month increase
- **Customer Satisfaction**: Average ratings
- **Inventory Turnover**: Product movement rate

### Dashboard Benefits

- ✅ **Increased Efficiency**: Streamlined product management
- ✅ **Better Visibility**: Real-time performance tracking
- ✅ **Improved Sales**: Data-driven decision making
- ✅ **Customer Satisfaction**: Better order management
- ✅ **Blockchain Security**: Transparent and secure transactions

The Supplier Dashboard provides a comprehensive solution for medical suppliers to manage their marketplace presence, track performance, and grow their business through the MedChain platform.


