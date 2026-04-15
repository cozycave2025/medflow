// app/api/suppliers/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Supplier from "@/models/Supplier";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const supplier = await Supplier.findById(id);
        if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(supplier);
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
        const supplier = await Supplier.findByIdAndUpdate(id, updateData, { new: true });
        if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(supplier);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const supplier = await Supplier.findByIdAndDelete(id);
        if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
