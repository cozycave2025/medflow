// scripts/seed.mjs
const BASE_URL = 'http://localhost:3000/api';

const medicinesData = [
    { name: "Amoxicillin 500mg", batch: "AMX-102", expiry: "2026-03-12", stock: 120, price: "$12.00" },
    { name: "Paracetamol Syrup", batch: "PAR-992", expiry: "2026-04-05", stock: 45, price: "$8.50" },
    { name: "Ibuprofen Tabs", batch: "IBU-551", expiry: "2026-06-20", stock: 300, price: "$5.20" },
    { name: "Cetrizine Drops", batch: "CET-004", expiry: "2026-03-20", stock: 12, price: "$15.00" },
];

const expensesData = [
    { date: "2026-02-14", title: "Shop Electricity", amount: "$120.00", notes: "Monthly utility bill" },
    { date: "2026-02-12", title: "Cleaning Supplies", amount: "$45.50", notes: "Floor cleaner and soap" },
    { date: "2026-02-10", title: "Internet Subscription", amount: "$60.00", notes: "Monthly fiber connection" },
];

const customersData = [
    { name: "Hassan Raza", phone: "+92 300 1234567", purchases: "$1,200.00" },
    { name: "Fatima Amin", phone: "+92 321 7654321", purchases: "$850.50" },
    { name: "Omar Khalid", phone: "+92 333 9988776", purchases: "$2,400.00" },
];

const suppliersData = [
    { name: "MediLife Pharma Ltd.", phone: "+92 42 111 222 33", purchases: "$15,000.00" },
    { name: "Z-Pills Distributors", phone: "+92 21 34567890", purchases: "$8,200.50" },
    { name: "SafeCare Wholesalers", phone: "+92 51 0987654", purchases: "$12,400.00" },
];

async function seed() {
    console.log("Starting seed process...");

    const targets = [
        { endpoint: 'medicines', data: medicinesData },
        { endpoint: 'expenses', data: expensesData },
        { endpoint: 'customers', data: customersData },
        { endpoint: 'suppliers', data: suppliersData },
    ];

    for (const target of targets) {
        console.log(`Seeding ${target.endpoint}...`);
        for (const item of target.data) {
            try {
                const response = await fetch(`${BASE_URL}/${target.endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                });
                if (response.ok) {
                    console.log(`  Added: ${item.name || item.title}`);
                } else {
                    console.error(`  Failed to add: ${item.name || item.title}`, await response.text());
                }
            } catch (error) {
                console.error(`  Error adding ${item.name || item.title}:`, error.message);
            }
        }
    }

    console.log("Seed process completed.");
}

seed();
