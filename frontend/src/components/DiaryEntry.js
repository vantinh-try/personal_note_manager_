import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./DiaryEntry.css";

const DiaryEntry = () => {
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const today = new Date().toISOString().split("T")[0]; // Lấy ngày hôm nay ở định dạng yyyy-mm-dd

  // Kiểm tra nếu ngày nhập vào là trong tương lai
  const isDateInFuture = (inputDate) => {
    return new Date(inputDate) > new Date();
  };

  // Thêm hoặc chỉnh sửa nhật ký
  const handleAddOrEditEntry = () => {
    if (entry && date) {
      if (isDateInFuture(date)) {
        alert("Ngày không được là ngày trong tương lai! Vui lòng chọn ngày hợp lệ.");
        return;
      }

      if (editingIndex !== null) {
        // Nếu đang ở chế độ chỉnh sửa, cập nhật mục nhật ký
        const updatedEntries = [...entries];
        updatedEntries[editingIndex] = { date: date, content: entry };
        setEntries(updatedEntries);
        setEditingIndex(null); // Reset chỉ mục sau khi lưu
      } else {
        // Thêm mới mục nhật ký
        const newEntries = [
          { date: date, content: entry },
          ...entries,
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(newEntries);
      }
      setEntry("");
      setDate(""); // Reset sau khi thêm hoặc chỉnh sửa
    } else {
      alert("Vui lòng nhập đầy đủ nội dung và ngày!");
    }
  };

  const handleEditEntry = (index) => {
    setEntry(entries[index].content);
    setDate(entries[index].date);
    setEditingIndex(index); // Lưu chỉ mục mục đang chỉnh sửa
  };

  const handleDeleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
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
          max={today} // Giới hạn nhập ngày đến hôm nay
        />
        <button onClick={handleAddOrEditEntry}>
          {editingIndex !== null ? "Lưu" : "Thêm Nhật Ký"} {/* Đổi tên nút */}
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
                <FaEdit className="edit-icon" onClick={() => handleEditEntry(index)} />
                <FaTrash className="delete-icon" onClick={() => handleDeleteEntry(index)} />
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
