

export async function fetchDashboardStats() {
 
    return {
        salesToday: 6250,
        salesChange: 8.4,
        transactionsToday: 426,
        transactionsChange: 6.45,
        avgTransactionValue: 43.30,
        avgTransactionChange: -6.4,
        itemsSold: 2184,
        itemsSoldChange: 8.4,
    };
}

export async function fetchHourlySales(){
   
    return [
        { hour: "9 AM", sales: 320 },
        { hour: "10 AM", sales: 980 },
        { hour: "11 AM", sales: 1450 },
        { hour: "12 PM", sales: 2100 },
        { hour: "1 PM", sales: 2650 },
        { hour: "2 PM", sales: 2200 },
        { hour: "3 PM", sales: 2800 },
        { hour: "4 PM", sales: 2400 },
        { hour: "5 PM", sales: 2950 },
        { hour: "6 PM", sales: 3200 },
        { hour: "7 PM", sales: 2700 },
        { hour: "8 PM", sales: 1800 },
    ];
}

export async function fetchPaymentBreakdown() {
  
    return [
        { method: "Card", value: 45, color: "hsl(14, 90%, 55%)" },
        { method: "Cash", value: 30, color: "hsl(220, 20%, 25%)" },
        { method: "Digital Wallet", value: 18, color: "hsl(220, 14%, 80%)" },
        { method: "Other", value: 7, color: "hsl(220, 14%, 92%)" },
    ];
}

export async function fetchTopProducts(){
 
    return [
        { name: "Milk 1L", sales: 2340 },
        { name: "Eggs (Dozen)", sales: 1980 },
        { name: "Bread", sales: 1620 },
        { name: "Apples", sales: 1130 },
    ];
}

export async function fetchLowStockAlerts() {
   
    return [
        { name: "Rice 5kg", level: "critical" },
        { name: "Cooking Oil", level: "low" },
        { name: "Sugar", level: "low" },
    ];
}

export async function fetchActivePromotions() {

    return [
        { name: "Buy 1 Get 1 – Snacks", revenue: 2340 },
        { name: "10% Off Dairy", revenue: 1980 },
        { name: "Weekend Combo Deal", revenue: 1620 },
    ];
}
