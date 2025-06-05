import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StarRating from "@/components/ui/StarRating";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import { postLog } from "@/services/reviews/logs";
import {
  patchUserFilmActivity,
  deleteWatchlistEntry,
} from "@/services/users/users";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import { toast } from "react-hot-toast";
import { isNotFoundError, handleApiError } from "@/services/exceptionHelper";

export default function LogModal({ isOpen, onClose, film, onSave = () => {} }) {
  const today = new Date();
  const [watchedDate, setWatchedDate] = useState(today);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const setActivity = useFilmActivityStore((state) => state.setActivity);

  const handleSubmit = async () => {
    const payload = {
      filmId: film?.id,
      watched_date: watchedDate.toISOString().split("T")[0],
      review,
      rating,
      liked,
    };

    try {
      setLoading(true);

      await postLog(payload);
      await patchUserFilmActivity(film.id, {
        watched: true,
        liked,
        rating: rating || null,
      });

      // Ignora error si no hay entrada en la watchlist
      await deleteWatchlistEntry(film.id).catch((err) => {
        if (!isNotFoundError(err)) throw err;
      });

      setActivity(film.id, {
        watched: true,
        liked,
        rating,
        watchlisted: false,
      });

      toast.success("Log guardado exitosamente");
      onSave();
      onClose();
    } catch (err) {
      const friendly = handleApiError(err);
      toast.error(friendly.message);
      console.error("LogModal error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-zinc-950 text-white p-6 shadow-2xl border border-zinc-800 hover:border-yellow-600 transition-all">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <h2 className="text-2xl font-bold text-red-600">
                    Log this film
                  </h2>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-zinc-400 font-medium">
                      Watched on
                    </label>
                    <DatePicker
                      selected={watchedDate}
                      onChange={setWatchedDate}
                      className="bg-zinc-800 text-white border border-zinc-600 text-sm rounded px-2 py-1"
                      calendarClassName="bg-zinc-900 text-white border border-zinc-600 rounded shadow"
                      popperPlacement="bottom-end"
                      dateFormat="dd/MM/yyyy"
                    />
                    <button
                      onClick={onClose}
                      className="text-zinc-500 hover:text-red-400 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Review */}
                <div className="flex gap-6 mb-6">
                  <img
                    src={film?.posterUrl}
                    alt={film?.title}
                    className="w-24 rounded-lg shadow border border-zinc-700"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {film?.title}{" "}
                      <span className="text-zinc-500 font-normal">
                        ({film?.year})
                      </span>
                    </h3>
                    <label className="block text-sm text-zinc-400 font-medium mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="What did you think?"
                      rows={4}
                      className="w-full bg-zinc-800 border border-zinc-600 text-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 resize-none"
                    />
                  </div>
                </div>

                {/* Rating / Liked / Save */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300">Rating</span>
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        size="lg"
                        interactive
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300">Liked</span>
                      <HeartIcon
                        active={liked}
                        size="lg"
                        onClick={() => setLiked((prev) => !prev)}
                        className="hover:text-green-500 transition"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-5 py-2 ${
                      loading ? "bg-zinc-600" : "bg-red-600 hover:bg-green-600"
                    } text-white font-semibold rounded-lg shadow transition`}
                  >
                    {loading ? "Saving..." : "Save Log"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
