"use client"

import { useEffect, useState } from "react"
import { Home } from "@/components/home"
import { useRouter } from "next/navigation"

export default function HomePage() {
    const [username, setUsername] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const storedUsername = localStorage.getItem("taskapp_username")
        if (!storedUsername) router.push("/")
        setUsername(storedUsername)
        setIsLoading(false)
    }, [])

    if (isLoading || !username) {
        return (
            <div className="flex h-[100dvh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    return <Home username={username} />
}
