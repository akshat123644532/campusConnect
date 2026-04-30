import { useState, useEffect } from "react";

import "./styles/global.css";

import Navbar  from "./components/Navbar/Navbar";
import Toast   from "./components/Toast/Toast";

import LoginPage      from "./pages/Login/LoginPage";
import SignupPage     from "./pages/Signup/SignupPage";
import EventsPage     from "./pages/Events/EventsPage";
import MyRegsPage     from "./pages/MyRegs/MyRegsPage";
import ProfilePage    from "./pages/Profile/ProfilePage";
import OrganizerPanel from "./pages/Organizer/OrganizerPanel"; // ✅ new

import { getUser, clearSession, isOrganizer } from "./utils/api";

export default function App() {
  const [page, setPage]   = useState("login");
  const [user, setUser]   = useState(null);
  const [toast, setToast] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);
      setPage("events");
    }
  }, []);

  const showToast = (msg, type = "error") =>
    setToast({ msg, type, key: Date.now() });

  const handleAuthSuccess = () => {
    const u = getUser();
    setUser(u);
    // ✅ organizer ko seedha organizer panel pe bhejo
    setPage(u?.role === "organizer" ? "organizer" : "events");
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setPage("login");
    showToast("Logged out successfully", "success");
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return (
          <LoginPage
            onSuccess={handleAuthSuccess}
            setPage={setPage}
            showToast={showToast}
          />
        );
      case "signup":
        return (
          <SignupPage
            setPage={setPage}
            showToast={showToast}
          />
        );
      case "events":
        return <EventsPage showToast={showToast} user={user} />;
      case "myregs":
        return <MyRegsPage showToast={showToast} />;
      case "profile":
        return <ProfilePage showToast={showToast} />;
      case "organizer": // ✅ new
        return isOrganizer()
          ? <OrganizerPanel showToast={showToast} />
          : <EventsPage showToast={showToast} user={user} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />

      <main>{renderPage()}</main>

      {toast && (
        <Toast
          key={toast.key}
          msg={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}
