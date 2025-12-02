"use client";
import { useState } from "react";
import { X, Search, Calendar, DollarSign, User, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CreateOrderModalProps {
  onClose: () => void;
  onCreateOrder: (order: any) => void;
}

export function CreateOrderModal({
  onClose,
  onCreateOrder,
}: CreateOrderModalProps) {
  const [formData, setFormData] = useState({
    customerId: "",
    carId: "",
    issue: "",
    description: "",
    mechanicId: "",
    estimatedCost: "",
    estimatedDays: "",
    priority: "normal",
  });

  const customers = [
    { id: "1", name: "John Smith", phone: "+1 (555) 234-5678" },
    { id: "2", name: "Emma Johnson", phone: "+1 (555) 345-6789" },
  ];

  const cars = [
    {
      id: "1",
      model: "Porsche 911 Carrera",
      year: "2023",
      plate: "ABC 1234",
      customerId: "1",
    },
    {
      id: "2",
      model: "BMW M4 Competition",
      year: "2022",
      plate: "XYZ 5678",
      customerId: "2",
    },
  ];

  const mechanics = [
    { id: "1", name: "Mike Johnson", specialty: "Engine & Performance" },
    { id: "2", name: "Sarah Williams", specialty: "Brake & Suspension" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCustomer = customers.find(
      (c) => c.id === formData.customerId
    );
    const selectedCar = cars.find((c) => c.id === formData.carId);
    const selectedMechanic = mechanics.find(
      (m) => m.id === formData.mechanicId
    );

    const newOrder = {
      id: Math.random().toString(36).substring(7),
      carModel: selectedCar?.model || "",
      carYear: selectedCar?.year || "",
      issue: formData.issue,
      status: "pending",
      progress: 0,
      estimatedCompletion: `${formData.estimatedDays} days`,
      mechanicName: selectedMechanic?.name || "",
      cost: parseInt(formData.estimatedCost) || 0,
      customerName: selectedCustomer?.name || "",
      priority: formData.priority,
    };

    onCreateOrder(newOrder);
    onClose();
  };

  const filteredCars = formData.customerId
    ? cars.filter((car) => car.customerId === formData.customerId)
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 rounded-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-900 font-semibold">
              Create New Order
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to create a new service order
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Customer *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                required
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerId: e.target.value,
                    carId: "",
                  })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Car Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Vehicle *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                required
                value={formData.carId}
                onChange={(e) =>
                  setFormData({ ...formData, carId: e.target.value })
                }
                disabled={!formData.customerId}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a vehicle</option>
                {filteredCars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.model} ({car.year}) - {car.plate}
                  </option>
                ))}
              </select>
            </div>
            {!formData.customerId && (
              <p className="text-xs text-gray-500 mt-1">
                Please select a customer first
              </p>
            )}
          </div>

          {/* Issue */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={formData.issue}
              onChange={(e) =>
                setFormData({ ...formData, issue: e.target.value })
              }
              placeholder="e.g., Engine repair and oil change"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide details about the service required..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
            />
          </div>

          {/* Mechanic */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Assign Mechanic *
            </label>
            <div className="relative">
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                required
                value={formData.mechanicId}
                onChange={(e) =>
                  setFormData({ ...formData, mechanicId: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">Select a mechanic</option>
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} - {m.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost & Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Estimated Cost ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.estimatedCost}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedCost: e.target.value })
                  }
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Estimated Days *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.estimatedDays}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedDays: e.target.value })
                  }
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="flex gap-3">
              {["low", "normal", "high", "urgent"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`flex-1 py-2 px-4 rounded-xl border transition-all ${
                    formData.priority === p
                      ? p === "urgent"
                        ? "bg-red-100 border-red-300 text-red-700"
                        : p === "high"
                        ? "bg-orange-100 border-orange-300 text-orange-700"
                        : p === "normal"
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Create Order
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
