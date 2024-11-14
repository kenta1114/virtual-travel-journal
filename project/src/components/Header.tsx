import { LogOut } from "lucide-react";

interface HeaderProps {
  email: string;
  onLogout: () => void;
}

export function Header({ email, onLogout }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold text-[#2c5f2d]">
        Virtual Travel Journal
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{email}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
      </div>
    </div>
  );
}
