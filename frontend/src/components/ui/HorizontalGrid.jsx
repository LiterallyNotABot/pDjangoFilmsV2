import { useRef } from "react";
import PropTypes from "prop-types";
import "./css/HorizontalGrid.css";

export default function HorizontalGrid({ title, items = [], renderItem }) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="horizontal-grid">
      {title && <h2 className="horizontal-grid-title">{title}</h2>}

      <div className="horizontal-scroll-wrapper">
        {/* Flechas */}
        <button onClick={() => scroll("left")} className="scroll-button left">←</button>

        <div ref={containerRef} className="horizontal-scroll">
          {items.slice(0, 10).map((item, index) => (
            <div key={index} className="grid-item">
              {renderItem(item)}
            </div>
          ))}
        </div>

        <button onClick={() => scroll("right")} className="scroll-button right">→</button>
      </div>
    </section>
  );
}

HorizontalGrid.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
};
