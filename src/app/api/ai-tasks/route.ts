import { getAiTodos, todoPrompt } from "@/lib/gemini";
import { NextResponse } from "next/server";



export async function POST(req:Request){

    try {
        const body = await req.json();
        const content = body.content
        const prompt = todoPrompt({topic:content})

        const text = await getAiTodos({ prompt });
    
        if (!text) {
            return NextResponse.json({ message: "Error fetching todos", todos: [] }, { status: 500 });
        }
        
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()
        const result = JSON.parse(cleanedText);

        return NextResponse.json({message:"Todo fetched successfully", todos:result})
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return NextResponse.json({ message: "Error processing AI response", todos: [] }, { status: 500 });
    }
}