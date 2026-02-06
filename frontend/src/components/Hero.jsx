export default function Hero() {
  return (
    <section style={{ padding: '100px 20px', textAlign: 'center', background: '#f9f9f9' }}>
      <h1 style={{ fontSize: '3rem' }}>Explore India With Us</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>Every street has a story. Every city has a soul. Explore India with us as we uncover the traditions, people, and places that make this country truly incredible. Your journey begins here.</p>
      <button style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
        <a style={{textDecoration: 'none', color: 'white', fontSize: '1rem'}} href="/home">Let's Explore</a>
      </button>
    </section>
  );
}