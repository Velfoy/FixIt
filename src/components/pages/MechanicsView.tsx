"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Mechanic, EmploymentType } from "@/types/mechanics";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Car,
  Check,
  DollarSign,
  Calendar,
  Star,
  Clock,
  Edit,
} from "lucide-react";
import "@/styles/users.css";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";

const MechanicsView = ({
  session,
  dataMechanics,
}: {
  session: any;
  dataMechanics: Mechanic[];
}) => {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const [mechanics, setMechanics] = useState<Mechanic[]>(dataMechanics);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedMechanic, setSelectedMechanic] = useState<number | null>(null);
  const [editingMechanicId, setEditingMechanicId] = useState<number | null>(
    null
  );
  const [employmentTypeFilter, setEmploymentTypeFilter] =
    useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const existingEmpoymentTypes = [
    "FULL_TIME",
    "PART_TIME",
    "CONTRACTOR",
    "INTERN",
  ];
  const [showAddMechanic, setShowAddMechanic] = useState(false);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const [newMechanic, setNewMechanic] = useState<{
    salary?: number;
    employment_type?: EmploymentType;
    is_Active?: boolean;
    specialization?: string;
    position?: string;
    hired_at?: Date;
    terminated_at?: Date | null;
  }>({
    salary: 0,
    employment_type: "FULL_TIME",
    is_Active: true,
    specialization: "",
    position: "",
    hired_at: new Date(),
    terminated_at: null,
  });
  const [existingUsers, setExistingUsers] = useState<
    {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
    }[]
  >([]);
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const clients = data.filter(
          (u: any) => !mechanics.some((c) => c.email === u.email)
        );
        setExistingUsers(clients);
      })
      .catch(console.error);
  }, []);

  const filteredMechanics =
    mechanics?.filter((mechanic) => {
      const name = `${mechanic.firstName || " "} ${mechanic.lastName}`.trim();
      const email = mechanic.email || " ";
      const phone = mechanic.phone || " ";

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEmploymentType =
        employmentTypeFilter === "ALL" ||
        mechanic.employment_type === employmentTypeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && mechanic.is_Active) ||
        (statusFilter === "TERMINATED" && !mechanic.is_Active);

      return matchesSearch && matchesEmploymentType && matchesStatus;
    }) || [];
  const selectedMechanicData = mechanics?.find(
    (c) => c.id === selectedMechanic
  );
  function openEditModal(mechanic: Mechanic) {
    setEditingMechanicId(mechanic.id);
    setNewMechanic({
      salary: mechanic.salary ?? 0,
      employment_type: mechanic.employment_type ?? "FULL_TIME",
      is_Active: mechanic.is_Active ?? true,
      specialization: mechanic.specialization ?? "",
      position: mechanic.position ?? "",
      hired_at: new Date(mechanic.hired_at) ?? new Date(),
      terminated_at: new Date(mechanic.terminated_at) ?? null,
    });
    setSelectedMechanic(null);
    setSelectedUserId(null);
    setShowAddMechanic(true);
  }
  function resetForm() {
    setNewMechanic({
      salary: 0,
      employment_type: "FULL_TIME",
      is_Active: true,
      specialization: "",
      position: "",
      hired_at: new Date(),
      terminated_at: null,
    });
    setSelectedUserId(null);
    setEditingMechanicId(null);
  }
  function openAddModal() {
    resetForm();
    setSelectedMechanic(null);
    setShowAddMechanic(true);
  }
  async function terminateMechanic(mechanic: Mechanic) {
    if (!confirm(`Terminate mechanic ${mechanic.firstName}?`)) return;

    try {
      const res = await fetch("/api/mechanics/terminate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: mechanic.id,
          terminated_at: new Date(),
        }),
      });

      if (!res.ok) {
        alert("Failed to terminate mechanic");
        return;
      }

      const updated = await res.json();

      // Update UI
      setMechanics((prev) =>
        prev.map((m) => (m.id === mechanic.id ? updated : m))
      );
    } catch (err) {
      console.error(err);
      alert("Server error terminating mechanic");
    }
  }

  async function handleSaveCustomer(e: FormEvent) {
    e.preventDefault();
    if (!editingMechanicId && !selectedUserId) {
      alert("Please select a user for this mechanic");
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingMechanicId !== null) {
        const res = await fetch("/api/mechanics", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMechanicId,
            ...newMechanic,
          }),
        });
        if (res.ok) {
          const updatedMechanic: Mechanic = await res.json();
          setMechanics((prev) =>
            prev.map((m) => (m.id === editingMechanicId ? updatedMechanic : m))
          );
        } else {
          console.error("Failed to update customer:");
          alert(`Failed to update customer`);
        }
      } else {
        // === ADD MODE ===
        const res = await fetch("/api/mechanics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: selectedUserId,
            ...newMechanic,
          }),
        });

        const created: Mechanic = await res.json();
        if (res.ok) {
          setMechanics((prev) => [...prev, created]);
        } else {
          console.error("Failed to create customer:", created);
        }
      }
      setShowAddMechanic(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }
  function handleViewOrders(mechanic: Mechanic) {
    alert(
      `Here this mechanicsorders for ${mechanic.firstName} (id: ${mechanic.id})`
    );
  }
  const totalRevenue = mechanics.reduce(
    (sum, m) => sum + (m.totalRevenue || 0),
    0
  );
  const totalCompletedOrders = mechanics.reduce(
    (sum, m) => sum + (m.totalOrders?.COMPLETED || 0),
    0
  );
  const totalInProgressOrders = mechanics.reduce(
    (sum, m) => sum + (m.totalOrders?.IN_PROGRESS || 0),
    0
  );
  const activeMechanicsCount = mechanics.filter((m) => m.is_Active).length;

  return (
    <div className="customers-view">
      <div className="customers-header">
        <div className="customers-header-text">
          <h1 className="customers-title">Mechanics Management</h1>
          <p className="customers-subtitle">
            Manage and track mechanics information
          </p>
        </div>
        <Button onClick={openAddModal} className="add-customer-btn-override">
          <Plus className="icon-sm" />
          <span>Add Mechanic</span>
        </Button>
      </div>

      <div className="customers-stats-grid">
        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <Car className="icon-md" />
            </div>
            <div>
              <p className="stats-value">{mechanics.length}</p>
              <p className="stats-label">Total Mechanics</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <DollarSign className="icon-md" />
            </div>
            <div>
              <p className="stats-value">${totalRevenue.toFixed(2)}</p>
              <p className="stats-label">Total Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <Check className="icon-md" />
            </div>
            <div>
              <p className="stats-value">{totalCompletedOrders}</p>
              <p className="stats-label">Completed Orders</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <Clock className="icon-md" />
            </div>
            <div>
              <p className="stats-value">{totalInProgressOrders}</p>
              <p className="stats-label">In Progress Orders</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="search-card">
        <div className="search-card-inner">
          <div className="search-wrapper">
            <Search className="search-icon"></Search>
            <Input
              type="text"
              placeholder="Search by name,email or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            ></Input>
          </div>
          <div className="filters-wrapper">
            <select
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Employment Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="INTERN">Intern</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="customers-list-card">
        <div className="customers-list-inner">
          <div className="customers-list">
            {filteredMechanics?.map((mechanic) => (
              <div
                key={mechanic.id}
                className={`mechanic-column ${
                  mechanic.is_Active ? "" : "mechanic-column--disabled"
                }`}
                onClick={() => {
                  if (mechanic.is_Active) {
                    setSelectedMechanic(mechanic.id);
                  }
                }}
              >
                <div className="mechanic-row">
                  <div className="customer-avatar">
                    <span className="customer-avatar-letter">
                      {mechanic.firstName?.charAt(0)}
                    </span>
                  </div>
                  <div className="customer-main">
                    <div className="customer-main-header">
                      <h3 className="customer-name">
                        {" "}
                        {`${mechanic?.firstName} ${mechanic.lastName}`}
                      </h3>
                      <div className="customer-meta">
                        <span className="customer-meta-item">
                          <Phone className="icon-xs" />
                          {mechanic.phone}
                        </span>
                      </div>
                    </div>
                    <div className="customer-meta">
                      <span className="customer-meta-item">
                        <Car className="icon-xs" />
                        {mechanic.position}
                      </span>
                    </div>
                  </div>
                  <div className="customer-actions">
                    <button
                      className="icon-btn icon-btn--edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(mechanic);
                      }}
                    >
                      <Edit className="icon-sm" />
                    </button>
                  </div>
                  <div className="customer-actions terminate-actions">
                    <button
                      className={`icon-btn icon-btn--edit ${
                        mechanic.is_Active ? "" : "icon-btn--disabled"
                      }`}
                      disabled={!mechanic.is_Active}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (mechanic.is_Active) {
                          terminateMechanic(mechanic);
                        }
                      }}
                    >
                      {mechanic.is_Active ? "Terminate" : "Terminated"}
                    </button>
                  </div>
                </div>
                {mechanic.is_Active && (
                  <div className="mechanic-main">
                    <div className="mechanic-info_1">
                      <span className="mechanic-meta-item">
                        <span>{mechanic.totalOrders?.COMPLETED || 0}</span>
                        <div>Completed</div>
                      </span>
                    </div>

                    <div className="mechanic-info_2">
                      <span className="mechanic-meta-item">
                        <span>{mechanic.totalOrders?.IN_PROGRESS || 0}</span>
                        <div>In Progress</div>
                      </span>
                    </div>

                    <div className="mechanic-info_3">
                      <span className="mechanic-meta-item">
                        <span>${mechanic.totalRevenue || 0}</span>
                        <div>Revenue</div>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog
        open={showAddMechanic}
        onOpenChange={(open) => {
          setShowAddMechanic(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              {editingMechanicId ? "Edit Mechanic" : "Add New Mechanic"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="dialog-body dialog-body--form"
            onSubmit={handleSaveCustomer}
          >
            <div className="dialog-form-grid">
              {!editingMechanicId && (
                <div className="dialog-form-field dialog-field--full">
                  <label className="dialog-field-label">
                    Select Existing User
                  </label>
                  <select
                    className="dialog-input"
                    value={selectedUserId ?? ""}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  >
                    <option value="">-- Select a user --</option>
                    {existingUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.first_name} {u.last_name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Salary</label>
                <Input
                  placeholder="12500"
                  className="dialog-input"
                  value={newMechanic.salary}
                  onChange={(e) =>
                    setNewMechanic((prev) => ({
                      ...prev,
                      salary: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Employment type </label>
                <select
                  className="dialog-input"
                  value={newMechanic.employment_type}
                  onChange={(e) =>
                    setNewMechanic((prev) => ({
                      ...prev,
                      employment_type: e.target.value as EmploymentType,
                    }))
                  }
                >
                  <option value="">-- Select an employment type --</option>
                  {existingEmpoymentTypes.map((u, index) => (
                    <option key={index} value={u.toUpperCase()}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Is active?</label>
                <Input
                  type="checkbox"
                  className="dialog-input"
                  checked={newMechanic.is_Active ?? false}
                  onChange={(e) =>
                    setNewMechanic((prev) => ({
                      ...prev,
                      is_Active: e.target.checked,
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Specialization</label>
                <Input
                  placeholder="Engine and Transmission"
                  className="dialog-input"
                  value={newMechanic.specialization}
                  onChange={(e) =>
                    setNewMechanic((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Position</label>
                <Input
                  placeholder="Senior Mechanic"
                  className="dialog-input"
                  value={newMechanic.position}
                  onChange={(e) =>
                    setNewMechanic((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Hired at</label>
                <Input
                  type="date"
                  className="dialog-input"
                  value={
                    newMechanic.hired_at
                      ? newMechanic.hired_at.toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setNewMechanic((prev) => ({
                      ...prev,
                      hired_at: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>
            </div>

            <div className="dialog-actions">
              <Button
                type="submit"
                className="dialog-btn dialog-btn--primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingMechanicId
                  ? "Save Changes"
                  : "Add Mechanic"}
              </Button>

              <Button
                type="button"
                className="dialog-btn dialog-btn--secondary"
                onClick={() => {
                  setShowAddMechanic(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedMechanic !== null}
        onOpenChange={() => setSelectedMechanic(null)}
      >
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">Customer Details</DialogTitle>
          </DialogHeader>

          {selectedMechanicData && (
            <div className="dialog-body">
              <div className="dialog-header-block">
                <div className="dialog-avatar">
                  {selectedMechanicData.firstName.charAt(0)}
                </div>
                <div className="dialog-header-text">
                  <div className="dialog-name-row">
                    <h2 className="dialog-name">{`${selectedMechanicData.firstName} ${selectedMechanicData.lastName}`}</h2>
                  </div>
                  <p className="dialog-member-since">
                    Working since{" "}
                    {selectedMechanicData.hired_at
                      ? new Date(
                          selectedMechanicData.hired_at
                        ).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>

              <div className="dialog-grid">
                <div className="dialog-field">
                  <p className="dialog-field-label">Email</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.email}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">Phone</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.phone}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">Salary</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.salary}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">Employment Type</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.employment_type}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">Active?</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.is_Active}
                  </p>
                </div>
                <div className="dialog-field">
                  <p className="dialog-field-label">Specialization</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.specialization}
                  </p>
                </div>
                <div className="dialog-field">
                  <p className="dialog-field-label">Position</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.position}
                  </p>
                </div>
                <div className="dialog-field">
                  <p className="dialog-field-label">Working on branch</p>
                  <p className="dialog-field-value">
                    {selectedMechanicData.branchName}
                  </p>
                </div>
              </div>

              <div className="dialog-divider" />
              <div className="dialog-stats-grid">
                <div className="dialog-stat-card">
                  <p className="dialog-stat-value">
                    {selectedMechanicData.totalOrders
                      ? Object.values(selectedMechanicData.totalOrders).reduce(
                          (sum, count) => sum + count,
                          0
                        )
                      : 0}
                  </p>
                  <p className="dialog-stat-label">Total Orders</p>
                </div>

                <div className="dialog-stat-card">
                  <p className="dialog-stat-value">
                    {selectedMechanicData.totalOrders?.PENDING ?? 0}
                  </p>
                  <p className="dialog-stat-label">Pending</p>
                </div>

                <div className="dialog-stat-card">
                  <p className="dialog-stat-value">
                    {selectedMechanicData.totalOrders?.IN_PROGRESS ?? 0}
                  </p>
                  <p className="dialog-stat-label">In Progress</p>
                </div>

                <div className="dialog-stat-card">
                  <p className="dialog-stat-value">
                    ${selectedMechanicData.totalRevenue?.toFixed(2) ?? 0}
                  </p>
                  <p className="dialog-stat-label">Total Revenue</p>
                </div>
              </div>

              <div className="dialog-actions">
                <Button
                  className="dialog-btn dialog-btn--primary"
                  onClick={() => openEditModal(selectedMechanicData)}
                >
                  Edit Customer
                </Button>
                <Button
                  className="dialog-btn dialog-btn--secondary"
                  onClick={() => handleViewOrders(selectedMechanicData)}
                >
                  View Orders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MechanicsView;
