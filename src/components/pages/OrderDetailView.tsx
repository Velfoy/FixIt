"use client";

import {
  Order,
  ServiceOrders,
  StatusServiceOrder,
} from "@/types/serviceorders";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  ArrowBigLeft,
  ArrowLeft,
  Calendar,
  CarIcon,
  Clock,
  DollarSign,
  Edit,
  Mail,
  Phone,
  Plus,
  User,
} from "lucide-react";
import "@/styles/users.css";
import "@/styles/orders.css";
import { Card } from "../ui/card";

interface OrderDetailViewProps {
  dataServiceOrder?: Order | null;
  session?: number;
}

export function OrderDetailView({
  dataServiceOrder,
  session,
}: OrderDetailViewProps) {
  const router = useRouter();
  const [serviceOrder, setServiceOrder] = useState<Order | null>(
    dataServiceOrder ?? null
  );
  async function handleEdit() {}
  const handleBack = () => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const roleSegment = segments[0] || "client";
    router.push(`/${roleSegment}/orders`);
  };

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
      <div
        className="customers-header"
        style={{ marginTop: "4px", marginBottom: "12px" }}
      >
        <Button onClick={handleBack} className="add-customer-btn-override">
          <ArrowLeft className="icon-sm" />
          <span>Back to Orders</span>
        </Button>
        <div className="left_order">
          <span
            className={STATUS_MAP[serviceOrder?.status || "NEW"].className}
            style={{ fontSize: "14px", marginRight: "10px" }}
          >
            {STATUS_MAP[serviceOrder?.status || "NEW"].label}
          </span>
          <button onClick={handleEdit} className="edit-button_order">
            <Edit className="icon-xxx" />
            <span>Edit Order</span>
          </button>
        </div>
      </div>
      <div className="customers-header">
        <div className="customers-header-text">
          <h1 className="customers-title">Order #{serviceOrder?.id}</h1>
          <p className="customers-subtitle">
            {serviceOrder?.carBrand} {serviceOrder?.carModel} (
            {serviceOrder?.carYear}) {serviceOrder?.orderNumber}
          </p>
        </div>
        <div className="customers-header-text">
          <p
            className="customers-subtitle"
            style={{ color: "white", margin: "0px" }}
          >
            License plate
          </p>
          <p className="customers-subtitle" style={{ textAlign: "end" }}>
            {serviceOrder?.carLicensePlate}
          </p>
        </div>
      </div>
      <div className="parts-stats-grid ">
        <Card className="stats-card order-card_id">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <Clock className="icon-md" />
            </div>
            <div>
              <p className="stats-label_order">Estimated Completion</p>
              <p className="stats-value_order">
                {" "}
                {serviceOrder?.endDate
                  ? new Date(serviceOrder.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>
        </Card>
        <Card className="stats-card order-card_id">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <DollarSign className="icon-md" />
            </div>
            <div>
              <p className="stats-label_order">Total Cost</p>
              <p className="stats-value_order">
                {" "}
                $ {serviceOrder?.total_cost || 0}
              </p>
            </div>
          </div>
        </Card>
        <Card className="stats-card order-card_id">
          <div className="stats-card-inner">
            <div className="stats-icon">
              <User className="icon-md" />
            </div>
            <div>
              <p className="stats-label_order">Mechanic</p>
              <p className="stats-value_order">
                {" "}
                {serviceOrder?.mechanicFirstName}{" "}
                {serviceOrder?.mechanicLastName}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="order-stats-grid ">
        <Card className="stats-card order-card_id_2">
          <div className="stats-card-inner">
            <div>
              <p className=" stats-value_order order_desc">Issue Description</p>
              <p className="stats-label_order"> {serviceOrder?.description}</p>
            </div>
          </div>
        </Card>
        <Card className="stats-card order-card_id_2">
          <div className="stats-card-inner">
            <div>
              <p className=" stats-value_order order_desc">Mechanic Contact</p>
              <p className="stats-label_order mech_phone">
                {" "}
                <Phone className="icon-mech"></Phone>
                {serviceOrder?.mechanicPhone}
              </p>
              <p className="stats-label_order">
                {" "}
                <Mail className="icon-mech"></Mail>
                {serviceOrder?.mechanicEmail}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
