// app/api/expenses/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Expense from "@/models/Expense";

export async function GET() {
    try {
        await connectToDatabase();
        const expenses = await Expense.find({}).sort({ date: -1 });
        return NextResponse.json(expenses);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const expense = await Expense.create(body);
        return NextResponse.json(expense, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
