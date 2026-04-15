// app/api/customers/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET() {
    try {
        await connectToDatabase();
        const customers = await Customer.find({}).sort({ createdAt: -1 });
        return NextResponse.json(customers);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const customer = await Customer.create(body);
        return NextResponse.json(customer, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
