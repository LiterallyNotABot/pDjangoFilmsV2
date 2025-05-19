import "./css/HeroSection.css";

export default function HeroSection({ backdropUrl = "https://image.tmdb.org/t/p/original/oUgVgGaNqV9Y0Zdyjc1kCpzIe4G.jpg", onJoin }) {
  return (
    <>
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      >
        <div className="hero-overlay" />
      </section>

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="green">Shoot a film</span><br />
          or <span className="red">shoot me right in the head</span>.
        </h1>
       
        <button onClick={onJoin} className="hero-button">
          Join now
        </button>
      </div>
    </>
  );
}
