
"use client"
import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface savingTodo{
 title:string,
 todos:string[],
}

const NewTodo = () => {

    const host = process.env.NEXT_PUBLIC_HOST;

    const router = useRouter()
    const [content,setContent] = useState<string>("")
    const [data,setData] = useState<string[]>([])
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [todos,setTodos] = useState<string[]>([])
    const [customTitle,setCustomTitle] = useState<string>("")
    const addTodo =(each:string)=>{

        setTodos((prevTodos)=>
            prevTodos.includes(each)
                ? prevTodos.filter((item) => item !== each)
                :[...prevTodos,each]
            )
        }
    const submit =async()=>{

        if(!content.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${host}/api/ai-tasks`, {
                body: JSON.stringify({ content }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json()
            setData(result?.todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
        } finally {
            setLoading(false);
        }
    }

    //saving to db

    const save = async ()=>{

        if(todos.length ==0) return;

        setSaveLoading(true)
        const value:savingTodo ={title:'',todos:['']};

        value.title = customTitle.length>0 ? customTitle : content;
        value.todos= todos;

        try {
            const response = await fetch(`${host}/api/todo/save`, {
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
                toast.success("Todo added successfully")
                router.push("/")
            }
            else {
                toast.error("Error while fetching try again")
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

  return (
    <section className="max-w-3xl w-full mx-auto p-6 space-y-4 min-h-[100dvh] text-white">

            <Image src="/search-bg.webp" width={800} height={800} alt='backGroung' className='fixed top-0 left-0 right-0 object-center -z-20 object-cover w-full h-full ' />
          <div className='-z-10 fixed top-0 left-0 right-0 object-center object-cover w-full h-full bg-[#000]/40 backdrop-blur-md'></div>
              <NavBar />
              <h1 className="text-2xl font-bold">Search By Title</h1>
            
            <div className='flex gap-2 mb-8 z-10'>
                <Input onChange={(e)=>setContent(e.target.value)} className='bg-[#fff]/50 backdrop-blur-sm text-gray-700' value={content} placeholder='Learn python ...'/>
                <Button onClick={submit} className='bg-blue-500 text-black hover:bg-blue-400 cursor-pointer'>{loading ? 'Searching ...':'Search'}</Button>
            </div>

            {data.length >0 ? (
                <div className='w-full z-10  bg-[#fff]/40 backdrop-blur-md py-2 px-2 md:px-4 rounded-md flex border-[1px] flex-col gap-2'>
                  <div className='flex items-center justify-between bg-black py-1 px-2 rounded-md'>
                    <h3>Todos</h3>
                    <h3>Add</h3>
                  </div>
                    {data.map((item,indx)=>(
                        <div key={indx} className='flex items-center justify-between'>
                            {item}
                            <Input onChange={()=>addTodo(item)} checked={todos.includes(item)} type='checkbox' className='w-10'/>
                        </div>
                    ))}

                    <div className='mx-auto max-w-sm'>
                      <h3 className='text-sm text-black font-semibold'>Title : &quot;{content}&quot; or give a custom one</h3>
                        <div className='flex  justify-between gap-2'>
                            <Input onChange={(e)=>setCustomTitle(e.target.value)} value={customTitle} className='bg-gray-200 text-black'/>
                            <Button onClick={save}>{saveLoading ? 'Saving ...':'Save'}</Button>
                        </div>
                    </div>
                </div>
            ):(
            
                <Image src="/search.png" alt='Search' width={300} height={300} className='mx-auto' />

            )}
              
    </section>
  )
}

export default NewTodo