import PropTypes from "prop-types";
import "./css/HeroSection.css";

export default function Backdrop({ imageUrl, size = "default" }) {
  // Usa versión reducida si es de TMDb
  const optimizedUrl = imageUrl?.includes("/original/")
    ? imageUrl.replace("/original/", "/w1280/")
    : imageUrl;

  return (
    <section
      className={`hero-section ${size === "small" ? "hero-small" : ""}`}
      style={{
        backgroundImage: `url(${optimizedUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.3s ease-in-out",
      }}
    >
      <div className="hero-overlay" />
    </section>
  );
}

Backdrop.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["default", "small"]),
};
