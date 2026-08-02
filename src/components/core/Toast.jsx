import { useStateContext } from "../../contexts/ContextProvider";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Toast() {
  const { toast, setToast } = useStateContext();

  if (!toast.show) return null;

  const handleClose = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="fixed right-4 bottom-4 w-80 bg-gray-800 text-white rounded-lg shadow-lg z-50 animate-fade-in-down transition-opacity duration-300 ease-in-out opacity-90">
      <div className="flex items-center justify-between p-4">
        <span>{toast.message}</span>
        <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
