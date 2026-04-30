import React from "react";
import Button from "../Button/Button";
import { isOrganizer } from "../../utils/api"; // ✅ import
import "./Navbar.css";

const STUDENT_LINKS = [
  { label: "Events",   page: "events"  },
  { label: "My Regs",  page: "myregs"  },
  { label: "Profile",  page: "profile" },
];

const ORGANIZER_LINKS = [
  { label: "Panel",    page: "organizer" },
  { label: "Profile",  page: "profile"   },
];

const AUTH_LINKS = [
  { label: "Login",    page: "login"   },
  { label: "Sign Up",  page: "signup"  },
];

const Navbar = ({ page, setPage, user, onLogout }) => {
  // ✅ organizer ko alag links, student ko alag, logged out ko alag
  const links = !user
    ? AUTH_LINKS
    : isOrganizer()
    ? ORGANIZER_LINKS
    : STUDENT_LINKS;

  return (
    <nav className="cc-nav">
      {/* Logo */}
      <button
        className="cc-nav__logo"
        onClick={() =>
          setPage(
            !user ? "login" : isOrganizer() ? "organizer" : "events"
          )
        }
      >
        CAMPUS<span>CONNECT</span>
      </button>

      {/* Links */}
      <div className="cc-nav__links">
        {links.map(({ label, page: p }) => (
          <button
            key={p}
            className={`cc-nav__link${page === p ? " cc-nav__link--active" : ""}`}
            onClick={() => setPage(p)}
          >
            {label}
          </button>
        ))}

        {user && (
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
