const featureList = [
  { title: "Fast", desc: "Optimized for speed." },
  { title: "Modular", desc: "Easy to maintain components." },
  { title: "Responsive", desc: "Works on all devices." }
];

export default function Features() {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '50px 20px' }}>
      {featureList.map((f, i) => (
        <div key={i} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}