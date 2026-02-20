// ============================================================
// Dummy data for POS Reports & Analysis
// Replace each export with API calls when integrating backend
// ============================================================

// ---------- Sales Summary ----------
export const salesSummaryKPIs = {
  totalSales: 52436.0,
  transactions: 8,
  averageOrderValue: 6554.5,
  returns: 412.0,
  netSales: 1341,
};

export const salesByHour = [
  { hour: "9AM", sales: 1200 },
  { hour: "10AM", sales: 2800 },
  { hour: "11AM", sales: 3500 },
  { hour: "12PM", sales: 5200 },
  { hour: "1PM", sales: 4800 },
  { hour: "2PM", sales: 3100 },
  { hour: "3PM", sales: 4200 },
  { hour: "4PM", sales: 5800 },
  { hour: "5PM", sales: 6100 },
  { hour: "6PM", sales: 4500 },
  { hour: "7PM", sales: 3200 },
  { hour: "8PM", sales: 2100 },
];

export const paymentMethodBreakdown = [
  { method: "Cash", value: 35, color: "hsl(var(--chart-1))" },
  { method: "Credit Card", value: 40, color: "hsl(var(--chart-2))" },
  { method: "Mobile Pay", value: 15, color: "hsl(var(--chart-3))" },
  { method: "Store Credit", value: 10, color: "hsl(var(--chart-4))" },
];

export const monthlySalesData = [
  { month: "Jan", current: 42000, previous: 38000 },
  { month: "Feb", current: 38000, previous: 35000 },
  { month: "Mar", current: 45000, previous: 40000 },
  { month: "Apr", current: 52000, previous: 42000 },
  { month: "May", current: 48000, previous: 45000 },
  { month: "Jun", current: 56000, previous: 48000 },
  { month: "Jul", current: 61000, previous: 50000 },
  { month: "Aug", current: 58000, previous: 52000 },
  { month: "Sep", current: 64000, previous: 55000 },
  { month: "Oct", current: 70000, previous: 58000 },
  { month: "Nov", current: 75000, previous: 62000 },
  { month: "Dec", current: 82000, previous: 68000 },
];

// ---------- Product Performance ----------
export const topSellingProducts = [
  { name: "Classic White T-Shirt", sku: "CWT-001", category: "Tops", sold: 342, revenue: 8550, stock: 128 },
  { name: "Slim Fit Jeans", sku: "SFJ-012", category: "Bottoms", sold: 287, revenue: 14350, stock: 64 },
  { name: "Floral Summer Dress", sku: "FSD-045", category: "Dresses", sold: 198, revenue: 11880, stock: 45 },
  { name: "Leather Belt", sku: "LB-023", category: "Accessories", sold: 176, revenue: 5280, stock: 89 },
  { name: "Cotton Hoodie", sku: "CH-078", category: "Outerwear", sold: 154, revenue: 9240, stock: 37 },
  { name: "Denim Jacket", sku: "DJ-034", category: "Outerwear", sold: 132, revenue: 11220, stock: 22 },
  { name: "Running Sneakers", sku: "RS-056", category: "Footwear", sold: 121, revenue: 10890, stock: 41 },
  { name: "Silk Scarf", sku: "SS-089", category: "Accessories", sold: 98, revenue: 4900, stock: 156 },
];

export const salesByCategory = [
  { category: "Tops", value: 28 },
  { category: "Bottoms", value: 22 },
  { category: "Dresses", value: 18 },
  { category: "Outerwear", value: 15 },
  { category: "Accessories", value: 10 },
  { category: "Footwear", value: 7 },
];

export const salesByDepartment = [
  { department: "Women's", sales: 38500 },
  { department: "Men's", sales: 32100 },
  { department: "Kids", sales: 12800 },
  { department: "Accessories", sales: 8400 },
  { department: "Footwear", sales: 6200 },
];

// ---------- Inventory / Stock ----------
export const inventoryKPIs = {
  totalItems: 124902,
  lowStockItems: 23,
  outOfStock: 7,
  criticalAlerts: 4,
};

