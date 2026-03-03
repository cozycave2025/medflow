// app/api/medicines/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Medicine from "@/models/Medicine";

export async function GET() {
    try {
        await connectToDatabase();
        const medicines = await Medicine.find({}).sort({ createdAt: -1 });
        return NextResponse.json(medicines);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const medicine = await Medicine.create(body);
        return NextResponse.json(medicine, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
