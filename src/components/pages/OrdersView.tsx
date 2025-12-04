"use client";

import { FormEvent, useEffect, useState } from "react";
import { CreateOrderModal } from "./CreateOrderModal";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Plus,
} from "lucide-react";
import { ServiceOrders, StatusServiceOrder } from "@/types/serviceorders";
import "@/styles/users.css";
import "@/styles/orders.css";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type CustomerOrder = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
};

type Vehicle = {
  id: number;
  customer_id: number;
  brand: string;
  model: string;
  year: string;
  vin: string;
  license_plate: string;
};

type Mechanic = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  specialization?: string;
};

export function OrdersView({
  session,
  dataServiceOrders,
}: {
  session: any;
  dataServiceOrders: ServiceOrders[];
}) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [orders, setOrders] = useState<ServiceOrders[]>(dataServiceOrders);
  console.log(orders);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCustomers, setExistingCustomers] = useState<CustomerOrder[]>(
    []
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const filteredVehicles = selectedCustomerId
    ? vehicles.filter((vehicle) => vehicle.customer_id === selectedCustomerId)
    : [];

  useEffect(() => {
    fetch("/api/customers?minimal=true")
      .then((res) => res.json())
      .then((data) => {
        setExistingCustomers(data);
      })
      .catch(console.error);

    fetch("/api/cars?minimal=true")
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
      })
      .catch(console.error);

    fetch("/api/mechanics?minimal=true")
      .then((res) => res.json())
      .then((data) => {
        setMechanics(data);
      })
      .catch(console.error);
  }, []);

  const [newOrder, setNewOrder] = useState<Partial<ServiceOrders>>({
    orderNumber: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    description: "",
    issue: "",
    status: "NEW",
    startDate: "",
    endDate: "",
    total_cost: 0,
    progress: 0,
    priority: "MEDIUM",
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [selectedMechanicId, setSelectedMechanicId] = useState<number | null>(
    null
  );

  async function handleCreateOrder(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you would make the API call to create the order
    // For now, just simulate API call
    setTimeout(() => {
      console.log("Creating order with data:", {
        ...newOrder,
        customerId: selectedCustomerId,
        vehicleId: selectedVehicleId,
        mechanicId: selectedMechanicId,
      });

      const newOrderData: ServiceOrders = {
        id: orders.length + 1,
        orderNumber: `SO-${1000 + orders.length + 1}`,
        carBrand: newOrder.carBrand || "",
        carModel: newOrder.carModel || "",
        carYear: newOrder.carYear || "",
        description: newOrder.description || "",
        issue: newOrder.issue || "",
        status: newOrder.status as StatusServiceOrder,
        startDate: newOrder.startDate || new Date().toISOString(),
        endDate:
          newOrder.endDate ||
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        total_cost: newOrder.total_cost || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        progress: 0,
        priority:
          (newOrder.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT") ||
          "MEDIUM",
        mechanicFirstName:
          mechanics.find((m) => m.id === selectedMechanicId)?.first_name || "",
        mechanicLastName:
          mechanics.find((m) => m.id === selectedMechanicId)?.last_name || "",
      };

      setOrders([...orders, newOrderData]);
      setIsSubmitting(false);
      setShowAddOrder(false);
      resetForm();
    }, 1000);
  }

  const handleSelectOrder = (orderId: number) => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const roleSegment = segments[0] || session?.user?.role;
    window.location.href = `/${roleSegment}/orders/${orderId}`;
  };

  function resetForm() {
    setNewOrder({
      orderNumber: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      description: "",
      issue: "",
      status: "NEW",
      startDate: "",
      endDate: "",
      total_cost: 0,
      progress: 0,
      priority: "MEDIUM",
    });
    setSelectedCustomerId(null);
    setSelectedVehicleId(null);
    setSelectedMechanicId(null);
  }

  function openAddModal() {
    resetForm();
    setSelectedOrderId(null);
    setShowAddOrder(true);
  }

  const STATUS_MAP: Record<
    StatusServiceOrder,
    { label: string; className: string }
  > = {
    NEW: { label: "New order", className: "status-new" },
    IN_PROGRESS: { label: "In progress", className: "status-in-progress" },
    WAITING_FOR_PARTS: {
      label: "Waiting for parts",
      className: "status-waiting",
    },
    READY: { label: "Ready for pickup", className: "status-ready" },
    COMPLETED: { label: "Completed", className: "status-completed" },
    CANCELLED: { label: "Cancelled", className: "status-cancelled" },
  };

  const handleVehicleSelect = (vehicleId: number) => {
    setSelectedVehicleId(vehicleId);
    const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
    if (selectedVehicle) {
      setNewOrder((prev) => ({
        ...prev,
        carBrand: selectedVehicle.brand,
        carModel: selectedVehicle.model,
        carYear: selectedVehicle.year,
      }));
    }
  };

  const handleMechanicSelect = (mechanicId: number) => {
    setSelectedMechanicId(mechanicId);
  };

  const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
  ];

  return (
    <div className="customers-view">
      {/* Header */}
      <div className="customers-header">
        <div className="customers-header-text">
          <h1 className="customers-title">Order Management</h1>
          <p className="customers-subtitle">
            Manage and track order information
          </p>
        </div>
        <Button onClick={openAddModal} className="add-customer-btn-override">
          <Plus className="icon-sm" />
          <span>Create Order</span>
        </Button>
      </div>
      <Card className="customers-list-card">
        <div className="customers-list-inner">
          <div className="customers-list">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="customer-row paddingBottom"
                onClick={() => handleSelectOrder(order.id)}
              >
                <div
                  className="customer-avatar"
                  style={{ background: "#4d0000" }}
                >
                  <span className="customer-avatar-letter">
                    <Car className="icon-sm" />
                  </span>
                </div>

                <div className="customer-main">
                  <div className="customer-main-header order-header">
                    <h3 className="customer-name">
                      {order.carBrand} {order.carModel}
                    </h3>
                    <h2 className="order_car_year">{order.carYear} </h2>
                    <div className="customer-total order_chevron">
                      <p className="customer-total-orders">
                        <ChevronRight className="icon-xs"></ChevronRight>
                      </p>
                    </div>
                  </div>

                  <div className="customer-meta">
                    <span className="customer-meta-item">
                      Order #{order.id}
                    </span>
                    <span className="customer-meta-item">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="customer-meta">
                    <span
                      className="customer-meta-item"
                      style={{ marginTop: "5px" }}
                    >
                      {order.issue.length > 35
                        ? order.issue.slice(0, 35) + "..."
                        : order.issue}
                    </span>
                  </div>

                  <div className="customer-meta status-order">
                    <span className="customer-meta-item">
                      <Clock
                        className="icon-xs"
                        style={{ marginRight: "7px" }}
                      />

                      <span className={STATUS_MAP[order.status].className}>
                        {STATUS_MAP[order.status].label}
                      </span>
                    </span>
                    <span className="customer-meta-item">
                      Mechanic: {order.mechanicFirstName}{" "}
                      {order.mechanicLastName}
                    </span>
                    <span className="customer-meta-item">
                      Est:{" "}
                      {Math.ceil(
                        (new Date(order.endDate).getTime() -
                          new Date(order.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                    <span className="customer-meta-item mechanic-right">
                      Price: {order.total_cost}$
                    </span>
                  </div>
                  {order.status === "IN_PROGRESS" && (
                    <div
                      className="customer-meta"
                      style={{ marginTop: "10px" }}
                    >
                      <div className="progress-header">
                        <span className="customer-meta-item">Progress</span>
                        <span className="progress-value-top">
                          {order.progress}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog
        open={showAddOrder}
        onOpenChange={(open) => {
          setShowAddOrder(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              Create New Service Order
            </DialogTitle>
          </DialogHeader>

          <form
            className="dialog-body dialog-body--form"
            onSubmit={handleCreateOrder}
          >
            <div className="dialog-form-grid">
              {/* Customer Selection */}
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Customer *</label>
                <select
                  className="dialog-input"
                  value={selectedCustomerId ?? ""}
                  onChange={(e) => {
                    const customerId = Number(e.target.value);
                    setSelectedCustomerId(customerId);
                    setSelectedVehicleId(null); // Reset vehicle when customer changes
                    setNewOrder((prev) => ({
                      ...prev,
                      carBrand: "",
                      carModel: "",
                      carYear: "",
                    }));
                  }}
                  required
                >
                  <option value="">-- Select a customer --</option>
                  {existingCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name} (
                      {customer.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Selection (only shown when customer is selected) */}
              {selectedCustomerId && (
                <div className="dialog-form-field dialog-field--full">
                  <label className="dialog-field-label">Vehicle *</label>
                  <select
                    className="dialog-input"
                    value={selectedVehicleId ?? ""}
                    onChange={(e) =>
                      handleVehicleSelect(Number(e.target.value))
                    }
                    required
                  >
                    <option value="">-- Select a vehicle --</option>
                    {filteredVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} ({vehicle.year}) -{" "}
                        {vehicle.license_plate}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mechanic Selection */}
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Mechanic *</label>
                <select
                  className="dialog-input"
                  value={selectedMechanicId ?? ""}
                  onChange={(e) => handleMechanicSelect(Number(e.target.value))}
                  required
                >
                  <option value="">-- Select a mechanic --</option>
                  {mechanics.map((mechanic) => (
                    <option key={mechanic.id} value={mechanic.id}>
                      {mechanic.first_name} {mechanic.last_name}
                      {mechanic.specialization &&
                        ` - ${mechanic.specialization}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Description */}
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">
                  Issue Description *
                </label>
                <Input
                  placeholder="Describe the issue or service needed"
                  className="dialog-input"
                  value={newOrder.issue}
                  onChange={(e) =>
                    setNewOrder((prev) => ({ ...prev, issue: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Detailed Description */}
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">
                  Detailed Description
                </label>
                <textarea
                  placeholder="Additional details about the service"
                  className="dialog-input min-h-[100px]"
                  value={newOrder.description}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Estimated Cost */}
              <div className="dialog-form-field">
                <label className="dialog-field-label">
                  Estimated Cost ($) *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="dialog-input"
                  value={newOrder.total_cost || ""}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      total_cost: parseFloat(e.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>

              {/* Priority Selection */}
              <div className="dialog-form-field">
                <label className="dialog-field-label">Priority *</label>
                <select
                  className="dialog-input"
                  value={newOrder.priority}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      priority: e.target.value as
                        | "LOW"
                        | "MEDIUM"
                        | "HIGH"
                        | "URGENT",
                    }))
                  }
                  required
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="dialog-form-field">
                <label className="dialog-field-label">Start Date *</label>
                <Input
                  type="date"
                  className="dialog-input"
                  value={newOrder.startDate}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* End Date */}
              <div className="dialog-form-field">
                <label className="dialog-field-label">
                  Estimated Completion Date *
                </label>
                <Input
                  type="date"
                  className="dialog-input"
                  value={newOrder.endDate}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="dialog-actions">
              <Button
                type="submit"
                className="dialog-btn dialog-btn--primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Order..." : "Create Order"}
              </Button>

              <Button
                type="button"
                className="dialog-btn dialog-btn--secondary"
                onClick={() => {
                  setShowAddOrder(false);
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
