"use client";

import { useState } from "react";
import "@/styles/settings.css";

export default function SettingsPage() {
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: "success", text: data.message });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: "Failed to change password. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">
          Change your password and security settings
        </p>
      </div>

      {/* Change Password */}
      <div className="settings-section">
        <h2 className="settings-section-title">Change Password</h2>
        {passwordMessage && (
          <div
            className={`settings-alert ${
              passwordMessage.type === "success"
                ? "settings-alert-success"
                : "settings-alert-error"
            }`}
          >
            {passwordMessage.text}
          </div>
        )}
        <form onSubmit={handlePasswordChange}>
          <div className="settings-form-group">
            <label className="settings-label">Current Password</label>
            <input
              type="password"
              className="settings-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-label">New Password</label>
            <input
              type="password"
              className="settings-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <p className="settings-input-hint">
              Must be at least 6 characters long
            </p>
          </div>

          <div className="settings-form-group">
            <label className="settings-label">Confirm New Password</label>
            <input
              type="password"
              className="settings-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="settings-btn"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
