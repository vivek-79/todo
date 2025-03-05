"use client"

import { SelectSubtodo } from "@/schema"
import { Progress } from "./ui/progress"
import { Input } from "./ui/input"
import { useState } from "react"
import { toast } from 'sonner'
import { usePathname } from "next/navigation"


const Card = ({ todo, subTodo }: { todo: { id: number, title: string, completed: boolean }, subTodo: SelectSubtodo[] }) => {

    const host = process.env.NEXT_PUBLIC_HOST;
    const path = usePathname();
    const [loading, setLoading] = useState(false);
    const [localSubTodo, setLocalSubTodo] = useState(subTodo);

    const saveChanges = async (id: number) => {

        try {
            setLoading(true)
            const response = await fetch(`${host}/api/todo/edit`, {
                body: JSON.stringify({ id }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json()
            if (!result.ok) {
                toast.error("Error while saving changes")
                return;
            }

            setLocalSubTodo((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, completed: !task.completed } : task
                )
            )
            toast.success("Task Completed successfully")
        } catch (error: unknown) {

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    const completedCount = localSubTodo.filter((t) => t.completed).length;
    const progressValue = localSubTodo.length
        ? (completedCount / localSubTodo.length) * 100
        : 0;

    if (progressValue == 100 && path == "/") {
        return null;
    }
    return (

        <div className="mt-2 w-full hover:bg-[#000]/20 backdrop-blur-md border-[1px] hover:border-[#000]/60 py-1 px-2 rounded-md bg-[#fff]/40 text-black hover:text-white border-[#fff]/40 transition-all duration-500">

            <div className="w-full bg-pink-300/40 backdrop-blur-md py-1 px-1 rounded-md">
                <div className="flex gap-2 items-center justify-between">
                    <h2 className="text-sm">Completed</h2>
                    {path !== "/completed" && (
                        <div className="flex justify-between w-[50%] gap-2 items-center">
                            <Progress className="bg-white/40 " value={progressValue} />
                            <p>{Math.round(progressValue)}%</p>
                        </div>
                    )}
                </div>

                <hr className="mt-1 mb-1 h-[1px] w-full bg-pink-500" />
                <div className="w-full flex justify-between">
                    <p className="font-semibold">Title</p>
                    <p className="capitalize font-semibold">{todo?.title}</p>
                </div>
            </div>

            {localSubTodo.length > 0 && (
                <div className="w-full flex flex-col gap-1 mt-2">
                    {localSubTodo.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">

                            {item.title}
                            {path !== "/completed" && (
                                <Input type="checkbox" onChange={() => { saveChanges(item.id) }} className="w-10 min-w-12" checked={item.completed} disabled={loading} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Card