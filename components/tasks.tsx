"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface Task {
  id: string
  title: string
  description: string
  deadline: string
  completed: boolean
  createdAt: number
}

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newDeadline, setNewDeadline] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDeadline, setEditDeadline] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("taskapp_tasks")
      if (stored) {
        const parsed = JSON.parse(stored)
        setTasks(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error("[v0] Error loading tasks:", error)
      setTasks([])
    }
  }, [])

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem("taskapp_tasks", JSON.stringify(updatedTasks))
      setTasks(updatedTasks)
    } catch (error) {
      console.error("[v0] Error saving tasks:", error)
    }
  }

  const addTask = () => {
    if (!newTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      deadline: newDeadline,
      completed: false,
      createdAt: Date.now(),
    }

    saveTasks([newTask, ...tasks])
    setNewTitle("")
    setNewDescription("")
    setNewDeadline("")
    setIsAdding(false)
  }
  const toggleComplete = (id: string) => {
    const updated = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    saveTasks(updated)
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((task) => task.id !== id))
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return

    saveTasks(
      tasks.map(t =>
        t.id === editingId
          ? {
            ...t,
            title: editTitle.trim(),
            description: editDescription.trim(),
            deadline: editDeadline,
          }
          : t
      )
    )

    cancelEdit()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
    setEditDeadline("")
  }

  // Sort: active first, completed last
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return b.createdAt - a.createdAt
    return a.completed ? 1 : -1
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAdding(false)
        cancelEdit()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])


  const formatDeadline = (value: string) => {
    if (!value) return null
    const date = new Date(value)
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  return (
    <div className="px-6 py-8">
  <div className="mx-auto max-w-2xl space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Tasks
      </h1>

      <Button onClick={() => setIsAdding(true)} size="lg" className="h-11 px-6">
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Task
      </Button>
    </div>

    {/* Add Task Form */}
    {isAdding && (
      <Card className="p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
        <Input
          placeholder="Task title *"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              addTask()
            }
          }}
          className="h-11 text-base"
          autoFocus
        />

        <Textarea
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows={3}
          className="text-base resize-none"
        />

        <Input
          type="datetime-local"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
        />

        <div className="flex gap-3">
          <Button
            onClick={addTask}
            className="flex-1 h-11"
            disabled={!newTitle.trim()}
          >
            Add Task
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setIsAdding(false)
              setNewTitle("")
              setNewDescription("")
            }}
            className="h-11"
          >
            Cancel
          </Button>
        </div>
      </Card>
    )}

    {/* Tasks List */}
    <div className="space-y-3">
      {sortedTasks.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>

          <p className="text-lg font-medium text-muted-foreground">
            No tasks yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Tap "Add Task" to create your first task
          </p>
        </div>
      ) : (
        sortedTasks.map((task) => (
          <Card
            key={task.id}
            className={`p-4 transition-all duration-200 ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            {editingId === task.id ? (
              <div className="space-y-4">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-11 text-base"
                  autoFocus
                />

                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="text-base resize-none"
                />

                <Input
                  type="datetime-local"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={saveEdit}
                    className="flex-1 h-10"
                    disabled={!editTitle.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    className="h-10 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="mt-1 flex-shrink-0 h-6 w-6 rounded-md border-2 border-primary flex items-center justify-center transition-all duration-200 hover:bg-primary/10"
                  aria-label={
                    task.completed
                      ? "Mark as incomplete"
                      : "Mark as complete"
                  }
                >
                  {task.completed && (
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-base font-medium leading-relaxed ${
                      task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p
                      className={`mt-1 text-sm leading-relaxed whitespace-pre-wrap ${
                        task.completed
                          ? "line-through text-muted-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {task.deadline && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Deadline: {formatDeadline(task.deadline)}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(task)}
                    className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Edit task"
                  >
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors"
                    aria-label="Delete task"
                  >
                    <svg
                      className="h-4 w-4 text-destructive"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  </div>
</div>

  )
}
