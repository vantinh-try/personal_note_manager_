import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Note.css";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState(""); // State for title
  const [editingIndex, setEditingIndex] = useState(null); // Track the note being edited

  const baseURL = "http://127.0.0.1:8000/api/notes/";

  useEffect(() => {
    axios
      .get(baseURL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch notes", error);
        alert("Could not fetch notes. Please try again.");
      });
  }, []);

  const handleAddNote = () => {
    if (!title.trim() || !input.trim()) {
      alert("Title and content are required!");
      return;
    }
  
    const newNote = { title, content: input };
    axios
      .post(baseURL, newNote, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setNotes([response.data, ...notes]);
        setInput("");
        setTitle("");
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.detail || "Unknown error occurred.";
        console.error("Failed to add note", error);
        alert(`Failed to add note: ${errorMessage}`);
      });
  };
  
  

  const handleEditNote = (index) => {
    setEditingIndex(index); // Set the note being edited
    setInput(notes[index].content); // Populate input with note content
    setTitle(notes[index].title); // Populate title input
  };

  const handleSaveNote = () => {
    if (input.trim() && title.trim() && editingIndex !== null) {
      const updatedNote = { title, content: input };
      const noteId = notes[editingIndex].id;

      axios
        .put(`${baseURL}${noteId}/`, updatedNote, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          const updatedNotes = [...notes];
          updatedNotes[editingIndex] = response.data;
          setNotes(updatedNotes);
          setInput("");
          setTitle("");
          setEditingIndex(null);
        })
        .catch((error) => {
          console.error("Failed to save note", error);
          alert("Failed to save note: " + (error.response?.data.detail || error.message));
        });
    }
  };

  const handleDeleteNote = (index) => {
    const noteId = notes[index].id;
    axios
      .delete(`${baseURL}${noteId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(() => {
        setNotes(notes.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.error("Failed to delete note", error);
        alert("Failed to delete note: " + (error.response?.data.detail || error.message));
      });
  };

  return (
    <div className="note-container">
      <h1>Personal Notes</h1>
      <input
        type="text"
        className="note-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title..."
      />
      <textarea
        className="note-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter note..."
      />
      <button
        className="add-note-button"
        onClick={editingIndex !== null ? handleSaveNote : handleAddNote}
      >
        {editingIndex !== null ? "Save" : "Add Note"}
      </button>
      <div className="notes-list">
        {notes.map((note, index) => (
          <div className="note-card" key={index}>
            <div className="note-title-display">{note.title}</div>
            <div className="note-content">{note.content}</div>
            <div className="note-footer">
              <span className="note-time">{new Date(note.created_at).toLocaleString()}</span>
              <div className="note-icons">
                <i
                  className="fas fa-edit"
                  onClick={() => handleEditNote(index)}
                />
                <i
                  className="fas fa-trash-alt"
                  onClick={() => handleDeleteNote(index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Note;
