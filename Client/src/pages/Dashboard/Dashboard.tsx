import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../../api";
import TaskModal from "../../components/TaskModal";
import "./dashboard.css";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskStatus, setTaskStatus] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState("");

  // Load tasks
  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!loading && token && !calledRef.current) {
      setAuthToken(token);
      calledRef.current = true;
      loadTasks();
    }
  }, [loading, token]);

  const shortId = (id: string) => id.slice(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!taskName.trim()) return;

    try {
      if (editMode) {
        const res = await api.put(`/tasks/${currentTaskId}`, {
          title: taskName,
          completed: taskStatus,
        });
        setTasks(prev => prev.map(t => (t.id === currentTaskId ? res.data : t)));
      } else {
        const res = await api.post("/tasks", { title: taskName });
        setTasks(prev => [...prev, res.data]);
      }
      closeModal();
    } catch {
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const openModalForEdit = (task: Task) => {
    setEditMode(true);
    setTaskName(task.title);
    setTaskStatus(task.completed);
    setCurrentTaskId(task.id);
    setShowModal(true);
  };

  const openModalForAdd = () => {
    setEditMode(false);
    setTaskName("");
    setTaskStatus(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTaskName("");
    setTaskStatus(false);
    setEditMode(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dash-wrapper">
      <div className="dash-container">
        <div className="dash-header">
          <h2>Task Manager</h2>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>

        <button className="add-btn" onClick={openModalForAdd}>+ Add Task</button>

        <div className="task-table-box">
          <table className="task-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr><td colSpan={4}>No tasks found</td></tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id}>
                    <td>{shortId(task.id)}</td>
                    <td>{task.title}</td>
                    <td>{task.completed ? "Completed" : "Pending"}</td>
                    <td className="task-actions">
                      <button onClick={() => openModalForEdit(task)}>Edit</button>
                      <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <TaskModal
          title={editMode ? "Edit Task" : "Add Task"}
          taskName={taskName}
          setTaskName={setTaskName}
          status={editMode ? taskStatus : undefined}
          setStatus={editMode ? setTaskStatus : undefined}
          onSave={handleSave}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
