import React, { useState, useEffect } from "react";
import './Task.css';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });
  const [error, setError] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [showError, setShowError] = useState(false);

  const validateTask = (task) => {
    const { title, description, dueDate } = task;
    const currentDate = new Date();
    const selectedDate = new Date(dueDate);
    let errors = {};

    if (!title) errors.title = "Please enter a title.";
    if (!description) errors.description = "Please enter a description.";
    if (!dueDate) errors.dueDate = "Please select a due date.";
    else if (selectedDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) 
      errors.dueDate = "The selected date is in the past.";

    return errors;
  };

  const addTask = (e) => {
    e.preventDefault();
    const errors = validateTask(newTask);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      setShowError(true);
      return;
    }

    setTasks([...tasks, { ...newTask, title: newTask.title.toUpperCase() }]);
    setNewTask({ title: "", description: "", dueDate: "", completed: false });
    setError({ title: "", description: "", dueDate: "" });
  };

  const completeTask = (index) => {
    const task = tasks[index];
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, { ...task, completed: true }]);
  };

  const uncompleteTask = (index) => {
    const task = completedTasks[index];
    const updatedCompletedTasks = completedTasks.filter((_, i) => i !== index);
    setCompletedTasks(updatedCompletedTasks);
    setTasks([...tasks, { ...task, completed: false }]);
  };

  const deleteTask = (index, isCompleted) => {
    if (isCompleted) {
      setCompletedTasks(completedTasks.filter((_, i) => i !== index));
    } else {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  // Hàm tự động điều chỉnh chiều cao của textarea khi nội dung thay đổi
  const handleTextareaChange = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // Reset chiều cao
    textarea.style.height = `${textarea.scrollHeight}px`; // Điều chỉnh chiều cao theo nội dung
    setNewTask({ ...newTask, description: e.target.value });
  };

  return (
    <div id="task-content">
      {showError && (
        <div className="error-overlay">
          <div className="error-message-container">
            {error.title && <div className="error-message">{error.title}</div>}
            {error.description && <div className="error-message">{error.description}</div>}
            {error.dueDate && <div className="error-message">{error.dueDate}</div>}
            <button className="error-button" onClick={() => setShowError(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="task-container">
        <h1>Quản lý công việc</h1>
        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Nhập tiêu đề"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <textarea
            className="textarea-task"
            placeholder="Nhập mô tả công việc"
            value={newTask.description}
            onChange={handleTextareaChange} // Gọi hàm thay đổi chiều cao
          />
          <div className="form-row">
            <input
              type="date"
              placeholder="Due Date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <button type="submit">Add Task</button>
          </div>
        </form>
        <div className="task-list">
          {tasks.map((task, index) => (
            <div key={index} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <button onClick={() => deleteTask(index, false)} className="delete-button">
                🗑️
              </button>
              <div className="task-meta-container">
                <div className="task-meta">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => completeTask(index)}
                    className="task-checkbox"
                  />
                  <p>Thời gian hoàn thành: {task.dueDate}</p>
                  <p>Trạng thái: {task.completed ? "Đã hoàn thành" : "Đang chờ"}</p>
                </div>
              </div>
              <h3>{task.title}</h3>
              <p className="task-description">{task.description}</p>
            </div>
          ))}
        </div>
        <div className="completed-tasks">
          <h3>Completed Tasks</h3>
          {completedTasks.map((task, index) => (
            <div key={index} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <button onClick={() => deleteTask(index, true)} className="delete-button">
                🗑️
              </button>
              <div className="task-meta-container">
                <div className="task-meta">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => uncompleteTask(index)}
                    className="task-checkbox"
                  />
                  <p>Thời gian hoàn thành: {task.dueDate}</p>
                  <p>Trạng thái: {task.completed ? "Đã hoàn thành" : "Đang chờ"}</p>
                </div>
              </div>
              <h3>{task.title}</h3>
              <p className="task-description">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Task;
