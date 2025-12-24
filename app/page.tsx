"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const username = localStorage.getItem("taskapp_username")

    if (username) {
      router.replace("/home")
    } else {
      router.replace("/onboarding")
    }
  }, [router])

  // Nothing should render here
  return null
}
