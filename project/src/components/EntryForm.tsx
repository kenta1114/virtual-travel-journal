import { Camera } from "lucide-react";

interface EntryFormProps {
  newEntry: {
    title: string;
    date: string;
    location: string;
    notes: string;
    image: string | null;
    video: string | null;
  };
  editMode: boolean;
  suggestions: { place_id: number; description: string }[];
  onEntryChange: (entry: {
    title: string;
    date: string;
    location: string;
    notes: string;
    image: string | null;
    video: string | null;
  }) => void;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectLocation: (place: { place_id: number; description: string }) => void;
  onImageUpload: (file: File) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EntryForm({
  newEntry,
  editMode,
  suggestions,
  onEntryChange,
  onLocationChange,
  onSelectLocation,
  onImageUpload,
  onSubmit,
}: EntryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="タイトル"
          value={newEntry.title}
          onChange={(e) =>
            onEntryChange({ ...newEntry, title: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2c5f2d] focus:border-transparent transition-all"
        />
        <input
          type="date"
          value={newEntry.date}
          onChange={(e) => onEntryChange({ ...newEntry, date: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2c5f2d] focus:border-transparent transition-all"
        />
        <div className="relative">
          <input
            type="text"
            placeholder="場所"
            value={newEntry.location}
            onChange={onLocationChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2c5f2d] focus:border-transparent transition-all"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100">
              {suggestions.map((place) => (
                <div
                  key={place.place_id}
                  onClick={() => onSelectLocation(place)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {place.description}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(e) => e.target.files && onImageUpload(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center px-4 py-3 rounded-lg border border-[#2c5f2d] text-[#2c5f2d] hover:bg-[#f0f9f0] cursor-pointer transition-colors"
          >
            <Camera className="w-5 h-5 mr-2" />
            写真を選択
          </label>
          {newEntry.image && (
            <div className="mt-2">
              <img
                src={newEntry.image}
                alt="プレビュー"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
      <textarea
        placeholder="メモ"
        value={newEntry.notes}
        onChange={(e) => onEntryChange({ ...newEntry, notes: e.target.value })}
        className="w-full px-4 py-3 h-32 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2c5f2d] focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3 bg-[#2c5f2d] text-white rounded-lg hover:bg-[#234a24] transition-colors flex items-center justify-center gap-2"
      >
        {editMode ? "更新" : "追加"}
      </button>
    </form>
  );
}
