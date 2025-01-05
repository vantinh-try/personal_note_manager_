import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Task.css";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const baseURL = "http://127.0.0.1:8000/api/tasks/";

  useEffect(() => {
    axios
      .get(baseURL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setTasks(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Failed to fetch tasks:", error);
        alert("Could not fetch tasks. Please try again.");
      });
  }, []);

  const handleAddTask = () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    const newTask = { title, description };
    axios
      .post(baseURL, newTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setTasks([response.data, ...tasks]);
        resetForm();
      })
      .catch((error) => {
        console.error("Failed to add task:", error.response || error.message);
        alert("Failed to add task.");
      });
  };

  const handleSaveTask = () => {
    const taskId = tasks[editingIndex].id;
    const updatedTask = { title, description };
    axios
      .put(`${baseURL}${taskId}/`, updatedTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = response.data;
        setTasks(updatedTasks);
        resetForm();
      })
      .catch((error) => {
        console.error("Failed to update task:", error.response || error.message);
        alert("Failed to update task.");
      });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingIndex(null);
  };

  return (
    <div className="task-container">
      <h1>Task Management</h1>
      <div className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={editingIndex !== null ? handleSaveTask : handleAddTask}>
          {editingIndex !== null ? "Save Task" : "Add Task"}
        </button>
      </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Created At: {new Date(task.created_at).toLocaleString()}</p>
            <button onClick={() => {
              setEditingIndex(index);
              setTitle(task.title);
              setDescription(task.description);
            }}>
              Edit
            </button>
            <button onClick={() => {
              axios
                .delete(`${baseURL}${task.id}/`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                  },
                })
                .then(() => {
                  setTasks(tasks.filter((_, i) => i !== index));
                })
                .catch((error) => {
                  console.error("Failed to delete task:", error.response || error.message);
                });
            }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
