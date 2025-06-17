import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getUserDiary } from "@/services/users/users";
import { deleteLog } from "@/services/reviews/logs";
import { groupLogsByMonthAndDay } from "@/utils/logGrouper";
import FilmCard from "@/features/films/FilmCard";
import StarIcon from "@/components/ui/icons/StarIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import { Pencil, Trash2, FileEdit } from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";
import LogModal from "@/features/reviews/LogModal";
import { toast } from "react-hot-toast";
import useUserStore from "@/store/user/userStore";

export default function DiaryTab({ username }) {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  const { user: authUser } = useUserStore();
  const isOwnDiary = authUser?.username === username;

  useEffect(() => {
    async function loadDiary() {
      const data = await getUserDiary(username);
      setDiaryEntries(groupLogsByMonthAndDay(data));
      setLoading(false);
    }

    if (username) loadDiary();
  }, [username]);

  const handleEditClick = (log) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLog(null);
    setModalOpen(false);
  };

  const confirmDelete = (log) => {
    setLogToDelete(log);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!logToDelete) return;

    try {
      await deleteLog(logToDelete.log_id);
      toast.success("Log deleted");

      setDiaryEntries((prev) =>
        prev
          .map(({ month, days }) => ({
            month,
            days: days
              .map(({ day, logs }) => ({
                day,
                logs: logs.filter((log) => log.log_id !== logToDelete.log_id),
              }))
              .filter(({ logs }) => logs.length > 0),
          }))
          .filter(({ days }) => days.length > 0)
      );

      setConfirmOpen(false);
      setLogToDelete(null);
    } catch (err) {
      toast.error("Error deleting log");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} size="sm" filled />);
    }
    if (hasHalf) {
      stars.push(
        <span key="half" className="text-red-500 text-sm font-semibold ml-1">
          ½
        </span>
      );
    }
    return (
      <div className="flex items-center justify-center gap-[2px]">{stars}</div>
    );
  };

  if (loading) {
    return (
      <div className="text-center text-zinc-500 py-10 text-sm tracking-wide">
        Loading diary...
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {diaryEntries.map(({ month, days }) => (
        <section
          key={month}
          className="space-y-6 bg-zinc-950 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2">
            <FaRegCalendarAlt className="w-6 h-6 text-lime-400" />
            <h2 className="text-xl font-semibold text-white tracking-wide">
              {month.toUpperCase()}
            </h2>
          </div>

          <div className="px-1 space-y-1">
            <div
              className={`text-xs uppercase text-zinc-400 font-medium grid gap-x-4 ${
                isOwnDiary
                  ? "grid-cols-[80px_1fr_120px_60px_60px_80px]"
                  : "grid-cols-[80px_1fr_120px_60px_60px]"
              }`}
            >
              <div>Day</div>
              <div>Film</div>
              <div className="text-center">Rating</div>
              <div className="text-center">Liked</div>
              <div className="text-center">Reviewed</div>
              {isOwnDiary && <div className="text-right">Edit</div>}
            </div>
            <hr className="border-zinc-700" />
          </div>

          <div className="flex flex-col divide-y divide-zinc-800">
            {days.map(({ day, logs }) =>
              logs.map((log) => (
                <div
                  key={log.log_id}
                  className={`grid items-center py-3 gap-x-4 hover:bg-zinc-900/60 transition ${
                    isOwnDiary
                      ? "grid-cols-[80px_1fr_120px_60px_60px_80px]"
                      : "grid-cols-[80px_1fr_120px_60px_60px]"
                  }`}
                >
                  <div className="text-sm text-zinc-500 tabular-nums font-medium">
                    {String(day).padStart(2, "0")}
                  </div>

                  <div className="flex items-center gap-4">
                    <FilmCard
                      id={log.film.id}
                      title={log.film.title}
                      year={log.film.year}
                      posterUrl={log.film.posterUrl}
                      size="sm"
                      showUserActions={false}
                    />
                    <span className="text-white font-medium text-sm leading-tight">
                      {log.film.title} ({log.film.year})
                    </span>
                  </div>

                  <div className="flex justify-center">
                    {log.rating > 0 ? renderStars(log.rating) : null}
                  </div>

                  <div className="flex justify-center">
                    {log.liked && (
                      <HeartIcon active size="sm" color="text-green-500" />
                    )}
                  </div>

                  <div className="flex justify-center">
                    {log.reviewed && (
                      <Pencil
                        size={16}
                        strokeWidth={2}
                        className="text-yellow-400"
                        title="Reviewed"
                      />
                    )}
                  </div>

                  {isOwnDiary && (
                    <div className="flex justify-end items-center gap-3 pr-2">
                      <button
                        className="text-orange-400 hover:scale-110 transition"
                        title="Edit entry"
                        onClick={() => handleEditClick(log)}
                      >
                        <FileEdit size={16} strokeWidth={2} />
                      </button>

                      <button
                        className="text-red-500 hover:scale-110 transition"
                        title="Delete entry"
                        onClick={() => confirmDelete(log)}
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      ))}

      {selectedLog && (
        <LogModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          film={selectedLog.film}
          log={selectedLog}
          review={selectedLog.review}
          onSave={() => setDiaryEntries((prev) => [...prev])}
        />
      )}

      <Transition appear show={confirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setConfirmOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-zinc-950 p-6 rounded-xl shadow-xl max-w-sm w-full border border-zinc-700">
                <Dialog.Title className="text-lg font-semibold text-white">
                  Delete log?
                </Dialog.Title>
                <Dialog.Description className="text-sm text-zinc-400 mt-1">
                  This will permanently remove your log for{" "}
                  <strong className="text-white">
                    {logToDelete?.film.title}
                  </strong>
                  .
                </Dialog.Description>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-sm rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
