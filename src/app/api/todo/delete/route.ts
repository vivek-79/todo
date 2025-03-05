import { db } from "@/lib/db";
import { subtodoTable, todoTable } from "@/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const id = body?.id

        if (!id) {
            return NextResponse.json({ message: "Todo ID is required", ok: false });
        }

        // Delete all sub-todos related to the todo
        await db.delete(subtodoTable).where(eq(subtodoTable.todoId, id));

        // Delete the main todo
        await db.delete(todoTable).where(eq(todoTable.id, id));

        return NextResponse.json({ message: "Todo and sub-todos deleted", ok: true });
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            ok: false,
            error: (error as Error).message
        });
    }
}
