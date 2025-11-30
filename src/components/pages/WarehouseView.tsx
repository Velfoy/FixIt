"use client";
import React, { FormEvent, useState } from "react";
import type { Part } from "@/types/part";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "../ui/dialog";
import { Plus } from "lucide-react";
import { Card } from "../ui/card";
import { Search } from "lucide-react";
import "@/styles/users.css";
const WarehouseView = ({
  session,
  dataWarehouse,
}: {
  session: any;
  dataWarehouse: Part[];
}) => {
  const [parts, setParts] = useState<Part[]>(dataWarehouse);
  const [newPart, setNewPart] = useState<{
    name: string;
    part_number: string;
    quantity: number;
    min_quantity: number;
    price: number;
    supplier: string;
  }>({
    name: "",
    part_number: "",
    quantity: 0,
    min_quantity: 1,
    price: 0,
    supplier: "",
  });
  const [showAddPart, setShowAddPart] = useState(false);
  const [searchQuery, setSeacrhQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [editingPartId, setEditingPartId] = useState<number | null>(null);
  const filteredParts =
    parts?.filter((part) => {
      const name = part.name || "";
      const part_number = part.part_number || " ";
      const supplier = part.supplier || " ";
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }) || [];
  function openAddModal() {
    resetForm();
    setSelectedPart(null);
    setShowAddPart(true);
  }
  function resetForm() {
    setNewPart({
      name: "",
      part_number: "",
      quantity: 0,
      min_quantity: 0,
      price: 0,
      supplier: "",
    });
    setEditingPartId(null);
  }
  async function handleSaveCustomer(e: FormEvent) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingPartId !== null) {
        const res = await fetch("/api/warehouse", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPartId,
            ...newPart,
          }),
        });
        if (res.ok) {
          const updatedMechanic: Part = await res.json();
          setParts((prev) =>
            prev.map((m) => (m.id === editingPartId ? updatedMechanic : m))
          );
        } else {
          console.error("Failed to update customer:");
          alert(`Failed to update customer`);
        }
      } else {
        // === ADD MODE ===
        const res = await fetch("/api/warehouse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newPart,
          }),
        });

        const created: Part = await res.json();
        if (res.ok) {
          setParts((prev) => [...prev, created]);
        } else {
          console.error("Failed to create customer:", created);
        }
      }
      setShowAddPart(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="customers-view">
      <div className="customers-header">
        <div className="customers-header-text">
          <h1 className="customers-title">Warehouse Management</h1>
          <p className="customers-subtitle">Manage and track parts</p>
        </div>
        <Button onClick={openAddModal} className="add-customer-btn-override">
          <Plus className="icon-sm" />
          <span>Add Part</span>
        </Button>
      </div>

      <Card className="search-card">
        <div className="search-card-inner">
          <div className="search-wrapper">
            <Search className="search-icon"></Search>
            <Input
              type="text"
              placeholder="Search by name,part number or supplier name"
              value={searchQuery}
              onChange={(e) => setSeacrhQuery(e.target.value)}
              className="search-input"
            ></Input>
          </div>
        </div>
      </Card>

      <Dialog
        open={showAddPart}
        onOpenChange={(open) => {
          setShowAddPart(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              {editingPartId ? "Edit Part" : "Add New Part"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="dialog-body dialog-body--form"
            onSubmit={handleSaveCustomer}
          >
            <div className="dialog-form-grid">
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Part name</label>
                <Input
                  placeholder="Brake Pads Set"
                  className="dialog-input"
                  value={newPart.name}
                  onChange={(e) =>
                    setNewPart((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Part number</label>
                <Input
                  placeholder="BP-117A"
                  className="dialog-input"
                  value={newPart.part_number}
                  onChange={(e) =>
                    setNewPart((prev) => ({
                      ...prev,
                      part_number: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Quantity</label>
                <Input
                  placeholder="25"
                  className="dialog-input"
                  value={newPart.quantity === 0 ? "" : newPart.quantity}
                  onChange={(e) =>
                    setNewPart((prev) => ({
                      ...prev,
                      quantity:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Low stock quantity</label>
                <Input
                  placeholder="5"
                  className="dialog-input"
                  value={newPart.min_quantity}
                  onChange={(e) =>
                    setNewPart((prev) => ({
                      ...prev,
                      min_quantity: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="149.99"
                  className="dialog-input"
                  value={newPart.price === 0 ? "" : newPart.price}
                  onChange={(e) =>
                    setNewPart((prev) => ({
                      ...prev,
                      price: e.target.value === "" ? 0 : Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Supplier</label>
                <Input
                  placeholder="Bosch Automotive"
                  className="dialog-input"
                  value={newPart.supplier}
                  onChange={(e) =>
                    setNewPart((prev) => ({
                      ...prev,
                      supplier: e.target.value,
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
                  : editingPartId
                  ? "Save Changes"
                  : "Add Part"}
              </Button>

              <Button
                type="button"
                className="dialog-btn dialog-btn--secondary"
                onClick={() => {
                  setShowAddPart(false);
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
};

export default WarehouseView;
