import PropTypes from "prop-types";
import { getOptimizedBackdropUrl } from "@/utils/imageUtils";
import "./css/HeroSection.css";

export default function Backdrop({ imageUrl, size = "default" }) {
  const optimizedUrl = getOptimizedBackdropUrl(imageUrl);

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
