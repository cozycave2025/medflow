// app/api/suppliers/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Supplier from "@/models/Supplier";

export async function GET() {
    try {
        await connectToDatabase();
        const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
        return NextResponse.json(suppliers);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const supplier = await Supplier.create(body);
        return NextResponse.json(supplier, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
