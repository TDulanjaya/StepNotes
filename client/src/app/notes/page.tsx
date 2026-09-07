"use client";
import { useState } from "react";

type Note = { id: number; title: string; content: string };

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    // API call goes here later — for now just add it to local state
    setNotes([...notes, { id: Date.now(), title, content }]);
    setTitle("");
    setContent("");
  };

  const logout = () => {
    // clear token / redirect goes here later
  };

  return (
    <div style={{ maxWidth: 480, margin: "3rem auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>My Notes</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <form onSubmit={addNote} style={{ marginBottom: 24 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          style={{ display: "block", width: "100%", marginBottom: 8 }}
        />
        <button type="submit">Add Note</button>
      </form>

      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((n) => (
            <li key={n.id}>
              <b>{n.title}</b>: {n.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}