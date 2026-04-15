// app/dashboard/lib/data.ts

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const API_ENDPOINTS: Record<string, string> = {
    medicines: '/api/medicines',
    customers: '/api/customers',
    expenses: '/api/expenses',
    suppliers: '/api/suppliers',
    sales: "/api/sales",
    settings: "/api/settings",
    notifications: "/api/notifications",
};

export const statCards = [
    { id: 1, title: "Today Sales", value: "$1,240", trend: "+12.5%", color: "cyan" },
    { id: 2, title: "Total Inventory", value: "842 Items", trend: "0.2%", color: "blue" },
    { id: 3, title: "Expiring Soon", value: "12 Items", trend: "-2", color: "orange", warning: true },
    { id: 4, title: "Monthly Expenses", value: "$4,850", trend: "+5.1%", color: "teal" },
];

export const medicinesData = [
    { id: 1, name: "Amoxicillin 500mg", batch: "AMX-102", expiry: "2026-03-12", stock: 120, price: "$12.00" },
    { id: 2, name: "Paracetamol Syrup", batch: "PAR-992", expiry: "2026-04-05", stock: 45, price: "$8.50" },
    { id: 3, name: "Ibuprofen Tabs", batch: "IBU-551", expiry: "2026-06-20", stock: 300, price: "$5.20" },
    { id: 4, name: "Cetrizine Drops", batch: "CET-004", expiry: "2026-03-20", stock: 12, price: "$15.00" },
];

export const expensesData = [
    { id: 1, date: "2026-02-14", title: "Shop Electricity", amount: "$120.00", notes: "Monthly utility bill" },
    { id: 2, date: "2026-02-12", title: "Cleaning Supplies", amount: "$45.50", notes: "Floor cleaner and soap" },
    { id: 3, date: "2026-02-10", title: "Internet Subscription", amount: "$60.00", notes: "Monthly fiber connection" },
];

export const customersData = [
    { id: 1, name: "Hassan Raza", phone: "+92 300 1234567", purchases: "$1,200.00" },
    { id: 2, name: "Fatima Amin", phone: "+92 321 7654321", purchases: "$850.50" },
    { id: 3, name: "Omar Khalid", phone: "+92 333 9988776", purchases: "$2,400.00" },
];

export const suppliersData = [
    { id: 1, name: "MediLife Pharma Ltd.", phone: "+92 42 111 222 33", purchases: "$15,000.00" },
    { id: 2, name: "Z-Pills Distributors", phone: "+92 21 34567890", purchases: "$8,200.50" },
    { id: 3, name: "SafeCare Wholesalers", phone: "+92 51 0987654", purchases: "$12,400.00" },
];

export const weeklySales = [40, 70, 45, 90, 65, 80, 55];
