import { db } from "@/lib/db";
import { subtodoTable, todoTable } from "@/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";




export async function POST (req:Request){

    const body = await req.json();
    const id = body?.id

    if(!id){
        return NextResponse.json({ message: "Id not found", ok: false })
    };


    try {
        const existingSubTodo = await db
        .select()
        .from(subtodoTable)
        .where(eq(subtodoTable.id,id))
        .limit(1)


        if(existingSubTodo.length === 0){
            return NextResponse.json({ message: "SubTodo not found", ok: false });
        }

        const subTodo = existingSubTodo[0]
        const newCompletedState = !subTodo.completed;

        await db
        .update(subtodoTable)
        .set({completed:newCompletedState})
        .where(eq(subtodoTable.id,id));

        const allSubtodos = await db
        .select()
        .from(subtodoTable)
        .where(eq(subtodoTable.todoId,subTodo.id))

        const allCompleted = allSubtodos.every((t)=>t.completed || t.id == id && newCompletedState)

        if(allCompleted){
             await db.update(todoTable)
             .set({completed:true})
             .where(eq(todoTable.id,subTodo.todoId))
        }
        return NextResponse.json({
            message: "Success",
            ok: true,
            completed: newCompletedState,
        });
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            ok: false,
            error: (error as Error).message,
        });
    }

}