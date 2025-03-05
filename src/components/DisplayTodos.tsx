import { SelectSubtodo } from "@/schema"
import Card from "./Card"

export interface TodoWithSub{
    id:number,
    title:string,
    userId:number,
    completed:boolean,
 subTodos:SelectSubtodo[]
}

const DisplayTodos = ({tasks}:{tasks:TodoWithSub[]}) => {
  return (
    <div>
        {tasks && (
            <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-2">{
                tasks.map((item,indx)=>(
                  <Card key={indx} todo={{id:item.id,title:item.title,completed:item?.completed }} subTodo={item.subTodos} />
                  ))
                }
            </div>
            
        )}
    </div>
  )
}

export default DisplayTodos