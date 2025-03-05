import NavBar from "@/components/NavBar";
import { db } from "@/lib/db";
import { subtodoTable, todoTable } from "@/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import DisplayTodos from "@/components/DisplayTodos";
import Image from "next/image";

const Completed = async() => {

    const user = await currentUser();
    const userId = user?.publicMetadata.userId as number

    const tasks = await db
        .select({
            todo: todoTable,
            subTodo: subtodoTable,
        })
        .from(todoTable)
        .leftJoin(subtodoTable, eq(todoTable.id, subtodoTable.todoId))
        .where(and(eq(todoTable.userId, userId), eq(todoTable.completed, true)))


    const groupedTasks = new Map();

    tasks.forEach(({ todo, subTodo }) => {
        if (!groupedTasks.has(todo.id)) {
            groupedTasks.set(todo.id, { ...todo, subTodos: [] });
        }
        if (subTodo) {
            groupedTasks.get(todo.id).subTodos.push(subTodo);
        }
    });

    const result = Array.from(groupedTasks.values());

  return (
      <section className='max-w-3xl w-full mx-auto p-6 space-y-4  min-h-[100dvh] text-white'>
        <Image src="/completed.webp" alt='Completed todo background' width={700} height={700} className='fixed -z-20 top-0 left-0 w-full h-full object-center object-cover'/>
        <div className='-z-10 fixed top-0 left-0 w-full h-full object-center object-cover bg-[#000]/30 backdrop-blur-md'></div>

        <div className="z-50">
            <NavBar />
              
             
           <div className="mt-6 px-2 md:px-6">
                  <h1 className="text-2xl font-bold pb-4">Completed Todos</h1>
                  {result.length ? (
                      <DisplayTodos tasks={result} />
                  ) : (
                      <div className="w-full flex flex-col items-center">
                          <Image src="/Empty.png" width={300} height={300} alt="Empty Image" />
                          <h3 className="text-sm font-semibold">No Todos here Complete Now</h3>
                      </div>
                  )
                  }
           </div>
        </div>
    </section>
  )
}

export default Completed