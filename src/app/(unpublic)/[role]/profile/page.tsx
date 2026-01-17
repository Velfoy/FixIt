"use client";

import { useCallback, useEffect, useState } from "react";
import "@/styles/settings.css";

interface UserProfile {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
  created_at: Date;
}

interface CustomerData {
  address: string | null;
  city: string | null;
  postal_code: string | null;
  nip: string | null;
}

interface EmployeeData {
  position: string | null;
  specialization: string | null;
  hired_at: Date | null;
  employment_type: string | null;
  branch_id: number | null;
  branches: {
    name: string;
  } | null;
}

type NotificationType =
  | "REPAIR_COMPLETED"
  | "INSPECTION_SOON"
  | "PROMOTION"
  | "MESSAGE";

interface UserNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roleSpecificData, setRoleSpecificData] = useState<
    CustomerData | EmployeeData | null
  >(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Customer-specific fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [nip, setNip] = useState("");

  // Employee-specific fields
  const [specialization, setSpecialization] = useState("");

  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [notificationTypeFilter, setNotificationTypeFilter] =
    useState<NotificationType | "ALL">("ALL");
  const [notificationUnreadOnly, setNotificationUnreadOnly] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/settings/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
          setEmail(data.user.email || "");
          setFirstName(data.user.first_name || "");
          setLastName(data.user.last_name || "");
          setPhone(data.user.phone || "");

          // Set role-specific data
          if (data.roleSpecificData) {
            setRoleSpecificData(data.roleSpecificData);

            // Customer data
            if (data.user.role === "CLIENT") {
              setAddress(data.roleSpecificData.address || "");
              setCity(data.roleSpecificData.city || "");
              setPostalCode(data.roleSpecificData.postal_code || "");
              setNip(data.roleSpecificData.nip || "");
            }

            // Employee data
            if (data.user.role === "MECHANIC") {
              setSpecialization(data.roleSpecificData.specialization || "");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileLoading(true);

    try {
      const updateData: any = {
        email,
        firstName,
        lastName,
        phone,
      };

      // Add role-specific data
      if (profile?.role === "CLIENT") {
        updateData.roleSpecificData = {
          address,
          city,
          postal_code: postalCode,
          nip,
        };
      }

      if (profile?.role === "MECHANIC") {
        updateData.roleSpecificData = {
          specialization,
        };
      }

      const response = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        if (data.roleSpecificData) {
          setRoleSpecificData(data.roleSpecificData);
        }
        setProfileMessage({ type: "success", text: data.message });
      } else {
        setProfileMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationError(null);
    try {
      const params = new URLSearchParams();
      if (notificationTypeFilter !== "ALL") {
        params.set("type", notificationTypeFilter);
      }
      if (notificationUnreadOnly) {
        params.set("unread", "true");
      }

      const res = await fetch(
        `/api/notifications${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (!res.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = await res.json();
      setNotifications(data);
    } catch (error: any) {
      setNotificationError(error.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  }, [notificationTypeFilter, notificationUnreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const updateNotificationReadState = (id: number, read: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read } : n))
    );
  };

  const handleMarkNotification = async (id: number, read: boolean) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], read }),
      });

      if (!res.ok) {
        throw new Error("Failed to update notification");
      }

      updateNotificationReadState(id, read);
    } catch (error: any) {
      setNotificationError(error.message || "Failed to update notification");
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error: any) {
      setNotificationError(error.message || "Failed to delete notification");
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <p style={{ color: "#9ca3af" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Profile</h1>
        <p className="settings-subtitle">Manage your personal information</p>
      </div>

      {/* Account Information */}
      <div className="settings-section">
        <h2 className="settings-section-title">Account Information</h2>
        <div className="settings-info-row">
          <span className="settings-info-label">Email</span>
          <span className="settings-info-value">{profile?.email}</span>
        </div>
        <div className="settings-info-row">
          <span className="settings-info-label">Role</span>
          <span className="settings-info-value">
            {profile?.role.toUpperCase()}
          </span>
        </div>
        <div className="settings-info-row">
          <span className="settings-info-label">Member Since</span>
          <span className="settings-info-value">
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="settings-section">
        <h2 className="settings-section-title">Edit Profile</h2>
        {profileMessage && (
          <div
            className={`settings-alert ${
              profileMessage.type === "success"
                ? "settings-alert-success"
                : "settings-alert-error"
            }`}
          >
            {profileMessage.text}
          </div>
        )}
        <form onSubmit={handleProfileUpdate}>
          <div className="settings-form-group">
            <label className="settings-label">Email</label>
            <input
              type="email"
              className="settings-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-label">First Name</label>
            <input
              type="text"
              className="settings-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-label">Last Name</label>
            <input
              type="text"
              className="settings-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-label">Phone Number</label>
            <input
              type="tel"
              className="settings-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <button
            type="submit"
            className="settings-btn"
            disabled={profileLoading}
          >
            {profileLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Customer-specific Information */}
      {profile?.role === "CLIENT" && (
        <div className="settings-section">
          <h2 className="settings-section-title">Customer Information</h2>
          {roleSpecificData && (
            <>
              <div className="settings-info-row">
                <span className="settings-info-label">Address</span>
                <span className="settings-info-value">
                  {(roleSpecificData as CustomerData).address || "Not set"}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">City</span>
                <span className="settings-info-value">
                  {(roleSpecificData as CustomerData).city || "Not set"}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Postal Code</span>
                <span className="settings-info-value">
                  {(roleSpecificData as CustomerData).postal_code || "Not set"}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">NIP</span>
                <span className="settings-info-value">
                  {(roleSpecificData as CustomerData).nip || "Not set"}
                </span>
              </div>
            </>
          )}
          <div className="settings-divider" />
          <h3
            className="settings-section-title"
            style={{ fontSize: "16px", marginTop: "16px" }}
          >
            Edit Customer Details
          </h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="settings-form-group">
              <label className="settings-label">Address</label>
              <input
                type="text"
                className="settings-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-label">City</label>
              <input
                type="text"
                className="settings-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-label">Postal Code</label>
              <input
                type="text"
                className="settings-input"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="00-000"
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-label">NIP (Tax ID)</label>
              <input
                type="text"
                className="settings-input"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="0000000000"
              />
            </div>

            <button
              type="submit"
              className="settings-btn"
              disabled={profileLoading}
            >
              {profileLoading ? "Updating..." : "Update Customer Info"}
            </button>
          </form>
        </div>
      )}

      {/* Employee/Mechanic-specific Information */}
      {profile?.role === "MECHANIC" && (
        <div className="settings-section">
          <h2 className="settings-section-title">Employment Information</h2>
          {roleSpecificData && (
            <>
              <div className="settings-info-row">
                <span className="settings-info-label">Position</span>
                <span className="settings-info-value">
                  {(roleSpecificData as EmployeeData).position || "Not set"}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Specialization</span>
                <span className="settings-info-value">
                  {(roleSpecificData as EmployeeData).specialization ||
                    "Not set"}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Employment Type</span>
                <span className="settings-info-value">
                  {(roleSpecificData as EmployeeData).employment_type?.replace(
                    "_",
                    " "
                  ) || "Not set"}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Branch</span>
                <span className="settings-info-value">
                  {(roleSpecificData as EmployeeData).branches?.name ||
                    "Not assigned"}
                </span>
              </div>
              <div className="settings-info-row">
                <span className="settings-info-label">Hired Date</span>
                <span className="settings-info-value">
                  {(roleSpecificData as EmployeeData).hired_at
                    ? new Date(
                        (roleSpecificData as EmployeeData).hired_at!
                      ).toLocaleDateString()
                    : "Not set"}
                </span>
              </div>
            </>
          )}
          <div className="settings-divider" />
          <h3
            className="settings-section-title"
            style={{ fontSize: "16px", marginTop: "16px" }}
          >
            Edit Employment Details
          </h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="settings-form-group">
              <label className="settings-label">Specialization</label>
              <input
                type="text"
                className="settings-input"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g., Engine Specialist, Electrical Systems"
              />
              <p className="settings-input-hint">
                Your area of expertise or specialization
              </p>
            </div>

            <button
              type="submit"
              className="settings-btn"
              disabled={profileLoading}
            >
              {profileLoading ? "Updating..." : "Update Employment Info"}
            </button>
          </form>
        </div>
      )}

      <div className="settings-section" id="notifications">
        <div className="settings-section-header settings-section-header--between">
          <div>
            <h2 className="settings-section-title">Notifications</h2>
            <p className="settings-subtitle">Events related to your orders and warehouse updates</p>
          </div>
          <div className="notification-filters">
            <select
              className="settings-input notification-select"
              value={notificationTypeFilter}
              onChange={(e) =>
                setNotificationTypeFilter(e.target.value as NotificationType | "ALL")
              }
            >
              <option value="ALL">All types</option>
              <option value="MESSAGE">General</option>
              <option value="REPAIR_COMPLETED">Repair completed</option>
              <option value="INSPECTION_SOON">Inspection</option>
              <option value="PROMOTION">Promotion</option>
            </select>
            <label className="notification-checkbox">
              <input
                type="checkbox"
                checked={notificationUnreadOnly}
                onChange={(e) => setNotificationUnreadOnly(e.target.checked)}
              />
              Unread only
            </label>
            <button
              type="button"
              className="settings-btn settings-btn-ghost"
              onClick={fetchNotifications}
            >
              Refresh
            </button>
          </div>
        </div>

        {notificationError && (
          <div className="settings-alert settings-alert-error">{notificationError}</div>
        )}

        {notificationsLoading ? (
          <p style={{ color: "#9ca3af" }}>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="notification-empty">No notifications yet.</p>
        ) : (
          <div className="notification-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-card ${n.read ? "read" : "unread"}`}
              >
                <div className="notification-card-header">
                  <span className={`notification-pill notification-pill-${n.type.toLowerCase()}`}>
                    {n.type.replace("_", " ")}
                  </span>
                  <span className="notification-date">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="notification-title">{n.title}</p>
                {n.message && <p className="notification-message">{n.message}</p>}
                <div className="notification-actions">
                  <button
                    type="button"
                    className="settings-btn settings-btn-ghost"
                    onClick={() => handleMarkNotification(n.id, !n.read)}
                  >
                    {n.read ? "Mark as unread" : "Mark as read"}
                  </button>
                  <button
                    type="button"
                    className="settings-btn settings-btn-danger"
                    onClick={() => handleDeleteNotification(n.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
