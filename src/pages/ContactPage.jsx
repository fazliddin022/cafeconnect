import ContactForm from '../components/contact/ContactForm'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">We'd love to hear from you.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Get in Touch
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Whether you have a question about our menu, want to book a
              private event, or just want to say hi — we're here for you.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 text-sm">
            {[
              { icon: '📍', label: 'Address', value: '123 Coffee Lane, Downtown District' },
              { icon: '📞', label: 'Phone', value: '+1 (555) 123-4567' },
              { icon: '📧', label: 'Email', value: 'hello@cafeconnect.com' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="font-medium text-gray-700">{label}</p>
                  <p className="text-gray-500">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Google Maps Embed */}
          <div className="rounded-2xl overflow-hidden h-56 border border-gray-100 shadow-sm">
            <iframe
              title="CaféConnect Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.4!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzU4LjIiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <ContactForm />
        </div>

      </div>
    </div>
  )
}