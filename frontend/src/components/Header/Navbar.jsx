import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #eee' }}>
      <h2 style={{ margin: 0 }}>Explore India</h2>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0 }}>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/places">Places</Link></li>
      </ul>
    </nav>
  );
}