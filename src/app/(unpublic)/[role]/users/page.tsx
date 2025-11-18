// import { authorizePage } from "@/lib/authorize";
// import "../../../../styles/users.css";

// export default async function UsersPage() {
//   const session = await authorizePage(["admin"]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">User Management</h1>
//       <p>Welcome, {session.user.name}! Only admins can view this page.</p>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Car,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";

import "../../../../styles/users.css";

export default function CustomersView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const customers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      cars: [{ model: "Tesla Model S", year: 2023, plate: "ABC 1234" }],
      totalOrders: 12,
      totalSpent: 4500,
      lastVisit: "2025-11-10",
      memberSince: "2023-03-15",
      status: "active",
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      cars: [
        { model: "BMW X5", year: 2022, plate: "XYZ 5678" },
        { model: "BMW M4", year: 2021, plate: "BMW 9012" },
      ],
      totalOrders: 18,
      totalSpent: 6800,
      lastVisit: "2025-11-15",
      memberSince: "2022-08-20",
      status: "active",
    },
    {
      id: 3,
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine Rd, Chicago, IL 60601",
      cars: [{ model: "Audi A8", year: 2024, plate: "AUD 3456" }],
      totalOrders: 8,
      totalSpent: 3200,
      lastVisit: "2025-11-12",
      memberSince: "2023-11-10",
      status: "active",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 456-7890",
      address: "321 Elm St, Miami, FL 33101",
      cars: [{ model: "Mercedes-AMG GT", year: 2023, plate: "MER 7890" }],
      totalOrders: 15,
      totalSpent: 8900,
      lastVisit: "2025-11-08",
      memberSince: "2022-01-05",
      status: "vip",
    },
    {
      id: 5,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 567-8901",
      address: "654 Maple Dr, Seattle, WA 98101",
      cars: [{ model: "Porsche 911", year: 2024, plate: "POR 1234" }],
      totalOrders: 5,
      totalSpent: 2100,
      lastVisit: "2025-09-20",
      memberSince: "2024-06-12",
      status: "inactive",
    },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="status-badge status-badge--active">Active</span>
        );
      case "vip":
        return <span className="status-badge status-badge--vip">VIP</span>;
      case "inactive":
        return (
          <span className="status-badge status-badge--inactive">Inactive</span>
        );
      default:
        return null;
    }
  };

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
        <Button
          onClick={() => setShowAddCustomer(true)}
          className="add-customer-btn-override"
        >
          <Plus className="icon-sm" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="customers-stats-grid">
        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon stats-icon--blue">
              <Car className="icon-md" />
            </div>
            <div>
              <p className="stats-value">{customers.length}</p>
              <p className="stats-label">Total Customers</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon stats-icon--green">
              <DollarSign className="icon-md" />
            </div>
            <div>
              <p className="stats-value">
                $
                {customers
                  .reduce((sum, c) => sum + c.totalSpent, 0)
                  .toLocaleString()}
              </p>
              <p className="stats-label">Total Revenue</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon stats-icon--purple">
              <Car className="icon-md" />
            </div>
            <div>
              <p className="stats-value">
                {customers.reduce((sum, c) => sum + c.cars.length, 0)}
              </p>
              <p className="stats-label">Total Vehicles</p>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="stats-card-inner">
            <div className="stats-icon stats-icon--orange">
              <Calendar className="icon-md" />
            </div>
            <div>
              <p className="stats-value">
                {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
              </p>
              <p className="stats-label">Total Orders</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
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

      {/* Customers list */}
      <Card className="customers-list-card">
        <div className="customers-list-inner">
          <div className="customers-list">
            {filteredCustomers.map((customer) => (
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
                    {getStatusBadge(customer.status)}
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
                    ${customer.totalSpent.toLocaleString()}
                  </p>
                  <p className="customer-total-orders">
                    {customer.totalOrders} orders
                  </p>
                </div>

                <div className="customer-actions">
                  <button className="icon-btn icon-btn--edit">
                    <Edit className="icon-sm" />
                  </button>
                  <button className="icon-btn icon-btn--delete">
                    <Trash2 className="icon-sm icon-sm--red" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Customer Detail Modal */}
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
                    {getStatusBadge(selectedCustomerData.status)}
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
                <div className="dialog-field dialog-field--full">
                  <p className="dialog-field-label">Address</p>
                  <p className="dialog-field-value">
                    {selectedCustomerData.address}
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
                    ${selectedCustomerData.totalSpent.toLocaleString()}
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
                <Button className="dialog-btn dialog-btn--primary">
                  Edit Customer
                </Button>
                <Button className="dialog-btn dialog-btn--secondary">
                  View Orders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Customer Modal */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="dialog-body dialog-body--form">
            <div className="dialog-form-grid">
              <div className="dialog-form-field">
                <label className="dialog-field-label">Full Name</label>
                <Input placeholder="John Doe" className="dialog-input" />
              </div>
              <div className="dialog-form-field">
                <label className="dialog-field-label">Email</label>
                <Input
                  type="email"
                  placeholder="john@email.com"
                  className="dialog-input"
                />
              </div>
              <div className="dialog-form-field">
                <label className="dialog-field-label">Phone</label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  className="dialog-input"
                />
              </div>
              <div className="dialog-form-field">
                <label className="dialog-field-label">Status</label>
                <select className="dialog-select">
                  <option>Active</option>
                  <option>VIP</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="dialog-form-field dialog-field--full">
                <label className="dialog-field-label">Address</label>
                <Input
                  placeholder="123 Main St, City, State ZIP"
                  className="dialog-input"
                />
              </div>
            </div>
            <div className="dialog-actions">
              <Button className="dialog-btn dialog-btn--primary">
                Add Customer
              </Button>
              <Button
                className="dialog-btn dialog-btn--secondary"
                onClick={() => setShowAddCustomer(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
