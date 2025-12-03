"use client";

import { useEffect, useState } from "react";
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
type CustomerOrder = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
};

export function OrdersView({
  session,
  dataServiceOrders,
}: {
  session: any;
  dataServiceOrders: ServiceOrders[];
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [orders, setOrders] = useState<ServiceOrders[]>([
    {
      id: "1",
      orderNumber: "SO-1001",
      carBrand: "Porsche",
      carModel: "911 Carrera",
      carYear: "2023",
      description: "Engine repair and oil change",
      status: "IN_PROGRESS",
      startDate: "2025-11-01T09:00:00Z",
      endDate: "2025-11-03T17:00:00Z",
      total_cost: 850,
      created_at: new Date("2025-11-01T08:30:00Z").toISOString(),
      updated_at: new Date("2025-11-01T12:00:00Z").toISOString(),
      progress: 99,
      mechanicFirstName: "Mike",
      mechanicLastName: "Johnson",
    },
    {
      id: "2",
      orderNumber: "SO-1002",
      carBrand: "BMW",
      carModel: "M4 Competition",
      carYear: "2022",
      description: "Brake system replacement",
      status: "COMPLETED",
      startDate: "2025-10-24T10:00:00Z",
      endDate: "2025-10-22T16:00:00Z",
      total_cost: 1200,
      created_at: new Date("2025-10-20T09:45:00Z").toISOString(),
      updated_at: new Date("2025-10-22T16:00:00Z").toISOString(),
      progress: 100,
      mechanicFirstName: "Sarah",
      mechanicLastName: "Williams",
    },
    {
      id: "3",
      orderNumber: "SO-1003",
      carBrand: "Audi",
      carModel: "RS7",
      carYear: "2024",
      description: "Transmission service",
      status: "WAITING_FOR_PARTS",
      startDate: "2025-11-02T08:00:00Z",
      endDate: "2025-11-10T17:00:00Z",
      total_cost: 1500,
      created_at: new Date("2025-11-02T07:30:00Z").toISOString(),
      updated_at: new Date("2025-11-03T10:00:00Z").toISOString(),
      progress: 40,
      mechanicFirstName: "John",
      mechanicLastName: "Doe",
    },
    {
      id: "4",
      orderNumber: "SO-1004",
      carBrand: "Tesla",
      carModel: "Model S Plaid",
      carYear: "2023",
      description: "Battery replacement",
      status: "NEW",
      startDate: "2025-12-01T09:00:00Z",
      endDate: "2025-12-05T17:00:00Z",
      total_cost: 2000,
      created_at: new Date("2025-12-01T08:00:00Z").toISOString(),
      updated_at: new Date("2025-12-01T08:00:00Z").toISOString(),
      progress: 0,
      mechanicFirstName: "Alice",
      mechanicLastName: "Smith",
    },
    {
      id: "5",
      orderNumber: "SO-1001",
      carBrand: "Porsche",
      carModel: "911 Carrera",
      carYear: "2023",
      description: "Engine repair and oil change",
      status: "READY",
      startDate: "2025-11-01T09:00:00Z",
      endDate: "2025-11-03T17:00:00Z",
      total_cost: 850,
      created_at: new Date("2025-11-01T08:30:00Z").toISOString(),
      updated_at: new Date("2025-11-01T12:00:00Z").toISOString(),
      progress: 65,
      mechanicFirstName: "Mike",
      mechanicLastName: "Johnson",
    },
    {
      id: "6",
      orderNumber: "SO-1001",
      carBrand: "Porsche",
      carModel: "911 Carrera",
      carYear: "2023",
      description: "Engine repair and oil change",
      status: "CANCELLED",
      startDate: "2025-11-01T09:00:00Z",
      endDate: "2025-11-03T17:00:00Z",
      total_cost: 850,
      created_at: new Date("2025-11-01T08:30:00Z").toISOString(),
      updated_at: new Date("2025-11-01T12:00:00Z").toISOString(),
      progress: 65,
      mechanicFirstName: "Mike",
      mechanicLastName: "Johnson",
    },
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);

  const [customers, setCustomers] = useState<CustomerOrder[]>([]);
  useEffect(() => {
    fetch("/api/customers?minimal=true")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch(console.error);
  }, []);
  const [newOrder, setNewOrder] = useState<Partial<ServiceOrders>>({
    orderNumber: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    description: "",
    status: "NEW",
    startDate: "",
    endDate: undefined,
    total_cost: 0,
    progress: 0,
  });

  const handleCreateOrder = (newOrder: ServiceOrders) => {
    setOrders([newOrder, ...orders]);
    setShowCreateModal(false);
  };

  const handleSelectOrder = (orderId: string) => {
    // Detect current role from URL
    const segments = window.location.pathname.split("/").filter(Boolean);
    const roleSegment = segments[0] || "client"; // fallback
    window.location.href = `/${roleSegment}/orders/${orderId}`;
  };

  function resetForm() {
    setNewOrder({
      orderNumber: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      description: "",
      status: "NEW",
      startDate: "",
      endDate: undefined,
      total_cost: 0,
      progress: 0,
    });
    setSelectedCustomerId(null);
  }

  function openAddModal() {
    resetForm();
    setShowCreateModal(true);
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
                      {order.description.length > 35
                        ? order.description.slice(0, 35) + "..."
                        : order.description}
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
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onCreateOrder={handleCreateOrder}
        />
      )}
    </div>
  );
}
