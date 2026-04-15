// app/api/sales/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Sale from "@/models/Sale";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const sale = await Sale.findById(id);
        if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(sale);
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
        const sale = await Sale.findByIdAndUpdate(id, updateData, { new: true });
        if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(sale);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const sale = await Sale.findByIdAndDelete(id);
        if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
