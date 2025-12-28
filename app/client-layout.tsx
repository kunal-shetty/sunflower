"use client"

import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { useEffect, useRef, useState } from "react"

const PLAYLIST = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_PLQ6VM1OkPdVU4uL6SjirdDC9s80/F9xc6tgGZLG5qN-N6hJrbB/public/music/Track-1.mp3",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_PLQ6VM1OkPdVU4uL6SjirdDC9s80/j9nhbN-boKKP3-ee-AJSSs/public/music/Track-2.mp3",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_PLQ6VM1OkPdVU4uL6SjirdDC9s80/aUk0_8keqfcHtfp8SR7Nmv/public/music/Track-3.mp3",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_PLQ6VM1OkPdVU4uL6SjirdDC9s80/dQjYIWM1JdZzf94Ne_6hkf/public/music/Track-4.mp3",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_PLQ6VM1OkPdVU4uL6SjirdDC9s80/itXJQv4wUk31HL2dJelU3m/public/music/Track-5.mp3",
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const showBottomNav =
    pathname === "/home" ||
    pathname === "/tasks" ||
    pathname === "/settings" ||
    pathname === "/chat" ||
    pathname === "/tree" ||
    pathname === "/games"

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [musicEnabled, setMusicEnabled] = useState(false)
  const [volume, setVolume] = useState(60)
  const [currentTrack, setCurrentTrack] = useState(0)

  const handleEnded = () => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length)
  }

  useEffect(() => {
  const enabled = localStorage.getItem("taskapp_music_enabled")
  const vol = localStorage.getItem("taskapp_music_volume")

  if (enabled !== null) setMusicEnabled(enabled === "true")
  if (vol !== null) setVolume(Number(vol))
}, [])


  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = PLAYLIST[currentTrack]
    audio.volume = volume / 100

    if (musicEnabled) {
      audio.play().catch(() => {})
    }
  }, [currentTrack, musicEnabled])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (musicEnabled) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [musicEnabled])

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto overscroll-none">
        {/* <audio ref={audioRef} onEnded={handleEnded} /> */}
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  )
}
