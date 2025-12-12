"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import "../../styles/navbar.css";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.includes("auth");
  const isHome = pathname === "/" || pathname === "/(first_page)/public"; // adjust if home is different

  const userLabel = session?.user?.name
    ? `${session.user.name}`.trim()
    : session?.user?.email || session?.user?.name || "User";

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <div className="navbar-left">
          <Link href="/" className="navbar-brand">
            <Image
              src="/images/logo_white_text.png"
              alt="FixIt"
              width={90}
              className="navbar-brand-logo"
              height={38}
            />
          </Link>
        </div>

        <div className="navbar-actions">
          {isAuthPage ? (
            <Link href="/" className="navbar-btn">
              Home
            </Link>
          ) : !session ? (
            <Link href="/login" className="navbar-btn">
              Login
            </Link>
          ) : (
            <div className="navbar-user">
              <span className="navbar-user-label">{userLabel}</span>
              <button
                className="navbar-btn navbar-logout"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
