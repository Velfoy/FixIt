"use client";

import { useState, useEffect, FormEvent } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Car,
  DollarSign,
  Calendar,
  Edit,
} from "lucide-react";

import "../../styles/users.css";
import type { Customer } from "@/types/customer";

const formatMoney = (value: number) =>
  value?.toLocaleString("en-US", { minimumFractionDigits: 0 });

export default function CustomersView({
  session,
  dataCustomers,
}: {
  session: any;
  dataCustomers: Customer[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(dataCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(
    null
  );

  const [existingUsers, setExistingUsers] = useState<
    {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
    }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [newCustomer, setNewCustomer] = useState<{
    address: string;
    city: string;
    postal_code?: string;
    nip: string;
  }>({
    address: "",
    city: "",
    postal_code: "",
    nip: "",
  });

  // Fetch all existing users with role CLIENT
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const clients = data.filter(
          (u: any) => !customers.some((c) => c.email === u.email)
        );
        setExistingUsers(clients);
      })
      .catch(console.error);
  }, []);

  // In the filteredCustomers calculation, add safe access:
  const filteredCustomers =
    customers?.filter((customer) => {
      const name = customer.name || "";
      const email = customer.email || "";
      const phone = customer.phone || "";

      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.includes(searchQuery)
      );
    }) || [];

  const selectedCustomerData = customers?.find(
    (c) => c.id === selectedCustomer
  );

  function resetForm() {
    setNewCustomer({
      address: "",
      city: "",
      postal_code: "",
      nip: "",
    });
    setSelectedUserId(null);
    setEditingCustomerId(null);
  }

  function openAddModal() {
    resetForm();
    setSelectedCustomer(null);
    setShowAddCustomer(true);
  }

  function openEditModal(customer: Customer) {
    setEditingCustomerId(customer.id);
    setNewCustomer({
      address: customer.address,
      city: customer.city ?? "",
      postal_code: customer.postal_code,
      nip: customer.nip ?? "",
    });
    setSelectedCustomer(null);
    setSelectedUserId(null);
    setShowAddCustomer(true);
  }

  async function handleSaveCustomer(e: FormEvent) {
    e.preventDefault();

    if (!editingCustomerId && !selectedUserId) {
      alert("Please select a user for this customer");
      return;
    }

    try {
      setIsSubmitting(true);

      // === EDIT MODE ===
      if (editingCustomerId !== null) {
        const res = await fetch("/api/customers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCustomerId,
            ...newCustomer,
          }),
        });

        if (res.ok) {
          const updatedCustomer: Customer = await res.json();
          setCustomers((prev) =>
            prev.map((c) => (c.id === editingCustomerId ? updatedCustomer : c))
          );
        } else {
          const error = await res.json();
          console.error("Failed to update customer:", error);
          alert(`Failed to update customer: ${error.error}`);
        }
      } else {
        // === ADD MODE ===
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: selectedUserId,
            ...newCustomer,
          }),
        });

        const created: Customer = await res.json();
        if (res.ok) {
          setCustomers((prev) => [...prev, created]);
        } else {
          console.error("Failed to create customer:", created);
        }
      }

      setShowAddCustomer(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleViewOrders(customer: Customer) {
    alert(
      `Here you could show orders for ${customer.name} (id: ${customer.id})`
    );
  }

  return (
    <div className="customers-view">
      {/* Header */}
      <div className="customers-header">
        <div className="customers-header-text">
          <h1 className="customers-title">Customer Management</h1>
          <p className="customers-subtitle">
            Manage and track customer information
          </p>
        </div>
        <Button onClick={openAddModal} className="add-customer-btn-override">
          <Plus className="icon-sm" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="customers-stats-grid">
        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <Car className="icon-md" />
            </div>
            <div>
              <p className="stats-value">{customers?.length || 0}</p>
              <p className="stats-label">Total Customers</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <DollarSign className="icon-md" />
            </div>
            <div>
              <p className="stats-value">
                {formatMoney(
                  customers?.reduce((s, c) => s + (c.totalSpent || 0), 0) || 0
                )}
              </p>
              <p className="stats-label">Total Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <Car className="icon-md" />
            </div>
            <div>
              <p className="stats-value">
                {customers?.reduce((s, c) => s + (c.cars?.length || 0), 0) || 0}
              </p>
              <p className="stats-label">Total Vehicles</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <Calendar className="icon-md" />
            </div>
            <div>
              <p className="stats-value">
                {customers?.reduce((s, c) => s + (c.totalOrders || 0), 0) || 0}
              </p>
              <p className="stats-label">Total Orders</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="search-card">
        <div className="search-card-inner">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </Card>

      <Card className="customers-list-card">
        <div className="customers-list-inner">
          <div className="customers-list">
            {filteredCustomers?.map((customer) => (
              <div
                key={customer.id}
                className="customer-row"
                onClick={() => setSelectedCustomer(customer.id)}
              >
                <div className="customer-avatar">
                  <span className="customer-avatar-letter">
                    {customer.name.charAt(0)}
                  </span>
                </div>

                <div className="customer-main">
                  <div className="customer-main-header">
                    <h3 className="customer-name">{customer.name}</h3>
                  </div>

                  <div className="customer-meta">
                    <span className="customer-meta-item">
                      <Mail className="icon-xs" />
                      {customer.email}
                    </span>
                    <span className="customer-meta-item">
                      <Phone className="icon-xs" />
                      {customer.phone}
                    </span>
                    <span className="customer-meta-item">
                      <Car className="icon-xs" />
                      {customer.cars.length} vehicle(s)
                    </span>
                  </div>
                </div>

                <div className="customer-total">
                  <p className="customer-total-amount">
                    ${formatMoney(customer.totalSpent)}
                  </p>
                  <p className="customer-total-orders">
                    {customer.totalOrders} orders
                  </p>
                </div>

                <div className="customer-actions">
                  <button
                    className="icon-btn icon-btn--edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(customer);
                    }}
                  >
                    <Edit className="icon-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog
        open={selectedCustomer !== null}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">Customer Details</DialogTitle>
          </DialogHeader>

          {selectedCustomerData && (
            <div className="dialog-body">
              <div className="dialog-header-block">
                <div className="dialog-avatar">
                  {selectedCustomerData.name.charAt(0)}
                </div>
                <div className="dialog-header-text">
                  <div className="dialog-name-row">
                    <h2 className="dialog-name">{selectedCustomerData.name}</h2>
                  </div>
                  <p className="dialog-member-since">
                    Member since {selectedCustomerData.memberSince}
                  </p>
                </div>
              </div>

              <div className="dialog-grid">
                <div className="dialog-field">
                  <p className="dialog-field-label">Email</p>
                  <p className="dialog-field-value">
                    {selectedCustomerData.email}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">Phone</p>
                  <p className="dialog-field-value">
                    {selectedCustomerData.phone}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">Address</p>
                  <p className="dialog-field-value">
                    {selectedCustomerData.address}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">City</p>
                  <p className="dialog-field-value">
                    {selectedCustomerData.city}
                  </p>
                </div>

                <div className="dialog-field">
                  <p className="dialog-field-label">NIP</p>
                  <p className="dialog-field-value">
                    {selectedCustomerData.nip}
                  </p>
                </div>
                <div className="dialog-field">
                  <p className="dialog-field-label">Postal Code</p>
                  <p className="dialog-field-value">
                    {selectedCustomerData.postal_code}
                  </p>
                </div>
              </div>

              <div className="dialog-divider" />

              <div className="dialog-vehicles">
                <h3 className="dialog-section-title">Vehicles</h3>
                <div className="dialog-vehicles-list">
                  {selectedCustomerData.cars.map((car, idx) => (
                    <div key={idx} className="dialog-vehicle-row">
                      <div className="dialog-vehicle-icon">
                        <Car className="icon-md" />
                      </div>
                      <div className="dialog-vehicle-text">
                        <p className="dialog-vehicle-model">{car.model}</p>
                        <p className="dialog-vehicle-meta">
                          {car.year} • {car.plate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dialog-divider" />

              <div className="dialog-stats-grid">
                <div className="dialog-stat-card">
                  <p className="dialog-stat-value">
                    {selectedCustomerData.totalOrders}
                  </p>
                  <p className="dialog-stat-label">Total Orders</p>
                </div>

                <div className="dialog-stat-card">
                  <p className="dialog-stat-value">
                    ${formatMoney(selectedCustomerData.totalSpent)}
                  </p>
                  <p className="dialog-stat-label">Total Spent</p>
                </div>

                <div className="dialog-stat-card">
                  <p className="dialog-stat-value">
                    {selectedCustomerData.lastVisit}
                  </p>
                  <p className="dialog-stat-label">Last Visit</p>
                </div>
              </div>

              <div className="dialog-actions">
                <Button
                  className="dialog-btn dialog-btn--primary"
                  onClick={() => openEditModal(selectedCustomerData)}
                >
                  Edit Customer
                </Button>
                <Button
                  className="dialog-btn dialog-btn--secondary"
                  onClick={() => handleViewOrders(selectedCustomerData)}
                >
                  View Orders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAddCustomer}
        onOpenChange={(open) => {
          setShowAddCustomer(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              {editingCustomerId ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="dialog-body dialog-body--form"
            onSubmit={handleSaveCustomer}
          >
            <div className="dialog-form-grid">
              {!editingCustomerId && (
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
                <label className="dialog-field-label">Address</label>
                <Input
                  placeholder="123 Main St"
                  className="dialog-input"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">City</label>
                <Input
                  placeholder="City"
                  className="dialog-input"
                  value={newCustomer.city}
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Postal code</label>
                <Input
                  placeholder="123-456-78-90"
                  className="dialog-input"
                  value={newCustomer.postal_code}
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      postal_code: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">NIP</label>
                <Input
                  placeholder="123-456-78-90"
                  className="dialog-input"
                  value={newCustomer.nip}
                  onChange={(e) =>
                    setNewCustomer((prev) => ({ ...prev, nip: e.target.value }))
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
                  : editingCustomerId
                  ? "Save Changes"
                  : "Add Customer"}
              </Button>

              <Button
                type="button"
                className="dialog-btn dialog-btn--secondary"
                onClick={() => {
                  setShowAddCustomer(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
