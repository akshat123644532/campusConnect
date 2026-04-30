import React from "react";
import Button from "../Button/Button";
import { formatDate } from "../../utils/api";
import "./EventCard.css";

const EventCard = ({ event, onRegister, registering }) => {
  const { _id, title, description, date, venue } = event;

  return (
    <div className="cc-event-card">
      <div className="cc-event-card__top">
        <span className="cc-event-card__tag">EVENT</span>
        <span className="cc-event-card__date">{formatDate(date)}</span>
      </div>

      <h3 className="cc-event-card__title">{title}</h3>

      {description && (
        <p className="cc-event-card__desc">{description}</p>
      )}

      <div className="cc-event-card__venue">
        <span className="cc-event-card__dot" />
        {venue}
      </div>

      <div className="cc-event-card__divider" />

      <Button
        variant="primary"
        fullWidth
        size="sm"
        loading={registering === _id}
        onClick={() => onRegister(event)}
      >
        Register Now
      </Button>
    </div>
  );
};

export default EventCard;
