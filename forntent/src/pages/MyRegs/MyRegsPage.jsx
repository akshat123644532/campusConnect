import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import { authFetch, formatDate } from "../../utils/api";
import "./MyRegsPage.css";

const MyRegsPage = ({ showToast }) => {
  const [regs, setRegs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const loadRegs = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/events/my");
      const data = await res.json();
      setRegs(data);
    } catch {
      showToast("Failed to load registrations");
    }
    setLoading(false);
  };

  useEffect(() => { loadRegs(); }, []);

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      const res = await authFetch(`/events/cancel/${id}`, { method: "DELETE" });
      const msg = await res.text();
      showToast(msg, res.ok ? "success" : "error");
      if (res.ok) setRegs((prev) => prev.filter((r) => r._id !== id));
    } catch {
      showToast("Error cancelling registration");
    }
    setCancelling(null);
  };

  return (
    <div className="myregs-page">
      <div className="myregs-page__header">
        <h1 className="myregs-page__title">
          MY <span>REGS</span>
        </h1>
        <p className="myregs-page__count">
          {loading ? "" : `${regs.length} registration${regs.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <div className="myregs-page__empty">LOADING...</div>
      ) : regs.length === 0 ? (
        <div className="myregs-page__empty">
          NO REGISTRATIONS YET.
        </div>
      ) : (
        <div className="myregs-page__list">
          {regs.map((r, i) => {
            const ev = r.eventId;
            return (
              <div
                key={r._id}
                className="myregs-card anim-slide"
                style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
              >
                <div className="myregs-card__left">
                  <div className="myregs-card__index">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="myregs-card__title">
                      {ev?.title?.toUpperCase() || "EVENT"}
                    </h3>
                    <div className="myregs-card__meta">
                      {ev?.venue && (
                        <span>
                          <span className="myregs-card__dot" />
                          {ev.venue}
                        </span>
                      )}
                      {ev?.date && (
                        <span>{formatDate(ev.date)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  loading={cancelling === r._id}
                  onClick={() => handleCancel(r._id)}
                >
                  Cancel
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegsPage;
