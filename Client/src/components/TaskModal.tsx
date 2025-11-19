import { useEffect, useRef, useState } from "react";
import "../pages/Dashboard/dashboard.css";

interface Props {
  title: string;
  taskName: string;
  setTaskName: (value: string) => void;
  status?: boolean;
  setStatus?: (value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function TaskModal({
  title,
  taskName,
  setTaskName,
  status,
  setStatus,
  onSave,
  onCancel,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSave = () => {
    if (!taskName.trim()) {
      setError("Task name is mandatory");
      return;
    }
    setError(""); // clear error
    onSave();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>

        <label htmlFor="taskName">Task Name</label>
        <input
          ref={inputRef}
          id="taskName"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        {error && <p className="error-msg">{error}</p>}

        {status !== undefined && setStatus && (
          <>
            <label htmlFor="taskStatus">Status</label>
            <select
              id="taskStatus"
              value={status ? "completed" : "pending"}
              onChange={(e) => setStatus(e.target.value === "completed")}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </>
        )}

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
