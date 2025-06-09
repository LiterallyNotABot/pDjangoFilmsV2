import PropTypes from "prop-types";
import placeholderImg from "@/assets/no_person_placeholder.png";

export default function PersonCard({ person, size = "md" }) {
  const sizeStyles = {
    sm: { w: "w-21", h: "h-30", text: "text-sm" },
    md: { w: "w-32", h: "h-44", text: "text-base" },
    lg: { w: "w-48", h: "h-64", text: "text-lg" },
  };

  const { w, h, text } = sizeStyles[size] || sizeStyles.md;
  const imageUrl = person.picture_url || placeholderImg;

  return (
    <div className="flex flex-col items-center text-center text-white">
      <div
        className={`${w} ${h} mb-2 rounded-lg overflow-hidden border-2 border-transparent hover:border-yellow-500 transition-all duration-300 shadow-md transform hover:scale-105`}
      >
        <img
          src={imageUrl}
          alt={person.name}
          className="w-full h-full object-contain bg-black"
        />
      </div>
      <h2 className={`${text} font-semibold`}>{person.name}</h2>
    </div>
  );
}
