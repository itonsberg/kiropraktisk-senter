"use client"

import { Instagram } from 'lucide-react'

interface InstagramPost {
  id: string
  imageUrl: string
  caption: string
  permalink: string
}

// Placeholder posts - replace with actual Instagram API data
const placeholderPosts: InstagramPost[] = [
  {
    id: '1',
    imageUrl: '/images/team-senior-male-bw.jpg',
    caption: 'Profesjonell kiropraktisk behandling i Tønsberg',
    permalink: 'https://instagram.com/kiropraktisksenter'
  },
  {
    id: '2',
    imageUrl: '/images/equipment-red-light.jpg',
    caption: 'Moderne behandlingsutstyr for best mulig resultat',
    permalink: 'https://instagram.com/kiropraktisksenter'
  },
  {
    id: '3',
    imageUrl: '/images/treatment-back-1.jpg',
    caption: 'Skreddersydd behandling for dine behov',
    permalink: 'https://instagram.com/kiropraktisksenter'
  },
  {
    id: '4',
    imageUrl: '/images/rygg-massage.jpg',
    caption: 'Massasje og kiropraktikk i kombinasjon',
    permalink: 'https://instagram.com/kiropraktisksenter'
  }
]

export function InstagramFeed() {
  return (
    <section className="relative z-10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-[#f48337]" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Følg oss på Instagram
            </h2>
          </div>
          <p className="text-xl text-gray-700 dark:text-white/80">
            @kiropraktisksenter
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {placeholderPosts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-white/10"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/kiropraktisksenter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Instagram className="w-5 h-5" />
            Følg oss på Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