export const stockLevels = [
  { name: "Classic White T-Shirt", sku: "CWT-001", category: "Tops", inStock: 128, reorderLevel: 50, status: "In Stock" },
  { name: "Slim Fit Jeans", sku: "SFJ-012", category: "Bottoms", inStock: 64, reorderLevel: 40, status: "In Stock" },
  { name: "Floral Summer Dress", sku: "FSD-045", category: "Dresses", inStock: 12, reorderLevel: 30, status: "Low Stock" },
  { name: "Leather Belt", sku: "LB-023", category: "Accessories", inStock: 89, reorderLevel: 25, status: "In Stock" },
  { name: "Cotton Hoodie", sku: "CH-078", category: "Outerwear", inStock: 5, reorderLevel: 20, status: "Low Stock" },
  { name: "Denim Jacket", sku: "DJ-034", category: "Outerwear", inStock: 0, reorderLevel: 15, status: "Out of Stock" },
  { name: "Running Sneakers", sku: "RS-056", category: "Footwear", inStock: 41, reorderLevel: 20, status: "In Stock" },
  { name: "Silk Scarf", sku: "SS-089", category: "Accessories", inStock: 0, reorderLevel: 30, status: "Out of Stock" },
];

// ---------- Financial ----------
export const financialKPIs = {
  revenue: 376450,
  expenses: 89200,
  grossProfit: 287250,
  profitMargin: 76.3,
};

export const revenueVsExpenses = [
  { month: "Jan", revenue: 42000, expenses: 12000 },
  { month: "Feb", revenue: 38000, expenses: 11000 },
  { month: "Mar", revenue: 45000, expenses: 13500 },
  { month: "Apr", revenue: 52000, expenses: 14000 },
  { month: "May", revenue: 48000, expenses: 12500 },
  { month: "Jun", revenue: 56000, expenses: 15000 },
  { month: "Jul", revenue: 61000, expenses: 16200 },
  { month: "Aug", revenue: 58000, expenses: 15800 },
  { month: "Sep", revenue: 64000, expenses: 17000 },
  { month: "Oct", revenue: 70000, expenses: 18500 },
  { month: "Nov", revenue: 75000, expenses: 19200 },
  { month: "Dec", revenue: 82000, expenses: 20500 },
];

export const incomeStatement = [
  { label: "Gross Revenue", amount: 376450 },
  { label: "Returns & Discounts", amount: -12300 },
  { label: "Net Revenue", amount: 364150, isBold: true },
  { label: "Cost of Goods Sold", amount: -89200 },
  { label: "Gross Profit", amount: 274950, isBold: true },
  { label: "Rent & Utilities", amount: -18000 },
  { label: "Salaries & Wages", amount: -45000 },
  { label: "Marketing", amount: -8500 },
  { label: "Other Expenses", amount: -5200 },
  { label: "Net Operating Income", amount: 198250, isBold: true },
];

// ---------- Customer Analytics ----------
export const customerKPIs = {
  totalCustomers: 12450,
  newCustomers: 6830,
  avgSpend: 841.0,
  loyaltyMembers: 1240,
};

export const customerGrowth = [
  { month: "Jan", customers: 9800 },
  { month: "Feb", customers: 10100 },
  { month: "Mar", customers: 10450 },
  { month: "Apr", customers: 10800 },
  { month: "May", customers: 11100 },
  { month: "Jun", customers: 11400 },
  { month: "Jul", customers: 11650 },
  { month: "Aug", customers: 11900 },
  { month: "Sep", customers: 12050 },
  { month: "Oct", customers: 12200 },
  { month: "Nov", customers: 12350 },
  { month: "Dec", customers: 12450 },
];

export const topCustomers = [
  { name: "Sarah Johnson", orders: 24, totalSpent: 4850, lastVisit: "2024-01-15" },
  { name: "Michael Chen", orders: 19, totalSpent: 3720, lastVisit: "2024-01-14" },
  { name: "Emma Williams", orders: 17, totalSpent: 3100, lastVisit: "2024-01-12" },
  { name: "James Brown", orders: 15, totalSpent: 2890, lastVisit: "2024-01-10" },
  { name: "Olivia Davis", orders: 14, totalSpent: 2650, lastVisit: "2024-01-08" },
];

export const customerRetentionReasons = [
  { reason: "Quality Products", value: 35 },
  { reason: "Loyalty Program", value: 25 },
  { reason: "Customer Service", value: 20 },
  { reason: "Pricing", value: 12 },
  { reason: "Convenience", value: 8 },
];
