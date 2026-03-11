import { useState } from 'react'

const galleryImages = [
  { id: 1, src: 'https://placehold.co/600x400/fdf0d5/c97830?text=Interior+1', alt: 'Cozy café interior', tag: 'Interior' },
  { id: 2, src: 'https://placehold.co/600x400/e9ae6b/5a3010?text=Coffee+Bar', alt: 'Coffee bar station', tag: 'Coffee' },
  { id: 3, src: 'https://placehold.co/600x400/fae4b8/834820?text=Events', alt: 'Live music event', tag: 'Events' },
  { id: 4, src: 'https://placehold.co/600x400/f2ce9e/6a3a1f?text=Desserts', alt: 'Fresh desserts', tag: 'Food' },
  { id: 5, src: 'https://placehold.co/600x400/c97830/ffffff?text=Terrace', alt: 'Outdoor terrace', tag: 'Interior' },
  { id: 6, src: 'https://placehold.co/600x400/a85f24/ffffff?text=Barista', alt: 'Barista at work', tag: 'Coffee' },
  { id: 7, src: 'https://placehold.co/600x400/834820/ffffff?text=Jazz+Night', alt: 'Jazz night event', tag: 'Events' },
  { id: 8, src: 'https://placehold.co/600x400/e09042/ffffff?text=Avocado+Toast', alt: 'Signature avocado toast', tag: 'Food' },
  { id: 9, src: 'https://placehold.co/600x400/fdf0d5/58311d?text=Morning+Light', alt: 'Morning sunlight in café', tag: 'Interior' },
]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeTag, setActiveTag] = useState('All')

  const tags = ['All', ...new Set(galleryImages.map((img) => img.tag))]
  const filtered =
    activeTag === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.tag === activeTag)

  return (
    <div className="min-h-screen bg-[#fffdf7]">
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
          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full rounded-xl"
            />
            <p className="text-white text-center mt-3 text-sm">
              {selectedImage.alt}
            </p>
            <button
              className="block mx-auto mt-4 text-gray-400 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}