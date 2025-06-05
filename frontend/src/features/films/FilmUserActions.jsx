import { useState } from "react";
import useUserStore from "@/store/user/userStore";
import useFilmUserActivity from "@/hooks/useFilmUserActivity";
import EyeIcon from "@/components/ui/icons/EyeIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import PlusIcon from "@/components/ui/icons/PlusIcon";
import PencilIcon from "@/components/ui/icons/PencilIcon";
import ListIcon from "@/components/ui/icons/ListIcon";
import StarRating from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import LogModal from "@/features/reviews/LogModal";

export default function FilmUserActions({ filmId, onTriggerLogin, filmData }) {
  const { user } = useUserStore();
  const {
    liked,
    watched,
    watchlisted,
    rating,
    updateField,
    toggleWatchlist,
    loading,
    refetch,
  } = useFilmUserActivity(filmId);

  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return (
      <div className="bg-zinc-800 p-4 rounded text-center text-white">
        <p className="text-sm mb-2">Log in to track this film</p>
        <Button onClick={onTriggerLogin} variant="primary">
          Login
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-900 rounded-lg overflow-hidden text-sm text-white shadow">
        {/* Acciones principales */}
        <div className="flex justify-around border-b border-zinc-700 p-4">
          <IconAction
            label="Watch"
            active={watched}
            Icon={EyeIcon}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              updateField("watched", !watched);
            }}
          />
          <IconAction
            label="Like"
            active={liked}
            Icon={HeartIcon}
            onClick={() => updateField("liked", !liked)}
          />
          <IconAction
            label="Watchlist"
            active={watchlisted}
            Icon={PlusIcon}
            onClick={() => toggleWatchlist()}
          />
        </div>

        {/* Rating */}
        <div className="text-center border-b border-zinc-700 p-5">
          <p className="mb-2 text-gray-400 text-base">Rate</p>
          <StarRating
            value={rating}
            onChange={(val) => updateField("rating", val)}
            size="xl"
            interactive
          />
        </div>

        {/* Extras */}
        <div className="divide-y divide-zinc-700">
          <ActionItem
            icon={<PencilIcon size="lg" />}
            text="Review or log..."
            onClick={() => setShowModal(true)}
          />
          <ActionItem
            icon={<ListIcon size="lg" />}
            text="Add to lists..."
            onClick={() => console.log("abrir listas (próximo modal)")}
          />
        </div>
      </div>

      {/* Modal de log */}
      <LogModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        film={filmData}
        onSave={() => {
          refetch();
          setShowModal(false);
        }}
      />
    </>
  );
}

function IconAction({ Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-zinc-300 group focus:outline-none"
    >
      <Icon size="xl" active={active} />
      <span className="text-xs mt-1 text-zinc-300">{label}</span>
    </button>
  );
}

function ActionItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 hover:bg-zinc-800 group transition text-left"
    >
      {icon}
      <span className="text-[15px] text-zinc-300 group-hover:text-green-400 transition">
        {text}
      </span>
    </button>
  );
}