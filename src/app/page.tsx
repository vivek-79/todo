
import NavBar from "@/components/NavBar";
import { db } from "@/lib/db";
import { subtodoTable, todoTable } from "@/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import DisplayTodos from "@/components/DisplayTodos";
import Image from "next/image";

export default async function TaskManager () {

  const user = await currentUser();
  const userId = user?.publicMetadata.userId as number

  const tasks = await db
    .select({
      todo:todoTable,
      subTodo:subtodoTable,
    })
    .from(todoTable)
    .leftJoin(subtodoTable,eq(todoTable.id,subtodoTable.todoId))
    .where(and(eq(todoTable.userId,userId),eq(todoTable.completed,false)))


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
    <div className="max-w-3xl w-full mx-auto p-6 space-y-4  min-h-[100dvh] text-white">
      <NavBar/>
      <h1 className="text-2xl font-bold">All Todos</h1>
      <Image width={700} height={700} src="/main-bg.webp" alt="back-groung" className="-z-20 fixed top-0 left-0 object-center object-cover w-full h-full"/>
      <div className="fixed -z-10 bg-[#000]/40 backdrop-blur-md top-0 left-0 w-full h-full"></div>
     
      {/*ProgressBar*/}

      { result.length ? (
        <DisplayTodos tasks={result} />
      ):(
        <div className="w-full flex flex-col items-center">
            <Image src="/Empty.png" width={300} height={300} alt="Empty Image" />
            <h3 className="text-sm font-semibold">No Todos here Add One Now By Clicking New</h3>
        </div>
      )
      }
    </div>
  );
}
