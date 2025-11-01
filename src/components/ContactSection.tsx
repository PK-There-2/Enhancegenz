export function ContactSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl mb-4">Contact</h2>
        </div>

        {/* Contact Form */}
        <form className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-6 py-4 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-6 py-4 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-6 py-4 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* Comment */}
          <div>
            <textarea
              placeholder="Comment"
              rows={8}
              className="w-full px-6 py-4 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-gray-400 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="px-10 py-4 bg-black text-white hover:bg-gray-800 transition-colors rounded-full"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
