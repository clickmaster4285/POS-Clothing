
export const customers= [
    { id: "CUST-10001", name: "Jane Taylor", email: "jane@example.com", phone: "(555) 123-4567", loyaltyPoints: 245, packages: "3 Basic", lifetimeValue: "$1,245.00", status: "Active", tier: "Gold", address: "123 Main Street", city: "Artesia", state: "CA", zip: "90701", joinDate: "Jan 2023", lastVisit: "2024-01-15", totalOrders: 24, driverLicense: "D1234567" },
    { id: "CUST-10002", name: "Bob Smith", email: "bob@example.com", phone: "(555) 234-5678", loyaltyPoints: 180, packages: "2 Basic", lifetimeValue: "$890.00", status: "Active", tier: "Silver", address: "456 Oak Ave", city: "Cerritos", state: "CA", zip: "90703", joinDate: "Mar 2023", lastVisit: "2024-01-10", totalOrders: 15 },
    { id: "CUST-10003", name: "Alice Johnson", email: "alice@example.com", phone: "(555) 345-6789", loyaltyPoints: 520, packages: "5 Premium", lifetimeValue: "$3,450.00", status: "Active", tier: "Gold", address: "789 Pine Rd", city: "Lakewood", state: "CA", zip: "90712", joinDate: "Dec 2022", lastVisit: "2024-01-18", totalOrders: 42 },
    { id: "CUST-10004", name: "Charlie Brown", email: "charlie@example.com", phone: "(555) 456-7890", loyaltyPoints: 90, packages: "1 Basic", lifetimeValue: "$450.00", status: "Inactive", tier: "Bronze", address: "321 Elm St", city: "Norwalk", state: "CA", zip: "90650", joinDate: "Jun 2023", lastVisit: "2023-12-01", totalOrders: 8 },
    { id: "CUST-10005", name: "Diana Prince", email: "diana@example.com", phone: "(555) 567-8901", loyaltyPoints: 310, packages: "4 Basic", lifetimeValue: "$2,100.00", status: "Active", tier: "Gold", address: "654 Maple Dr", city: "Downey", state: "CA", zip: "90241", joinDate: "Feb 2023", lastVisit: "2024-01-20", totalOrders: 30 },
    { id: "CUST-10006", name: "Ethan Hunt", email: "ethan@example.com", phone: "(555) 678-9012", loyaltyPoints: 150, packages: "2 Basic", lifetimeValue: "$780.00", status: "Active", tier: "Silver", address: "987 Cedar Ln", city: "Bellflower", state: "CA", zip: "90706", joinDate: "Aug 2023", lastVisit: "2024-01-12", totalOrders: 12 },
    { id: "CUST-10007", name: "Fiona Apple", email: "fiona@example.com", phone: "(555) 789-0123", loyaltyPoints: 75, packages: "1 Basic", lifetimeValue: "$320.00", status: "Inactive", tier: "Bronze", address: "147 Birch Way", city: "Paramount", state: "CA", zip: "90723", joinDate: "Oct 2023", lastVisit: "2023-11-20", totalOrders: 5 },
    { id: "CUST-10008", name: "George Lucas", email: "george@example.com", phone: "(555) 890-1234", loyaltyPoints: 410, packages: "3 Premium", lifetimeValue: "$2,890.00", status: "Active", tier: "Gold", address: "258 Walnut Ave", city: "Long Beach", state: "CA", zip: "90802", joinDate: "Apr 2023", lastVisit: "2024-01-19", totalOrders: 35 },
];



export const transactions = [
    { id: "1", receiptNumber: "R-2024-00127", date: "2024-01-27", customer: "John Smith", items: 5, totalTransaction: "$85.00", payment: "Credit Card", status: "Completed", receiptSent: true },
    { id: "2", receiptNumber: "TXN-2024-002", date: "2024-01-26", customer: "Sarah Johnson", items: 3, totalTransaction: "$45.50", payment: "Credit Card", status: "Completed", receiptSent: true },
    { id: "3", receiptNumber: "TXN-2024-003", date: "2024-01-25", customer: "Michael Davis", items: 8, totalTransaction: "$125.00", payment: "PayPal", status: "Completed", receiptSent: false },
    { id: "4", receiptNumber: "TXN-2024-004", date: "2024-01-25", customer: "Emily Brown", items: 2, totalTransaction: "$32.00", payment: "Credit Card", status: "Refunded", receiptSent: true },
    { id: "5", receiptNumber: "TXN-2024-005", date: "2024-01-24", customer: "Chris Wilson", items: 6, totalTransaction: "$95.00", payment: "Debit Card", status: "Completed", receiptSent: true },
    { id: "6", receiptNumber: "TXN-2024-006", date: "2024-01-23", customer: "Lucy Miller", items: 1, totalTransaction: "$18.00", payment: "Cash", status: "Completed", receiptSent: false },
    { id: "7", receiptNumber: "TXN-2024-007", date: "2024-01-22", customer: "James Taylor", items: 4, totalTransaction: "$62.00", payment: "Credit Card", status: "Exchanged", receiptSent: true },
    { id: "8", receiptNumber: "TXN-2024-008", date: "2024-01-21", customer: "Olivia Martinez", items: 9, totalTransaction: "$142.00", payment: "Apple Pay", status: "Completed", receiptSent: true },
    { id: "9", receiptNumber: "TXN-2024-009", date: "2024-01-20", customer: "William Thomas", items: 3, totalTransaction: "$55.00", payment: "Credit Card", status: "Completed", receiptSent: false },
    { id: "10", receiptNumber: "TXN-2024-010", date: "2024-01-19", customer: "Sophia Garcia", items: 7, totalTransaction: "$108.50", payment: "Bank Transfer", status: "Pending", receiptSent: false },
];



