import { useEffect, useState } from "react";
import { authFetch, formatDate, isOrganizer } from "../../utils/api";
import "./OrganizerPanel.css";

export default function OrganizerPanel({ showToast }) {
  const [tab, setTab]               = useState("dashboard");
  const [events, setEvents]         = useState([]);
  const [participants, setParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading]       = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [form, setForm]             = useState({
    title: "", description: "", date: "", venue: "",
  });

  if (!isOrganizer()) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Access Denied</p>;
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setStatsLoading(true);
    try {
      const res = await authFetch("/events/all");
      const data = await res.json();
      setEvents(data);
    } catch {
      showToast("Failed to load events");
    }
    setStatsLoading(false);
  };

  const handleCreate = async () => {
    const { title, date, venue } = form;
    if (!title || !date || !venue) {
      showToast("Title, date aur venue required hain");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/events/create", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) { showToast(await res.text()); return; }
      showToast("Event create ho gaya!", "success");
      setForm({ title: "", description: "", date: "", venue: "" });
      fetchEvents();
      setTab("events");
    } catch {
      showToast("Kuch gadbad ho gayi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Event aur uski saari registrations delete ho jaengi. Sure?")) return;
    try {
      const res = await authFetch(`/events/delete/${id}`, { method: "DELETE" });
      if (!res.ok) { showToast(await res.text()); return; }
      showToast("Event delete ho gaya", "success");
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      showToast("Delete fail ho gaya");
    }
  };

  const handleLoadParticipants = async (eventId) => {
    setSelectedEvent(eventId);
    setParticipants([]);
    if (!eventId) return;
    try {
      const res = await authFetch(`/events/participants/${eventId}`);
      const data = await res.json();
      setParticipants(data);
    } catch {
      showToast("Participants load nahi hue");
    }
  };

  /* ── CSV Export ── */
  const handleExportCSV = () => {
    if (!participants.length) return;
    const selectedTitle = events.find(e => e._id === selectedEvent)?.title || "event";
    const rows = [
      ["#", "Name", "Email"],
      ...participants.map((p, i) => [i + 1, p.studentName, p.email]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTitle}-participants.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Stats ── */
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;
  const pastEvents = totalEvents - upcomingEvents;

  const TABS = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "events",    label: "📋 My Events" },
    { id: "create",    label: "➕ Create" },
    { id: "participants", label: "👥 Participants" },
  ];

  return (
    <div className="org-panel">

      {/* Header */}
      <div className="org-panel__header">
        <div>
          <h2 className="org-panel__title">Organizer Panel</h2>
          <p className="org-panel__subtitle">Manage your campus events</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="org-panel__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`org-panel__tab ${tab === t.id ? "org-panel__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Dashboard ── */}
      {tab === "dashboard" && (
        <div className="org-panel__dashboard">

          {/* Stat Cards */}
          <div className="org-panel__stats">
            <div className="org-panel__stat org-panel__stat--blue">
              <div className="org-panel__stat-icon">🗓️</div>
              <div className="org-panel__stat-val">{statsLoading ? "—" : totalEvents}</div>
              <div className="org-panel__stat-label">Total Events</div>
            </div>
            <div className="org-panel__stat org-panel__stat--green">
              <div className="org-panel__stat-icon">🚀</div>
              <div className="org-panel__stat-val">{statsLoading ? "—" : upcomingEvents}</div>
              <div className="org-panel__stat-label">Upcoming</div>
            </div>
            <div className="org-panel__stat org-panel__stat--gray">
              <div className="org-panel__stat-icon">✅</div>
              <div className="org-panel__stat-val">{statsLoading ? "—" : pastEvents}</div>
              <div className="org-panel__stat-label">Completed</div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="org-panel__section">
            <h3 className="org-panel__section-title">Recent Events</h3>
            {events.length === 0 ? (
              <p className="org-panel__empty">Koi event nahi hai abhi</p>
            ) : (
              <div className="org-panel__list">
                {events.slice(0, 5).map((ev) => {
                  const isUpcoming = new Date(ev.date) >= new Date();
                  return (
                    <div key={ev._id} className="org-panel__card">
                      <div className="org-panel__card-left">
                        <div className="org-panel__card-title">{ev.title}</div>
                        <div className="org-panel__card-meta">
                          <span>📅 {formatDate(ev.date)}</span>
                          <span>📍 {ev.venue}</span>
                        </div>
                      </div>
                      <span className={`org-panel__badge ${isUpcoming ? "org-panel__badge--green" : "org-panel__badge--gray"}`}>
                        {isUpcoming ? "Upcoming" : "Done"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="org-panel__section">
            <h3 className="org-panel__section-title">Quick Actions</h3>
            <div className="org-panel__actions">
              <button className="org-panel__action-btn" onClick={() => setTab("create")}>
                <span>➕</span> Create New Event
              </button>
              <button className="org-panel__action-btn" onClick={() => setTab("participants")}>
                <span>👥</span> View Participants
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB: My Events ── */}
      {tab === "events" && (
        <div className="org-panel__list">
          {events.length === 0 && (
            <p className="org-panel__empty">Koi event nahi hai abhi</p>
          )}
          {events.map((ev) => {
            const isUpcoming = new Date(ev.date) >= new Date();
            return (
              <div key={ev._id} className="org-panel__card">
                <div className="org-panel__card-left">
                  <div className="org-panel__card-title">{ev.title}</div>
                  <div className="org-panel__card-meta">
                    <span>📅 {formatDate(ev.date)}</span>
                    <span>📍 {ev.venue}</span>
                  </div>
                </div>
                <div className="org-panel__card-right">
                  <span className={`org-panel__badge ${isUpcoming ? "org-panel__badge--green" : "org-panel__badge--gray"}`}>
                    {isUpcoming ? "Upcoming" : "Done"}
                  </span>
                  <button
                    className="org-panel__btn-delete"
                    onClick={() => handleDelete(ev._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: Create Event ── */}
      {tab === "create" && (
        <div className="org-panel__create-wrap">
          <div className="org-panel__form">
            <div className="org-panel__field org-panel__field--full">
              <label>Event Title *</label>
              <input
                type="text"
                placeholder="e.g. Annual Hackathon"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="org-panel__field">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="org-panel__field">
              <label>Venue *</label>
              <input
                type="text"
                placeholder="e.g. Main Hall"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
            <div className="org-panel__field org-panel__field--full">
              <label>Description</label>
              <textarea
                placeholder="Event ke baare mein likho..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="org-panel__form-footer">
              <button
                className="org-panel__btn-create"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? "Creating..." : "✨ Create Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Participants ── */}
      {tab === "participants" && (
        <div>
          <div className="org-panel__participants-header">
            <div className="org-panel__field" style={{ flex: 1 }}>
              <label>Event Select Karo</label>
              <select
                value={selectedEvent}
                onChange={(e) => handleLoadParticipants(e.target.value)}
              >
                <option value="">— Event choose karo —</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>{ev.title}</option>
                ))}
              </select>
            </div>
            {participants.length > 0 && (
              <button className="org-panel__btn-export" onClick={handleExportCSV}>
                📤 Export CSV
              </button>
            )}
          </div>

          {!selectedEvent && (
            <p className="org-panel__empty">Pehle event select karo</p>
          )}
          {selectedEvent && participants.length === 0 && (
            <p className="org-panel__empty">Koi registration nahi abhi tak</p>
          )}
          {participants.length > 0 && (
            <>
              <p className="org-panel__count">{participants.length} participant(s) registered</p>
              <table className="org-panel__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => (
                    <tr key={p._id}>
                      <td>{i + 1}</td>
                      <td>{p.studentName}</td>
                      <td>{p.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}