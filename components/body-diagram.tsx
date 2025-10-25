"use client"

import { useState, useRef } from 'react'

interface BodyPart {
  id: string
  x: number  // pixel coordinates based on 2048x979 image
  y: number
  label: string
  url: string
}

// Image dimensions: 2048x979
// Click on the image to get coordinates and update this array
const bodyParts: BodyPart[] = [
  {
    "id": "hodepine",
    "x": 988,
    "y": 104,
    "label": "Hodepine",
    "url": "/tjenester/hodepine"
  },
  {
    "id": "nakke",
    "x": 1012,
    "y": 216,
    "label": "Nakke",
    "url": "/tjenester/nakke"
  },
  {
    "id": "skulder-right",
    "x": 884,
    "y": 261,
    "label": "Skulder",
    "url": "/tjenester/skulder"
  },
  {
    "id": "albue-left",
    "x": 862,
    "y": 389,
    "label": "Albue",
    "url": "/tjenester/albue"
  },
  {
    "id": "rygg",
    "x": 1040,
    "y": 415,
    "label": "Rygg",
    "url": "/tjenester/rygg"
  },
  {
    "id": "handledd-left",
    "x": 1126,
    "y": 492,
    "label": "Håndledd",
    "url": "/tjenester/handledd"
  },
  {
    "id": "kjeve",
    "x": 966,
    "y": 190,
    "label": "Kjeve",
    "url": "/tjenester/kjeve"
  },
  {
    "id": "kne-left",
    "x": 908,
    "y": 703,
    "label": "Kne",
    "url": "/tjenester/kne"
  },
  {
    "id": "ankel-left",
    "x": 1071,
    "y": 834,
    "label": "Ankel/Fot",
    "url": "/tjenester/ankel-fot"
  }
]

// Set to true during development to click and get coordinates
const DEV_MODE = false

export function BodyDiagram() {
  const [activeTab, setActiveTab] = useState<'forside' | 'bakside'>('forside')
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!DEV_MODE || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const scaleX = 2048 / rect.width
    const scaleY = 979 / rect.height
    const x = Math.round((e.clientX - rect.left) * scaleX)
    const y = Math.round((e.clientY - rect.top) * scaleY)

    console.log(`Clicked at: x: ${x}, y: ${y}`)
    console.log(`{ id: 'body-part', x: ${x}, y: ${y}, label: 'Label', url: '/tjenester/part' },`)
  }

  return (
    <div className="w-[90vw] max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Få bedre innblikk og kunnskap om dine symptomer
        </h2>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-[#d6c5ab]/20 p-1">
          <button
            onClick={() => setActiveTab('forside')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'forside'
                ? 'bg-[#d6c5ab] text-gray-900'
                : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Forside
          </button>
          <button
            onClick={() => setActiveTab('bakside')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'bakside'
                ? 'bg-[#d6c5ab] text-gray-900'
                : 'text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Bakside
          </button>
        </div>
      </div>

      {/* Body Diagram with Real Image */}
      <div className="relative bg-[#111111] dark:bg-[#111111] rounded-3xl p-8 overflow-hidden ring-1 ring-[#f48337]/30 backdrop-blur">
        <div className="relative w-full" style={{ margin: '0 auto' }}>
          {/* Real body image */}
          <img
            ref={imageRef}
            src="/images/hotspot/body1-front.jpg"
            alt="Body diagram"
            className="w-full h-auto"
            style={{ aspectRatio: '2048/979' }}
            onClick={handleImageClick}
          />

          {/* Clickable Hotspots */}
          {bodyParts.map((part) => (
            <a
              key={part.id}
              href={part.url}
              className="absolute group"
              style={{
                left: `${(part.x / 2048) * 100}%`,
                top: `${(part.y / 979) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
            >
              {/* Pulse animation on hover */}
              {hoveredPart === part.id && (
                <div className="absolute inset-0 -m-1 animate-ping pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-[#f48337]/50" />
                </div>
              )}

              {/* Main button */}
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#f48337] text-white shadow-xl group-hover:scale-125 transition-transform cursor-pointer border-2 border-white">
                <span className="text-sm font-bold leading-none">+</span>
              </div>

              {/* Label tooltip */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg shadow-xl">
                  {part.label}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {DEV_MODE && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-lg font-mono text-xs">
            DEV MODE: Click image to get coordinates
          </div>
        )}
      </div>

      {/* Hovered Info Card */}
      {hoveredPart && (
        <div className="mt-6 p-6 rounded-2xl bg-white dark:bg-white/10 ring-1 ring-gray-200 dark:ring-white/20 backdrop-blur text-center">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {bodyParts.find(p => p.id === hoveredPart)?.label}
          </h3>
          <p className="text-gray-700 dark:text-white/80">
            Klikk for å lære mer om behandling
          </p>
        </div>
      )}
    </div>
  )
}
