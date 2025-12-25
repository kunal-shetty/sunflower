"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ListOrdered } from "lucide-react"

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
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [autoNumber, setAutoNumber] = useState(false)

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


  const scheduleNativeNotification = (task: any) => {
    if (!task.deadline) return

    const deadlineMillis = new Date(task.deadline).getTime()

      ; (window as any).Android?.scheduleTaskNotification(
        task.title,
        deadlineMillis
      )
  }

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

    const updatedTasks = [newTask, ...tasks]
    saveTasks(updatedTasks)

    scheduleNativeNotification(newTask)

    setNewTitle("")
    setNewDescription("")
    setNewDeadline("")
    setIsAdding(false)
  }

  const toggleComplete = (id: string) => {
    const updated = tasks.map((task) => {
      if (task.id === id) {
        if (!task.completed) {
          //  cancel when marking complete
          ; (window as any).Android?.cancelTaskNotification(task.title)
        }

        return { ...task, completed: !task.completed }
      }
      return task
    })

    saveTasks(updated)
  }


  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id)

    if (task) {
      ; (window as any).Android?.cancelTaskNotification(task.title)
    }

    saveTasks(tasks.filter((task) => task.id !== id))
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditDeadline(task.deadline)
  }

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return

    const updatedTasks = tasks.map(t => {
      if (t.id === editingId) {
        const updatedTask = {
          ...t,
          title: editTitle.trim(),
          description: editDescription.trim(),
          deadline: editDeadline,
        }

        scheduleNativeNotification(updatedTask)

        return updatedTask
      }
      return t
    })

    saveTasks(updatedTasks)
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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
          <Card className="p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 gap-3">
            {/* Title */}
            <Input
              placeholder="What do you want to get done?"
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

            {/* Description */}
            <div className="relative">
              {/* Textarea */}
              <Textarea
                placeholder="Add details (optional)"
                value={newDescription}
                rows={3}
                className="text-base resize-none pr-10"
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (!autoNumber) return
                  if (e.key !== "Enter") return

                  e.preventDefault()

                  const lines = newDescription.split("\n")
                  const lastLine = lines[lines.length - 1]
                  const match = lastLine.match(/^(\d+)\.\s/)
                  const nextNumber = match ? Number(match[1]) + 1 : 1

                  setNewDescription(newDescription + `\n${nextNumber}. `)
                }}
              />

              {/* Auto-number toggle */}
              <button
                type="button"
                onClick={() => setAutoNumber((v) => !v)}
                title="Auto-number on Enter"
                className={`absolute top-4 right-4 rounded-md p-1.5 transition-colors ${autoNumber
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <ListOrdered className="h-4 w-4" />
              </button>

            </div>


            {/* Deadline */}
            <Input
              type="datetime-local"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  setNewTitle("")
                  setNewDescription("")
                }}
                className="flex-1 h-11"
              >
                Cancel
              </Button>

              <Button
                onClick={addTask}
                className="flex-1 h-11"
                disabled={!newTitle.trim()}
              >
                Add task
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
                className={`p-4 transition-all duration-200 ${task.completed ? "opacity-60" : ""
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
                        className={`text-base font-medium leading-relaxed ${task.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                          }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p
                          className={`mt-1 text-sm leading-relaxed whitespace-pre-wrap ${task.completed
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
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 self-start pt-1 me-4">
                      <button
                        disabled={task.completed}
                        onClick={() => startEdit(task)}
                        className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
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
                        disabled={task.completed}
                        onClick={() => setTaskToDelete(task.id)}
                        className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors"
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

                      <button
                        disabled={task.completed}
                        onClick={() =>
                          window.location.href = `/focus?taskId=${task.id}&title=${encodeURIComponent(
                            task.title
                          )}`
                        }
                        className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-primary/10 transition-colors"
                        aria-label="Focus on task"
                      >
                        <svg
                          className="h-4 w-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364-6.364-2.828 2.828M8.464 15.536l-2.828 2.828m0-12.728 2.828 2.828m6.072 6.072 2.828 2.828"
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

      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-xl bg-card p-5 space-y-4">
            <h3 className="text-base font-medium">Delete task?</h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  deleteTask(taskToDelete)
                  setTaskToDelete(null)
                }}
                className="flex-1 h-10 rounded-md bg-destructive text-destructive-foreground"
              >
                Delete
              </button>

              <button
                onClick={() => setTaskToDelete(null)}
                className="flex-1 h-10 rounded-md border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
