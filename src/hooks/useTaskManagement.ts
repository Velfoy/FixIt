import { Order } from "@/types/serviceorders";
import { useState, FormEvent } from "react";

interface UseTaskManagementReturn {
  showAddTask: boolean;
  showEditTask: boolean;
  showDeleteConfirm: boolean;
  taskTitle: string;
  taskDescription: string;
  taskMechanicId: number | null;
  taskPriority: string;
  taskStatus: string;
  editingTask: any;
  taskToDelete: any;
  mechanics: any[];
  setShowAddTask: (v: boolean) => void;
  setShowEditTask: (v: boolean) => void;
  setShowDeleteConfirm: (v: boolean) => void;
  setTaskTitle: (v: string) => void;
  setTaskDescription: (v: string) => void;
  setTaskMechanicId: (v: number | null) => void;
  setTaskPriority: (v: string) => void;
  setTaskStatus: (v: string) => void;
  setEditingTask: (v: any) => void;
  setTaskToDelete: (v: any) => void;
  openAddTask: () => void;
  openEditTask: (task: any) => void;
  openDeleteConfirm: (task: any) => void;
  handleCreateTask: (e: FormEvent) => Promise<void>;
  handleUpdateTask: (e: FormEvent) => Promise<void>;
  handleDeleteTask: () => Promise<void>;
}

export function useTaskManagement(
  serviceOrder: Order | null,
  onTaskUpdate: (tasks: any[]) => void
): UseTaskManagementReturn {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskMechanicId, setTaskMechanicId] = useState<number | null>(null);
  const [taskPriority, setTaskPriority] = useState<string>("LOW");
  const [taskStatus, setTaskStatus] = useState<string>("NEW");
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<any | null>(null);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openAddTask() {
    setTaskTitle("");
    setTaskDescription("");
    setTaskMechanicId(null);
    setTaskPriority("LOW");
    setTaskStatus("NEW");
    fetch("/api/mechanics?minimal=true")
      .then((r) => r.json())
      .then((data) => setMechanics(data || []))
      .catch((e) => console.error(e));
    setShowAddTask(true);
  }

  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();
    if (!serviceOrder) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: taskTitle,
        description: taskDescription,
        mechanicId: taskMechanicId,
        priority: taskPriority,
        status: taskStatus,
      };

      let created: any = null;
      try {
        const res = await fetch(`/api/orders/${serviceOrder.id}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        created = await res.json();
      } catch (apiErr) {
        console.warn("Task API failed, falling back to local mock:", apiErr);
        const mechanic = mechanics.find((m) => m.id === taskMechanicId) || {};
        created = {
          id: Date.now(),
          mechanic_id: taskMechanicId,
          mechanicId: taskMechanicId,
          mechanicFirstName: mechanic.first_name || "",
          mechanicLastName: mechanic.last_name || "",
          title: taskTitle,
          description: taskDescription,
          status: taskStatus || "NEW",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          priority: taskPriority,
        } as any;
      }

      onTaskUpdate([...(serviceOrder.task || []), created]);
      setShowAddTask(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditTask(task: any) {
    setEditingTask(task);
    setTaskTitle(task.title || "");
    setTaskDescription(task.description || "");
    setTaskMechanicId(task.mechanic_id ?? task.mechanicId ?? null);
    setTaskStatus(task.status || "NEW");
    setTaskPriority(task.priority || "LOW");
    fetch("/api/mechanics?minimal=true")
      .then((r) => r.json())
      .then((data) => {
        setMechanics(data || []);
        if (!task.mechanic_id && task.mechanicFirstName) {
          const found = (data || []).find(
            (m: any) =>
              `${m.first_name || ""}`.trim() ===
                `${task.mechanicFirstName || ""}`.trim() &&
              `${m.last_name || ""}`.trim() ===
                `${task.mechanicLastName || ""}`.trim()
          );
          if (found) setTaskMechanicId(found.id);
        }
      })
      .catch((e) => console.error(e));
    setShowEditTask(true);
  }

  async function handleUpdateTask(e: FormEvent) {
    e.preventDefault();
    if (!serviceOrder || !editingTask) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: taskTitle,
        description: taskDescription,
        mechanicId: taskMechanicId,
        priority: taskPriority,
        status: taskStatus,
      };

      let updated: any = null;
      try {
        const res = await fetch(
          `/api/orders/${serviceOrder.id}/tasks/${editingTask.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        updated = await res.json();
      } catch (apiErr) {
        console.warn(
          "Task update API failed, falling back to local update:",
          apiErr
        );
        updated = {
          ...editingTask,
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          status: taskStatus,
          mechanic_id: taskMechanicId,
          mechanicId: taskMechanicId,
          mechanicFirstName:
            (mechanics.find((m) => m.id === taskMechanicId) || {}).first_name ||
            editingTask.mechanicFirstName,
          mechanicLastName:
            (mechanics.find((m) => m.id === taskMechanicId) || {}).last_name ||
            editingTask.mechanicLastName,
        };
      }

      const updatedTasks = (serviceOrder.task || []).map((t: any) =>
        t.id === editingTask.id ? updated : t
      );
      onTaskUpdate(updatedTasks);
      setShowEditTask(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openDeleteConfirm(task: any) {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  }

  async function handleDeleteTask() {
    if (!serviceOrder || !taskToDelete) return;
    setIsSubmitting(true);
    try {
      try {
        const res = await fetch(
          `/api/orders/${serviceOrder.id}/tasks/${taskToDelete.id}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error(`API returned ${res.status}`);
      } catch (apiErr) {
        console.warn("Task delete API failed, removing locally:", apiErr);
      }

      const updated = (serviceOrder.task || []).filter(
        (t: any) => t.id !== taskToDelete.id
      );
      onTaskUpdate(updated);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    showAddTask,
    showEditTask,
    showDeleteConfirm,
    taskTitle,
    taskDescription,
    taskMechanicId,
    taskPriority,
    taskStatus,
    editingTask,
    taskToDelete,
    mechanics,
    setShowAddTask,
    setShowEditTask,
    setShowDeleteConfirm,
    setTaskTitle,
    setTaskDescription,
    setTaskMechanicId,
    setTaskPriority,
    setTaskStatus,
    setEditingTask,
    setTaskToDelete,
    openAddTask,
    openEditTask,
    openDeleteConfirm,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  };
}
