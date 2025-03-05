import { db } from "@/lib/db";
import { todoTable, subtodoTable } from "@/schema";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const userId = user?.publicMetadata.userId as number
        if (!userId) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const {title,todos} = body.value;
        console.log(body)
        if (!title || !todos.length) {
            return NextResponse.json({ ok: false, message: "Invalid data" }, { status: 400 });
        }

        // Insert main todo
        const [newTodo] = await db.insert(todoTable).values({
            userId,
            title,
            completed: false,
        }).returning();

        // Insert subtodos
        if (newTodo && todos.length > 0) {
            await db.insert(subtodoTable).values(
                todos.map((task: string) => ({
                    todoId: newTodo.id,
                    title: task,
                    completed: false,
                }))
            );
        }

        return NextResponse.json({ ok: true, message: "Todo saved successfully!" });
    } catch (error) {
        console.error("Error saving todo:", error);
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}
