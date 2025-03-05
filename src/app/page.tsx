

"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Example task", completed: false },
  ]);
  const [topic, setTopic] = useState("");

  const generateTasks = async () => {
    // Placeholder for Google Gemini API call
    const newTasks = [
      "Learn Python basics",
      "Write a simple script",
      "Understand functions",
      "Explore libraries",
      "Build a project",
    ].map((text, i) => ({ id: i + 1, text, completed: false }));
    setTasks(newTasks);
  };

  const toggleTask = (id:number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id:number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <div className="flex space-x-2">
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic..." />
        <Button onClick={generateTasks}>Generate</Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <span className={task.completed ? "line-through text-gray-500" : ""}>{task.text}</span>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => toggleTask(task.id)}>
                    {task.completed ? "Undo" : "Done"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Progress value={(tasks.filter((t) => t.completed).length / tasks.length) * 100} />
    </div>
  );
}
