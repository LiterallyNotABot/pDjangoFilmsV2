import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StarRating from "@/components/ui/StarRating";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import { postLog } from "@/services/reviews/logs";
import {patchUserFilmActivity, deleteWatchlistEntry,} from "@/services/users/users";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import { toast } from "react-hot-toast";
import { isNotFoundError, handleApiError } from "@/services/exceptionHelper";
import "./css/LogModal.css";

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
          <div className="modal-overlay" />
        </Transition.Child>

        <div className="modal-wrapper">
          <div className="modal-inner">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-panel">
                <div className="modal-header">
                  <h2 className="text-2xl font-bold text-red-600">
                    Log this film
                  </h2>
                  <div className="modal-date-controls">
                    <label className="text-sm text-zinc-400 font-medium">
                      Watched on
                    </label>
                    <DatePicker
                      selected={watchedDate}
                      onChange={setWatchedDate}
                      className="modal-datepicker"
                      calendarClassName="modal-calendar"
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

                <div className="modal-review-section">
                  <img
                    src={film?.posterUrl}
                    alt={film?.title}
                    className="modal-poster"
                  />
                  <div className="modal-review-info">
                    <h3 className="modal-review-title">
                      {film?.title}{" "}
                      <span className="modal-review-year">({film?.year})</span>
                    </h3>
                    <label className="modal-review-label">Your Review</label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="What did you think?"
                      rows={4}
                      className="modal-textarea"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="modal-footer-left">
                    <div className="modal-footer-group">
                      <span className="modal-footer-label">Rating</span>
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        size="lg"
                        interactive
                      />
                    </div>
                    <div className="modal-footer-group">
                      <span className="modal-footer-label">Liked</span>
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
                    className={`modal-save-button ${
                      loading ? "modal-save-loading" : "modal-save-ready"
                    }`}
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
