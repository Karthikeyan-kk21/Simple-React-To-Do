import "./Todo.css";
import React, { useState, useEffect } from "react";

function Todo() {
  const [tasks, setTasks] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("myTasks");
    if (saved) {
      setTaskList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("myTasks", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = () => {
    if (tasks.trim() === "") return;
    setTaskList([...taskList, { text: tasks, completed: false }]);
    setTasks("");
  };

  const deleteTask = (indexToRemove) => {
    const confirmDelete = window.confirm("Are you sure to delete task?");
    if (!confirmDelete) return;
    const updatedList = taskList.filter((_, index) => index !== indexToRemove);
    setTaskList(updatedList);
  };

  const toggleCompleted = (indexToToggle) => {
    const updated = taskList.map((task, index) =>
      index === indexToToggle ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updated);
  };

  const updatedTask = () => {
    const updated = taskList.map((task, index) =>
      index === editIndex ? { ...task, text: editText } : task
    );
    setTaskList(updated);
    setEditIndex(null);
    setEditText("");
  };

  const filtertask = () =>
    taskList.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });

  const clearAllTask = () => {
    setTaskList([]);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newList = [...taskList];
    const temp = newList[index - 1];
    newList[index - 1] = newList[index];
    newList[index] = temp;
    setTaskList(newList);
  };

  const moveDown = (index) => {
    if (index === taskList.length - 1) return;
    const newList = [...taskList];
    const temp = newList[index + 1];
    newList[index + 1] = newList[index];
    newList[index] = temp;
    setTaskList(newList);
  };

  const toggleMode = () => {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode);
  }

  return (
    <div className="todo-container">
      <h1>My To-Do List</h1>
      <button className="toggle-button" onClick={toggleMode} >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
      <div className="inputs">
        <input
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Enter Task"
        />
        <button
          className="add-button"
          onClick={addTask}
          disabled={tasks.trim() === ""}
        >
          Add
        </button>
        <button className="clear-button" onClick={clearAllTask}>
          Clear All
        </button>
      </div>

      <div className="filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "active" : ""}
        >
          Pending
        </button>
      </div>

      <ul className="task-list">
        {filtertask().map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(index)}
            />
            {editIndex === index ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit task"
                />
                <div className="task-actions">
                  <button className="update-button" onClick={updatedTask}>
                    ✅
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className={task.completed ? "completed" : ""}>
                  {task.text}
                </span>
                <div className="task-actions">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditIndex(index);
                      setEditText(task.text);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(index)}
                  >
                    ❌
                  </button>
                  <button
                    className="move-button"
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                  >
                    ⬆️
                  </button>
                  <button
                    className="move-button"
                    disabled={index === taskList.length - 1}
                    onClick={() => moveDown(index)}
                  >
                    ⬇️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
