// app/api/expenses/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Expense from "@/models/Expense";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const expense = await Expense.findById(id);
        if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(expense);
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
        const expense = await Expense.findByIdAndUpdate(id, updateData, { new: true });
        if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(expense);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
