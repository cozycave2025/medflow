// app/api/medicines/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Medicine from "@/models/Medicine";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const medicine = await Medicine.findById(id);
        if (!medicine) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(medicine);
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
        const medicine = await Medicine.findByIdAndUpdate(id, updateData, { new: true });
        if (!medicine) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(medicine);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const medicine = await Medicine.findByIdAndDelete(id);
        if (!medicine) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
