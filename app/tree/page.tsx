"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "taskapp_plant_state"

const PLANT_STAGES = [
  {
    min: 0,
    name: "Seed",
    image: "/tree/seed.png",
    message: "A tiny seed. Every journey starts small.",
    color: "from-amber-900 to-amber-700",
  },
  {
    min: 5,
    name: "Sprout",
    image: "/tree/sprout.png",
    message: "Congrats! Your seed became a sprout.",
    color: "from-green-600 to-green-400",
  },
  {
    min: 15,
    name: "Plant",
    image: "/tree/plant.png",
    message: "Look at that! Your plant is growing strong.",
    color: "from-green-700 to-emerald-500",
  },
  {
    min: 30,
    name: "Tree",
    image: "/tree/small-tree.png",
    message: "Wow! Your plant became a tree.",
    color: "from-green-800 to-green-600",
  },
  {
    min: 50,
    name: "Flowering Tree",
    image: "/tree/tree.png",
    message: "Amazing! Your tree is blooming.",
    color: "from-pink-500 to-rose-400",
  },
]


const today = () => new Date().toISOString().split("T")[0]

export default function GrowPlantPage() {
  const [water, setWater] = useState(0)
  const [lastWatered, setLastWatered] = useState<string | null>(null)
  const [canWater, setCanWater] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [lastStage, setLastStage] = useState<string>("Seed")
  const [isWatering, setIsWatering] = useState(false)
  const [waterDrops, setWaterDrops] = useState<Array<{ id: number; x: number }>>([])
  const [showSparkles, setShowSparkles] = useState(false)

  // Load + consequences
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    const saved = JSON.parse(raw)
    let newWater = saved.water ?? 0
    const last = saved.lastWatered

    if (last) {
      const diffDays =
        (new Date(today()).getTime() - new Date(last).getTime()) /
        (1000 * 60 * 60 * 24)

      if (diffDays >= 2) {
        const penalty = Math.floor(diffDays - 1)
        newWater = Math.max(0, newWater - penalty)
        setStatusMessage("You missed a day. Your plant feels a little weak.")
      }

      setCanWater(last !== today())
    }

    setWater(newWater)
    setLastWatered(last)
  }, [])

  // Save
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ water, lastWatered })
    )
  }, [water, lastWatered])

  const handleWater = () => {
    if (!canWater) {
      setStatusMessage("You already watered today. Come back tomorrow 🌙")
      return
    }

    setIsWatering(true)
    
    // Create water drops
    const drops = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50
    }))
    setWaterDrops(drops)

    setTimeout(() => {
      setWater((w) => w + 1)
      setLastWatered(today())
      setCanWater(false)
      setStatusMessage("Nice! Your plant enjoyed the water 💧")
      setIsWatering(false)
      setWaterDrops([])
      setShowSparkles(true)
      
      setTimeout(() => setShowSparkles(false), 1000)
    }, 800)
  }

  const stage =
    [...PLANT_STAGES].reverse().find((s) => water >= s.min) || PLANT_STAGES[0]

  // Stage change feedback
  useEffect(() => {
    if (stage.name !== lastStage) {
      setStatusMessage(stage.message)
      setLastStage(stage.name)
    }
  }, [stage.name])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-50 px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Grow a Tree
        </h1>

        <Card className={`relative overflow-hidden p-8 space-y-6 bg-gradient-to-br ${stage.color} bg-opacity-5 border-2 transition-all duration-500`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Tree visual with container */}
          <div className="relative">
            <div className="relative flex justify-center">
  <img
    src={stage.image}
    alt={stage.name}
    className={`w-64 max-w-full transition-all duration-500 ${
      showSparkles ? "scale-110" : "scale-100"
    }`}
    draggable={false}
  />
</div>

            
            {/* Water drops animation */}
            {waterDrops.map((drop) => (
              <div
                key={drop.id}
                className="absolute top-0 left-1/2 text-4xl animate-in fade-in slide-in-from-top-4"
                style={{
                  transform: `translateX(${drop.x}px)`,
                  animation: 'waterDrop 0.8s ease-out forwards'
                }}
              >
                💧
              </div>
            ))}

            {/* Sparkles on growth */}
            {showSparkles && (
              <>
                <div className="absolute top-0 right-1/4 text-3xl animate-in spin-in zoom-in fade-in duration-500">✨</div>
                <div className="absolute top-1/4 left-1/4 text-2xl animate-in spin-in zoom-in fade-in duration-500" style={{ animationDelay: '100ms' }}>⭐</div>
                <div className="absolute bottom-1/4 right-1/3 text-3xl animate-in spin-in zoom-in fade-in duration-500" style={{ animationDelay: '200ms' }}>✨</div>
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-500 rounded-full`}
                style={{ 
                  width: `${Math.min(100, (water / 50) * 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {water < 50 ? `${50 - water} waters until mighty tree` : 'Maximum growth achieved! 🎉'}
            </p>
          </div>

          {/* Stage info */}
          <div className="space-y-1 relative z-10">
            <p className="text-2xl font-bold">{stage.name}</p>
            <p className="text-sm text-muted-foreground">
              Watered {water} times
            </p>
          </div>

          {/* Feedback */}
          {statusMessage && (
            <div className="text-sm font-medium text-foreground animate-in fade-in slide-in-from-bottom-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              {statusMessage}
            </div>
          )}

          {/* Action */}
          <Button
            onClick={handleWater}
            disabled={!canWater || isWatering}
            className="w-full h-14 text-lg font-semibold relative overflow-hidden group transition-all hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isWatering ? (
                <>
                  <span className="animate-bounce">💧</span>
                  Watering...
                </>
              ) : canWater ? (
                <>Water Plant 💧</>
              ) : (
                <>Come back tomorrow 🌙</>
              )}
            </span>
            {canWater && !isWatering && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Button>
        </Card>

        <div className="text-sm text-muted-foreground space-y-2 bg-white/50 backdrop-blur-sm rounded-lg p-4">
          <p className="font-medium">🌱 Care for your tree daily</p>
          <p>Missed days slow growth, but consistent love brings it back to life</p>
        </div>

        {/* Achievement badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {PLANT_STAGES.filter(s => water >= s.min).map(s => (
            <div
  key={s.name}
  className="px-3 py-1 bg-white rounded-full text-sm shadow-sm border-2 border-green-200 flex items-center gap-2"
>
  <img src={s.image} alt={s.name} className="w-6 h-6" />
  <span className="font-medium">{s.name}</span>
</div>

          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes waterDrop {
          0% {
            transform: translateY(0) translateX(var(--x)) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(150px) translateX(var(--x)) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}