export const promotions = [
    { id: "1", name: "Buy 2 Get 1 Free - Beverages", type: "BOGO", qualifyingItems: "All Beverages (Offset)", discount: "$4.99", quantityRules: "Buy 2 get 1 free/customer/day", startDate: "01/01/2024", endDate: "03/31/2024", priority: "High", autoApply: true, status: "Active" },
    { id: "2", name: "Buy 2 Get 1 Free - Beverages", type: "BOGO", qualifyingItems: "All Beverages (Offset)", discount: "$4.99", quantityRules: "Buy 2 get 1 free/customer/day", startDate: "01/01/2024", endDate: "03/31/2024", priority: "High", autoApply: true, status: "Active" },
    { id: "3", name: "Buy 2 Get 1 Free - Beverages", type: "Discount", qualifyingItems: "All Beverages (Offset)", discount: "$4.99", quantityRules: "Buy 2 get 1 free/customer/day", startDate: "01/01/2024", endDate: "03/31/2024", priority: "Medium", autoApply: false, status: "Active" },
    { id: "4", name: "Buy 2 Get 1 Free - Beverages", type: "BOGO", qualifyingItems: "All Beverages (Offset)", discount: "$4.99", quantityRules: "Buy 2 get 1 free/customer/day", startDate: "01/01/2024", endDate: "03/31/2024", priority: "High", autoApply: true, status: "Active" },
    { id: "5", name: "Buy 2 Get 1 Free - Beverages", type: "Bundle", qualifyingItems: "All Beverages (Offset)", discount: "15% off", quantityRules: "Buy 2 get 1 free/customer/day", startDate: "01/01/2024", endDate: "03/31/2024", priority: "Low", autoApply: true, status: "Scheduled" },
    { id: "6", name: "Buy 2 Get 1 Free - Beverages", type: "BOGO", qualifyingItems: "All Beverages (Offset)", discount: "$4.99", quantityRules: "Buy 2 get 1 free/customer/day", startDate: "01/01/2024", endDate: "03/31/2024", priority: "High", autoApply: true, status: "Active" },
];



export const specialItems = [
    { id: "1", name: "Banana", price: "$0.69/lb", plu: "4011", type: "weighted", weight: "1.5", weightUnit: "lb" },
    { id: "2", name: "Premium Whiskey 750ml", price: "$34.99", plu: "8001", type: "age-restricted", ageRequired: 21 },
    { id: "3", name: "Craft IPA 6-pack", price: "$12.99", plu: "8002", type: "age-restricted", ageRequired: 21 },
    { id: "4", name: "California CRV - Aluminum Can", price: "$0.05", plu: "CRV001", type: "bottle-deposit", depositAmount: "$0.05" },
    { id: "5", name: "California CRV - Plastic Bottle", price: "$0.10", plu: "CRV002", type: "bottle-deposit", depositAmount: "$0.10" },
    { id: "6", name: "Powerball", price: "$2.00", plu: "LOT001", type: "lottery" },
    { id: "7", name: "Mega Millions", price: "$2.00", plu: "LOT002", type: "lottery" },
    { id: "8", name: "Scratch-Off", price: "$5.00", plu: "LOT003", type: "lottery" },
];

export const customerStats = {
    totalCustomers: 10,
    goldMembers: 3,
    newCustomers: 4,
    activeMembers: 3,
};

export const exchangeItems = [
    { id: "EX-1", name: "Wireless Mouse", price: "$24.99", barcode: "FX-90785" },
    { id: "EX-2", name: "USB-C Cable 6ft", price: "$9.99", barcode: "FX-90786" },
    { id: "EX-3", name: "Wireless Mouse Pro", price: "$39.99", barcode: "FX-90787" },
    { id: "EX-4", name: "Wireless Mouse Pad", price: "$12.99", barcode: "FX-90788" },
];
