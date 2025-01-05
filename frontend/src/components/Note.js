import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Note.css";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState(""); // Thêm state cho tiêu đề
  const [editingIndex, setEditingIndex] = useState(null); // Thêm state để theo dõi ghi chú đang được chỉnh sửa

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
      console.error("Failed", error);
    });
  }, []);

  const handleAddNote = () => {
    if (input.trim() && title.trim()) {
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
        console.error("Failed", error);
      });
    }
  };

  const handleEditNote = (index) => {
    setEditingIndex(index); // Chỉ ra ghi chú đang được chỉnh sửa
    setInput(notes[index].content); // Điền nội dung vào ô nhập
    setTitle(notes[index].title); // Điền tiêu đề vào ô nhập
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
        console.error("Failed", error);
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
      console.error("Failed", error);
      
    });
  };

  return (
    <div className="note-container">
      <h1>Ghi chú cá nhân</h1>
      <input
        type="text"
        className="note-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề..."
      />
      <textarea
        className="note-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập ghi chú..."
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
            <div className="note-title-display">{note.title}</div> {/* Hiển thị tiêu đề */}
            <div className="note-content">{note.content}</div>
            <div className="note-footer">
              <span className="note-time">{new Date(note.created_at).toLocaleString()}</span>
              <div className="note-icons">
                <i
                  className="fas fa-edit"
                  onClick={() => handleEditNote(index)} // Bấm vào chỉnh sửa
                />
                <i
                  className="fas fa-trash-alt"
                  onClick={() => handleDeleteNote(index)} // Xóa ghi chú
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
