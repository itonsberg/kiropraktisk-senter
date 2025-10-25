"use client"

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

// Kiropraktisk Senter location
const LOCATION = {
  lng: 10.4186749,
  lat: 59.2886853,
  address: 'Eikveien 33, 3122 Tønsberg'
}

export function Mapbox3D() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const mapInitialized = useRef(false)

  useEffect(() => {
    const node = mapContainer.current
    if (typeof window === 'undefined' || node === null) {
      console.log('Mapbox: Window not available or container not ready')
      return
    }
    if (mapInitialized.current) {
      console.log('Mapbox: Map already initialized')
      return
    }

    mapInitialized.current = true

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    console.log('Mapbox: Token present:', !!token)

    if (!token) {
      console.error('Mapbox token not found')
      return
    }

    console.log('Mapbox: Initializing map at', LOCATION)

    try {
      // Set token globally as well for compatibility
      mapboxgl.accessToken = token

      map.current = new mapboxgl.Map({
        container: node,
        accessToken: token,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [LOCATION.lng, LOCATION.lat],
        zoom: 15,
        pitch: 60,
        bearing: -17.6,
        antialias: true
      })

      console.log('Mapbox: Map created successfully')
      console.log('Mapbox: Map instance:', map.current)

      // Add error handler
      map.current.on('error', (e) => {
        console.error('Mapbox: Map error:', e)
      })

      map.current.on('style.load', () => {
        console.log('Mapbox: Style loaded')
      })
    } catch (error) {
      console.error('Mapbox: Error creating map:', error)
      return
    }

    map.current.on('load', () => {
      if (!map.current) return

      // Add 3D buildings layer
      const layers = map.current.getStyle().layers
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id

      map.current.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      )

      // Add marker with custom popup and logo icon
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.width = '50px'
      el.style.height = '50px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = '#f48337'
      el.style.border = '3px solid white'
      el.style.boxShadow = '0 4px 12px rgba(244, 131, 55, 0.5)'
      el.style.cursor = 'pointer'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.style.padding = '8px'

      // Add logo icon
      el.innerHTML = `
        <img src="/media/logos/logo-white-icon.svg" alt="Kiropraktisk Senter" style="width: 100%; height: 100%; object-fit: contain;" />
      `

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Kiropraktisk Senter</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">${LOCATION.address}</p>
          </div>
        `)

      new mapboxgl.Marker(el)
        .setLngLat([LOCATION.lng, LOCATION.lat])
        .setPopup(popup)
        .addTo(map.current)
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      mapInitialized.current = false
    }
  }, [])

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-white/10 bg-gray-100 dark:bg-gray-900"
      style={{ minHeight: '400px', position: 'relative' }}
    />
  )
}
