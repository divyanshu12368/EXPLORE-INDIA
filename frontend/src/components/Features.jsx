// src/components/Features.jsx

const features = [
  {
    icon: "🗺️",
    title: "City-wise Discovery",
    desc: "Browse tourist places filtered by state and city across all of India.",
  },
  {
    icon: "📍",
    title: "Handpicked Places",
    desc: "Every destination is carefully selected to give you the best travel experience.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    desc: "Whether you're on desktop or mobile, plan your trip from anywhere.",
  },
];

export default function Features() {
  return (
    <section className="bg-orange-50/50 px-6 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-2">
            Why Choose Us
          </p>
          <h2
            className="text-3xl md:text-4xl font-black text-stone-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Everything you need to plan your trip
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-white rounded-2xl p-8 border border-orange-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-stone-900 text-lg mb-2 group-hover:text-orange-500 transition-colors duration-200">
                {f.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}