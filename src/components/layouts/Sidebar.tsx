"use client";
import React from "react";
import {
  Settings,
  Home,
  Users,
  Package,
  ClipboardList,
  Car,
  Clock,
  FileText,
  Info,
  User,
} from "lucide-react";
import "../../styles/sidebar.css";
import Image from "next/image";
import logo_white from "../../../public/images/logo_white.png";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface SidebarProps {
  role?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }: SidebarProps) => {
  // Safely handle missing or invalid role
  const safeRole =
    role && typeof role === "string" && role.length > 0
      ? role.toLowerCase()
      : null;

  if (!safeRole) {
    return (
      <div className="sidebar">
        <div>
          <Link href="/" className="sidebar-logo">
            <Image src={logo_white} alt="Logo" className="logo-img" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div>
        <Link href="/" className="sidebar-logo">
          <Image src={logo_white} alt="Logo" className="logo-img" />
        </Link>
      </div>

      <div className="sidebar-divider" />

      {/* Dashboard */}
      <a href={`/${safeRole}/dashboard`} className="sidebar-btn">
        <Home className="icon" />
        <span className="sidebar-text">Dashboard</span>
      </a>

      {/* Admin-only */}
      {safeRole === "admin" && (
        <a href={`/${safeRole}/customers`} className="sidebar-btn">
          <Users className="icon" />
          <span className="sidebar-text">Customers</span>
        </a>
      )}
      {safeRole === "admin" && (
        <a href={`/${safeRole}/users`} className="sidebar-btn">
          <Users className="icon" />
          <span className="sidebar-text">Users</span>
        </a>
      )}
      {safeRole === "admin" && (
        <a href={`/${safeRole}/mechanics`} className="sidebar-btn">
          <Users className="icon" />
          <span className="sidebar-text">Mechanics</span>
        </a>
      )}

      {/* Admin / mechanic / warehouse */}
      {(safeRole === "admin" ||
        safeRole === "mechanic" ||
        safeRole === "warehouse") && (
        <a href={`/${safeRole}/warehouse`} className="sidebar-btn">
          <Package className="icon" />
          <span className="sidebar-text">Warehouse</span>
        </a>
      )}

      {/* Orders */}
      {(safeRole === "admin" ||
        safeRole === "mechanic" ||
        safeRole === "client") && (
        <a href={`/${safeRole}/orders`} className="sidebar-btn">
          <ClipboardList className="icon" />
          <span className="sidebar-text">Orders</span>
        </a>
      )}

      {/* Cars */}
      {(safeRole === "admin" || safeRole === "client") && (
        <a href={`/${safeRole}/cars`} className="sidebar-btn">
          <Car className="icon" />
          <span className="sidebar-text">Cars</span>
        </a>
      )}

      {/* Client history */}
      {/* {safeRole === "client" && (
        <a href={`/${safeRole}/history`} className="sidebar-btn">
          <Clock className="icon" />
          <span className="sidebar-text">History</span>
        </a>
      )} */}

      {/* Invoices */}
      {/* {(safeRole === "admin" ||
        safeRole === "client" ||
        safeRole === "warehouse") && (
        <a href={`/${safeRole}/invoices`} className="sidebar-btn">
          <FileText className="icon" />
          <span className="sidebar-text">Invoices</span>
        </a>
      )} */}

      {/* Info */}
      {/* <a href={`/${safeRole}/info`} className="sidebar-btn">
        <Info className="icon" />
        <span className="sidebar-text">Info</span>
      </a> */}

      <div className="sidebar-bottom">
        {/* Profile */}
        <a href={`/${safeRole}/profile`} className="sidebar-btn">
          <User className="icon" />
          <span className="sidebar-text">Profile</span>
        </a>
        {/* Settings */}
        <a href={`/${safeRole}/settings`} className="sidebar-btn">
          <Settings className="icon" />
          <span className="sidebar-text">Settings</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
