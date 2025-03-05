"use client"

import { SelectSubtodo } from "@/schema"
import { Input } from "./ui/input"
import { useState } from "react"
import { toast } from 'sonner'
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"


const Card = ({ todo, subTodo }: { todo: { id: number, title: string, completed: boolean }, subTodo: SelectSubtodo[] }) => {

    const host = process.env.NEXT_PUBLIC_HOST;
    const path = usePathname();
    const [loading, setLoading] = useState(false);
    const [editable,seteditable] = useState(false)
    const [localSubTodo, setLocalSubTodo] = useState(subTodo);
    const [saveLoading, setSaveLoading] = useState(false);

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

    //delete todo

    const deleteTodo = async(id:number)=>{
        try {
            setLoading(true)
            const response = await fetch(`${host}/api/todo/delete`, {
                body: JSON.stringify({ id }),
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json()
            if (!result.ok) {
                toast.error("Error while deleting todo")
                return;
            }

            
            toast.success("Todo deleted")
            window.location.reload()
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

    //add new subtodo

    const addEmpty =()=>{

        const newSubTodo ={
            id:Date.now(),
            title:'',
            completed:false,
            todoId:todo.id
        }
        setLocalSubTodo((prev)=>[...prev,newSubTodo])
    }

    //delete locally subtodo

    const deleteSubTodo = (id:number)=>{
        setLocalSubTodo((prev)=> prev.filter((item)=>item.id !== id))
    }
    const saveChangedTodo =async()=>{

        const newtodos = localSubTodo.map((item)=>{
            return item.title;
        })
        if (newtodos.length ==0) return;
        
                setSaveLoading(true)

                const value ={
                    title:todo.title,
                    todos:newtodos,
                    todoId:todo.id
                };
        
                try {
                    const response = await fetch(`${host}/api/todo/saveChanges`, {
                        body: JSON.stringify({ value }),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
        
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
        
                    const result = await response.json()
        
                    if(result.ok){
                        
                        toast.success("Todo Edited successfully")
                        seteditable(false);
                        setTimeout(()=>window.location.reload(),1000)
                    }
                    else {
                        toast.error("Error while Editing try again")
                    }
                } catch (error:unknown) {
                    if (error instanceof Error) {
                        toast.error(error.message);
                    } else {
                        toast.error("An unexpected error occurred");
                    }
                } finally {
                    setSaveLoading(false);
                }
    }

    const completedCount = localSubTodo.filter((t) => t.completed).length;
    const progressValue = localSubTodo.length
        ? (completedCount / localSubTodo.length) * 100
        : 0;

    if(progressValue >90 && path=== "/"){
        window.location.reload();
    }
    if (progressValue == 100 && path == "/") {
        
        return null;
    }
    return (

        <div className="mt-2 w-full hover:bg-[#000]/20 backdrop-blur-md border-[1px] hover:border-[#000]/60 py-1 px-2 rounded-md bg-[#fff]/40 text-black hover:text-white border-[#fff]/40 transition-all duration-500 flex flex-col justify-between ">

            <div className="w-full bg-pink-300/40 backdrop-blur-md py-1 px-1 rounded-md">
                <div className="flex gap-2 items-center justify-between">
                    <h2 className="text-sm">Completed</h2>
                    {path !== "/completed" && (
                        <div className="flex justify-between w-[50%] gap-2 items-center">
                            <div className="w-full bg-gray-300 h-2 rounded-md overflow-hidden">
                                <div
                                    className="h-full bg-black transition-all duration-300 rounded-md"
                                    style={{ width: `${progressValue}%` }}
                                />
                            </div>
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

            <div className="flex w-full justify-between mt-1 gap-2">
                { path !== '/completed' && (
                    <Button onClick={() => { seteditable(true) }} className="bg-green-300 flex-1">Edit</Button>
                )}
                <Button onClick={()=>deleteTodo(todo.id)} className="bg-red-300 flex-1 ">Delete</Button>
            </div>

            {editable && (
                <div className="fixed hover:text-black py-2 px-2 left-0 top-0  w-full min-h-full  bg-[#fff] backdrop-blur-md flex flex-col gap-1">
                    <div className="w-full flex justify-between">
                        <p className="font-semibold">Title</p>
                        <p className="capitalize font-semibold">{todo?.title}</p>
                    </div>
                    <hr className="mt-1 mb-1 h-[1px] w-full bg-pink-500" />
                    {localSubTodo.map((item) => (
                        <div key={item.id} className="flex gap-1 justify-between items-center">
                           
                                <Input
                                    value={item.title}
                                    className="w-full"
                                    onChange={(e) =>
                                        setLocalSubTodo((prev) =>
                                            prev.map((t) =>
                                                t.id === item.id ? { ...t, title: e.target.value } : t
                                            )
                                        )
                                    }
                                />
                            <Button className="bg-red-400" onClick={() => { deleteSubTodo(item.id) }} disabled={saveLoading}>Delete</Button>
                        </div>
                        
                    ))}
                    <Button className="bg-green-400 text-white mt-2" onClick={addEmpty} disabled={saveLoading}>Add New</Button>
                    <Button className="bg-black text-white" onClick={saveChangedTodo} disabled={saveLoading}>{saveLoading ? 'Saving Changes ...' :'Save Changes'}</Button>
                </div>
            )}
        </div>
    )
}

export default Card