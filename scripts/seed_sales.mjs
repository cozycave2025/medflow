// scripts/seed_sales.mjs
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://mongo:QnUsaNKEfbuXEsZsxPgYbkfNzrOxbaeg@switchyard.proxy.rlwy.net:47719";

async function seedSales() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const medicines = await mongoose.connection.collection('medicines').find({}).toArray();
        if (medicines.length === 0) {
            console.log("No medicines found. Seed medicines first.");
            process.exit(1);
        }

        const salesData = [
            {
                customerName: "Alice Johnson",
                items: [
                    { medicineId: medicines[0]._id.toString(), name: medicines[0].name, quantity: 2, price: medicines[0].price }
                ],
                totalAmount: "$40.00",
                profit: "$8.00",
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                customerName: "Bob Smith",
                items: [
                    { medicineId: medicines[1]._id.toString(), name: medicines[1].name, quantity: 1, price: medicines[1].price }
                ],
                totalAmount: "$25.00",
                profit: "$5.00",
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await mongoose.connection.collection('sales').insertMany(salesData);
        console.log("Sales seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
}

seedSales();
