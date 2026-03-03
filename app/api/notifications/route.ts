// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET() {
    try {
        await connectToDatabase();
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        return NextResponse.json(notifications);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { id, status } = body;
        const notification = await Notification.findByIdAndUpdate(id, { status }, { new: true });
        if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(notification);
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE() {
    try {
        await connectToDatabase();
        await Notification.deleteMany({ status: 'read' });
        return NextResponse.json({ message: "Read notifications cleared" });
    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
