// app/api/sales/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Sale from "@/models/Sale";

export async function GET() {
    try {
        await connectToDatabase();
        const sales = await Sale.find().sort({ createdAt: -1 });
        return NextResponse.json(sales);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const sale = await Sale.create(body);
        return NextResponse.json(sale, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
