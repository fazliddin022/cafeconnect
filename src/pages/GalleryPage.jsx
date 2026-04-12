import { useState } from 'react'

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
    alt: 'Cozy café interior',
    tag: 'Interior',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
    alt: 'Coffee bar station',
    tag: 'Coffee',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
    alt: 'Live music event',
    tag: 'Events',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop',
    alt: 'Fresh desserts',
    tag: 'Food',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&h=400&fit=crop',
    alt: 'Outdoor terrace',
    tag: 'Interior',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&fit=crop',
    alt: 'Barista at work',
    tag: 'Coffee',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop',
    alt: 'Jazz night event',
    tag: 'Events',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=600&h=400&fit=crop',
    alt: 'Signature avocado toast',
    tag: 'Food',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    alt: 'Morning sunlight in café',
    tag: 'Interior',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
    alt: 'Espresso close-up',
    tag: 'Coffee',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop',
    alt: 'Freshly baked croissants',
    tag: 'Food',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    alt: 'Workshop event',
    tag: 'Events',
  },
]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeTag, setActiveTag] = useState('All')

  const tags = ['All', ...new Set(galleryImages.map((img) => img.tag))]
  const filtered =
    activeTag === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.tag === activeTag)

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!selectedImage) return
    if (e.key === 'Escape') setSelectedImage(null)
    if (e.key === 'ArrowRight') {
      const idx = galleryImages.findIndex((img) => img.id === selectedImage.id)
      const next = galleryImages[(idx + 1) % galleryImages.length]
      setSelectedImage(next)
    }
    if (e.key === 'ArrowLeft') {
      const idx = galleryImages.findIndex((img) => img.id === selectedImage.id)
      const prev = galleryImages[(idx - 1 + galleryImages.length) % galleryImages.length]
      setSelectedImage(prev)
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf7]" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <h1 className="section-title">Gallery</h1>
        <p className="section-subtitle">A glimpse into our world.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-[#c97830] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#c97830] hover:text-[#c97830]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img) => (
            <div
              key={img.id}
              className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3] bg-[#fdf0d5]"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  🔍
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium">{img.alt}</p>
                <span className="text-xs text-gray-300">{img.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full rounded-xl"
            />
            <p className="text-white text-center mt-3 text-sm">{selectedImage.alt}</p>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button
                className="text-gray-400 hover:text-white transition-colors text-2xl"
                onClick={() => {
                  const idx = galleryImages.findIndex((img) => img.id === selectedImage.id)
                  setSelectedImage(galleryImages[(idx - 1 + galleryImages.length) % galleryImages.length])
                }}
              >
                ←
              </button>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                ✕ Close
              </button>
              <button
                className="text-gray-400 hover:text-white transition-colors text-2xl"
                onClick={() => {
                  const idx = galleryImages.findIndex((img) => img.id === selectedImage.id)
                  setSelectedImage(galleryImages[(idx + 1) % galleryImages.length])
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}