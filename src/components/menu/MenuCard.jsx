import { formatPrice } from '../../utils/formatters'

export default function MenuCard({ item }) {
  const { name, description, price, image, isPopular, category } = item

  return (
    <article className="card group">
      {/* Image */}
      <div className="relative h-48 bg-[#fdf0d5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/fdf0d5/c97830?text=${encodeURIComponent(name)}`
          }}
        />
        {isPopular && (
          <span className="absolute top-3 left-3 bg-[#c97830] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {name}
          </h3>
          <span className="text-[#c97830] font-semibold whitespace-nowrap">
            {formatPrice(price)}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{description}</p>
        <span className="inline-block mt-3 text-xs capitalize text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {category}
        </span>
      </div>
    </article>
  )
}