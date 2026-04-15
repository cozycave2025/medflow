// app/api/settings/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Setting from "@/models/Setting";

export async function GET() {
    try {
        await connectToDatabase();
        const settings = await Setting.find({});
        return NextResponse.json(settings);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { key, value } = body;
        const setting = await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
        return NextResponse.json(setting);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
