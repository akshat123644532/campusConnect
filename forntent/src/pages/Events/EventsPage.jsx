import React, { useState, useEffect } from "react";
import EventCard from "../../components/EventCard/EventCard";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { apiFetch, authFetch } from "../../utils/api";
import "./EventsPage.css";

const EventsPage = ({ showToast, user }) => {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [registering, setReg]     = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // ✅ Search & Filter state
  const [search, setSearch]       = useState("");
  const [filterDate, setFilterDate] = useState(""); // "asc" | "desc" | ""
  const [filterVenue, setFilterVenue] = useState(""); // unique venue select

  const isOrganizer =
    user?.role === "organizer" || user?.role === "admin";

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
  });

  /* ── Load Events ── */
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/events/all");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      showToast("Failed to load events");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ── Register Event ── */
  const handleRegister = async (event) => {
    setReg(event._id);
    try {
      const res = await authFetch("/events/register", {
        method: "POST",
        body: JSON.stringify({
          studentName: user?.name || "Student",
          eventId: event._id,
        }),
      });
      const msg = await res.text();
      showToast(msg, res.ok ? "success" : "error");
    } catch (err) {
      showToast("Registration failed");
    }
    setReg(null);
  };

  /* ── Create Event ── */
  const handleCreate = async () => {
    if (!form.title || !form.date || !form.venue) {
      showToast("Title, date and venue are required");
      return;
    }
    try {
      const res = await authFetch("/events/create", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const msg = await res.text();
      showToast(msg, res.ok ? "success" : "error");
      if (res.ok) {
        setShowCreate(false);
        setForm({ title: "", description: "", date: "", venue: "" });
        loadEvents();
      }
    } catch (err) {
      showToast("Failed to create event");
    }
  };

  /* ── Delete Event ── */
  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/events/${id}`, { method: "DELETE" });
      const msg = await res.text();
      showToast(msg, res.ok ? "success" : "error");
      if (res.ok) loadEvents();
    } catch (err) {
      showToast("Delete failed");
    }
  };

  /* ── Unique venues for dropdown ── */
  const uniqueVenues = [...new Set(events.map((e) => e.venue).filter(Boolean))];

  /* ── Tab filter ── */
  const myEvents = events.filter(
    (e) => e.createdBy?.toString() === user?.id
  );

  const tabFiltered =
    activeTab === "mine" || activeTab === "manage" ? myEvents : events;

  /* ── Search + Filter ── */
  let visibleEvents = tabFiltered.filter((ev) => {
    const matchSearch =
      ev.title?.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase());

    const matchVenue = filterVenue ? ev.venue === filterVenue : true;

    return matchSearch && matchVenue;
  });

  /* ── Date sort ── */
  if (filterDate === "asc") {
    visibleEvents = [...visibleEvents].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  } else if (filterDate === "desc") {
    visibleEvents = [...visibleEvents].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  /* ── Reset filters ── */
  const handleReset = () => {
    setSearch("");
    setFilterDate("");
    setFilterVenue("");
  };

  const hasFilters = search || filterDate || filterVenue;

  return (
    <div className="events-page">

      {/* HEADER */}
      <div className="events-page__header">
        <div>
          <h1 className="events-page__title">
            ALL <span>EVENTS</span>
          </h1>
          <p className="events-page__count">
            {loading
              ? "Loading..."
              : `${visibleEvents.length} of ${events.length} events`}
          </p>
        </div>

        {isOrganizer && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button
              variant={activeTab === "all" ? "primary" : "ghost"}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>
            <Button
              variant={activeTab === "mine" ? "primary" : "ghost"}
              onClick={() => setActiveTab("mine")}
            >
              My Events
            </Button>
            <Button
              variant={activeTab === "manage" ? "primary" : "ghost"}
              onClick={() => setActiveTab("manage")}
            >
              Manage
            </Button>
            <Button
              variant={showCreate ? "ghost" : "primary"}
              onClick={() => setShowCreate((v) => !v)}
            >
              {showCreate ? "Cancel" : "+ Create"}
            </Button>
          </div>
        )}
      </div>

      {/* ✅ SEARCH + FILTER BAR */}
      <div className="events-page__filters">
        {/* Search input */}
        <div className="events-page__search-wrap">
          <span className="events-page__search-icon">🔍</span>
          <input
            className="events-page__search"
            type="text"
            placeholder="Search by title, venue, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="events-page__search-clear"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Venue filter */}
        <select
          className="events-page__select"
          value={filterVenue}
          onChange={(e) => setFilterVenue(e.target.value)}
        >
          <option value="">All Venues</option>
          {uniqueVenues.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        {/* Date sort */}
        <select
          className="events-page__select"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="">Sort by Date</option>
          <option value="asc">Date: Earliest First</option>
          <option value="desc">Date: Latest First</option>
        </select>

        {/* Reset */}
        {hasFilters && (
          <button className="events-page__reset" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {showCreate && isOrganizer && (
        <div className="events-page__create-form anim-slide">
          <h2>NEW EVENT</h2>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Venue"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
          <Input
            type="date"
            label="Date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Button onClick={handleCreate}>Create Event</Button>
        </div>
      )}

      {/* EVENTS GRID */}
      {loading ? (
        <div className="events-page__empty">LOADING...</div>
      ) : visibleEvents.length === 0 ? (
        <div className="events-page__empty">
          {hasFilters ? "Koi event nahi mila 😕" : "NO EVENTS FOUND"}
        </div>
      ) : (
        <div className="events-page__grid">
          {visibleEvents.map((ev, i) => (
            <div key={ev._id} style={{ animationDelay: `${i * 0.05}s` }}>
              <EventCard
                event={ev}
                onRegister={handleRegister}
                registering={registering}
              />
              {isOrganizer && (
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <Button variant="ghost" onClick={() => handleDelete(ev._id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;

