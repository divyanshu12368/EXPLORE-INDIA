const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "City-wise Discovery",
    desc: "Browse tourist places filtered by state and city across all of India.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Handpicked Places",
    desc: "Every destination is carefully selected to give you the best travel experience.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
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
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-5">
                {f.icon}
              </div>
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