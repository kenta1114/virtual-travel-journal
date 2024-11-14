import { Edit2, Trash2, Calendar, MapPin } from "lucide-react";

interface Entry {
  title: string;
  date: string;
  location: string;
  notes: string;
  image: string | null;
}

interface EntryListProps {
  entries: Entry[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function EntryList({ entries, onEdit, onDelete }: EntryListProps) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#2c5f2d]">
                {entry.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(index)}
                  className="p-2 text-gray-600 hover:text-[#2c5f2d] transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {entry.date}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {entry.location}
              </div>
            </div>
            {entry.image && (
              <img
                src={entry.image}
                alt={entry.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-700 whitespace-pre-wrap">{entry.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
