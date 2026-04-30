import React, { useState, useEffect } from "react";
import { authFetch } from "../../utils/api";
import "./ProfilePage.css";

const ProfilePage = ({ showToast }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      try {
        const res = await authFetch("/users/profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed");
        }

        setProfile(data);
      } catch (err) {
        showToast("Failed to load profile");
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__loading">LOADING...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-page__loading">
          NO PROFILE DATA FOUND
        </div>
      </div>
    );
  }

  const initials =
    profile.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  const fields = [
    { label: "User ID", value: profile._id },
    { label: "Name", value: profile.name },
    { label: "Email", value: profile.email },
  ];

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">
        YOUR <span>PROFILE</span>
      </h1>

      <div className="profile-card anim-slide">
        {/* Avatar */}
        <div className="profile-card__hero">
          <div className="profile-card__avatar">
            {initials}
          </div>

          <div>
            <div className="profile-card__name">
              {profile.name?.toUpperCase()}
            </div>
            <div className="profile-card__email">
              {profile.email}
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Fields */}
        <div className="profile-card__fields">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="profile-card__field"
            >
              <span className="profile-card__field-label">
                {label}
              </span>
              <span className="profile-card__field-value">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
