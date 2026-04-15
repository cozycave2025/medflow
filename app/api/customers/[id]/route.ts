// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const customer = await Customer.findById(id);
        if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(customer);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, __v, createdAt, updatedAt, ...updateData } = body;
        const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
        if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(customer);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
