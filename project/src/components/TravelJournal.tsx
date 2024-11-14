import React, { useState, useEffect, useCallback } from "react";
import { AuthForm } from "./AuthForm";
import { Header } from "./Header";
import { EntryForm } from "./EntryForm";
import { EntryList } from "./EntryList";

interface User {
  email: string;
}

interface Suggestion {
  place_id: number;
  description: string;
}

// Fetch suggestions function
const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
  const response = await fetch(
    `https://api.example.com/suggestions?query=${query}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch suggestions");
  }
  return response.json();
};

// ユーティリティ関数
const loadSavedEntries = () => {
  if (typeof window !== "undefined") {
    const savedEntries = localStorage.getItem("journalEntries");
    return savedEntries ? JSON.parse(savedEntries) : [];
  }
  return [];
};

const loadSavedUser = () => {
  if (typeof window !== "undefined") {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  }
  return null;
};

export function TravelJournal() {
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isSignUpPage, setIsSignUpPage] = useState(false);
  const [user, setUser] = useState<User | null>(loadSavedUser);
  const [entries, setEntries] = useState(loadSavedEntries);
  const [newEntry, setNewEntry] = useState<{
    title: string;
    date: string;
    location: string;
    notes: string;
    image: string | null;
    video: string | null;
  }>({
    title: "",
    date: "",
    location: "",
    notes: "",
    image: null,
    video: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("journalEntries", JSON.stringify(entries));
    }
  }, [entries]);

  // ハンドラ関数
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLocationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewEntry({ ...newEntry, location: value });

    if (value.length > 2) {
      try {
        const suggestions = await fetchSuggestions(value);
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewEntry((prev) => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEntry.title || !newEntry.date || !newEntry.location) {
      alert("タイトル、日付、場所は必須項目です。");
      return;
    }

    if (editMode && editIndex !== null) {
      const updatedEntries = entries.map(
        (entry: typeof newEntry, index: number) =>
          index === editIndex ? newEntry : entry
      );
      setEntries(updatedEntries);
    } else {
      setEntries([...entries, { ...newEntry, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setNewEntry({
      title: "",
      date: "",
      location: "",
      notes: "",
      image: null,
      video:null,
    });
    setSuggestions([]);
    setEditMode(false);
    setEditIndex(null);
  };

  const handleEditEntry = (index: number) => {
    setEditMode(true);
    setEditIndex(index);
    setNewEntry(entries[index]);
  };

  const handleDeleteEntry = (index: number) => {
    if (window.confirm("このエントリを削除してもよろしいですか？")) {
      const updatedEntries: typeof entries = entries.filter(
        (_: User, i: number) => i !== index
      );
      setEntries(updatedEntries);
    }
  };

  // 認証フォームの表示
  const renderAuthForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f0] to-[#e6f3e6] p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-[#2c5f2d] mb-8 text-center">
            Virtual Travel Journal
          </h1>
          {isLoginPage || isSignUpPage ? (
            <AuthForm
              isLogin={isLoginPage}
              onClose={() => {
                setIsLoginPage(false);
                setIsSignUpPage(false);
              }}
              onAuthSuccess={handleAuthSuccess}
            />
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setIsLoginPage(true)}
                className="w-full py-2 bg-[#2c5f2d] text-white rounded-lg hover:bg-[#234a24] transition-colors"
              >
                ログイン
              </button>
              <button
                onClick={() => setIsSignUpPage(true)}
                className="w-full py-2 bg-[#2c5f2d] text-white rounded-lg hover:bg-[#234a24] transition-colors"
              >
                新規登録
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // メインコンテンツの表示
  const renderMainContent = () => (
    <>
      <Header email={user?.email || ""} onLogout={handleLogout} />
      <EntryForm
        newEntry={newEntry}
        editMode={editMode}
        suggestions={suggestions}
        onEntryChange={setNewEntry}
        onLocationChange={handleLocationChange}
        onSelectLocation={(place) =>
          setNewEntry({ ...newEntry, location: place.description })
        }
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
      />
      <EntryList
        entries={entries}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
      />
    </>
  );

  return user ? renderMainContent() : renderAuthForm();
}
