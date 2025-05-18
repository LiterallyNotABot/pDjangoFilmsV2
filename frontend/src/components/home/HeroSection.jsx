import "./css/HeroSection.css";

export default function HeroSection({ backdropUrl = "/assets/default-backdrop.jpg", onJoin }) {
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${backdropUrl})`,
      }}
    >
      {/* Overlay oscuro con blur */}
      <div className="hero-overlay"></div>

      {/* Texto y botón */}
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="green">Shoot a film</span><br />
          or <span className="red">shoot me right in the head</span>.
        </h1>
        <p className="hero-subtitle">
          Track your films. <span className="yellow">Worship cinema.</span><br />
          <span className="orange">Make Django proud.</span>
        </p>
        <button onClick={onJoin} className="hero-button">
          Join now
        </button>
      </div>
    </section>
  );
}
