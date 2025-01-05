import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "./DiaryEntry.css";

const DiaryEntry = () => {
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const baseURL = "http://127.0.0.1:8000/api/diary/";

  // Lấy danh sách nhật ký từ backend
  useEffect(() => {
    axios
      .get(baseURL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch diary entries", error);
        alert("Could not fetch diary entries. Please try again.");
      });
  }, []);

  const handleAddOrEditEntry = () => {
    if (entry && date) {
      if (new Date(date) > new Date()) {
        alert("Ngày không được là ngày trong tương lai!");
        return;
      }

      const diaryEntry = { date, content: entry };
      if (editingIndex !== null) {
        // Cập nhật nhật ký
        const entryId = entries[editingIndex].id;
        axios
          .put(`${baseURL}${entryId}/`, diaryEntry, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((response) => {
            const updatedEntries = [...entries];
            updatedEntries[editingIndex] = response.data;
            setEntries(updatedEntries);
            resetForm();
          })
          .catch((error) => {
            console.error("Failed to update diary entry", error);
            alert("Failed to update diary entry.");
          });
      } else {
        // Thêm nhật ký mới
        axios
          .post(baseURL, diaryEntry, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((response) => {
            setEntries([response.data, ...entries]);
            resetForm();
          })
          .catch((error) => {
            console.error("Failed to add diary entry", error);
            alert("Failed to add diary entry.");
          });
      }
    } else {
      alert("Vui lòng nhập đầy đủ nội dung và ngày!");
    }
  };

  const handleDeleteEntry = (index) => {
    const entryId = entries[index].id;
    axios
      .delete(`${baseURL}${entryId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(() => {
        setEntries(entries.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.error("Failed to delete diary entry", error);
        alert("Failed to delete diary entry.");
      });
  };

  const resetForm = () => {
    setEntry("");
    setDate("");
    setEditingIndex(null);
  };

  return (
    <div className="diary-container">
      <h1>Nhật Ký Cá Nhân</h1>
      <div className="diary-inputs">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Nhập nội dung nhật ký..."
          rows="5"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
        />
        <button onClick={handleAddOrEditEntry}>
          {editingIndex !== null ? "Lưu" : "Thêm Nhật Ký"}
        </button>
      </div>
      <div className="diary-entries">
        {entries.map((entry, index) => (
          <div key={index} className="diary-card">
            <div className="diary-header">
              <div className="diary-time">
                {new Date(entry.date).toLocaleDateString()}
              </div>
              <div className="diary-actions">
                <FaEdit onClick={() => {
                  setEntry(entry.content);
                  setDate(entry.date);
                  setEditingIndex(index);
                }} />
                <FaTrash onClick={() => handleDeleteEntry(index)} />
              </div>
            </div>
            <div className="diary-content">{entry.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaryEntry;
