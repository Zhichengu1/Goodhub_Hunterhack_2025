import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Team.css";  // Updated to match new filename

function Team() {  // Capitalized function name
  const [events, setEvents] = useState([
    {
      key: 1,
      title: "Park Cleanup",
      description: "Help clean up the community park and plant new trees.",
      date: "2025-05-10",
      capacity: 15,
      joined: 3,
    },
    {
      key: 2,
      title: "Food Bank ",
      description: "Assist with sorting and distributing food to families in need.",
      date: "2025-05-15",
      capacity: 20,
      joined: 7,
    },
    {
      key: 3,
      title: "Tutoring  Students",
      description: "Provide academic support in environment and math for local youth.",
      date: "2025-05-18",
      capacity: 10,
      joined: 5,
    },
    {
      key: 4,
      title: "Beach Plastic Collection",
      description: "Join our coastal team to remove plastic waste and preserve marine life.",
      date: "2025-05-22",
      capacity: 12,
      joined: 2,
    },
    {
      key: 5,
      title: "Beach Plastic Collection",
      description: "Join our coastal team to remove plastic waste and preserve marine life.",
      date: "2025-05-24",
      capacity: 8,
      joined: 4,
    },
    {
      key: 6,
      title: "Food Distribution",
      description: "Assist with sorting and distributing food to families in need.",
      date: "2025-05-24",
      capacity: 15,
      joined: 7,
    },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", capacity: 1 });
  const [calendarDate, setCalendarDate] = useState(new Date());

  const handleAdd = (e) => {
    e.preventDefault();
    const newEvent = {
      ...form,
      joined: 0,
      capacity: parseInt(form.capacity),
      key: Date.now(), // Use timestamp as a unique key
    };
    setEvents([...events, newEvent]);
    setShowForm(false);
    setForm({ title: "", description: "", date: "", capacity: 1 });
  };

  const handleJoin = (key) => {
    setEvents((prev) =>
      prev
        .map((event) =>
          event.key === key ? { ...event, joined: event.joined + 1 } : event
        )
        .filter((event) => event.joined < event.capacity)
    );
  };

  return (
    <div className="team-container">
      {/* Top navigation bar */}
      <div className="team-navbar">
        <div className="team-logo">GoodHub</div>
        <div className="team-nav-buttons">
          <button onClick={() => setShowForm(true)}>Add</button>
          <button>Home</button>
          <button>Daily Challenge</button>
          <button>Login</button>
          <button></button>
          <button></button>
        </div>
      </div>

      {/* Add event modal */}
      {showForm && (
        <div className="team-modal">
          <form onSubmit={handleAdd} className="team-form">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              min="1"
              required
            />

            <div className="team-form-buttons">
              <button type="submit">Create</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="team-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New two-column layout: Calendar (left) + Events (right) */}
      <div className="team-main-content">
        <div className="team-calendar-panel">
          <div className="team-calendar-block">
            <Calendar
              onChange={setCalendarDate}
              value={new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1)}
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  const hasEvent = events.some(
                    (event) => event.date === date.toISOString().split("T")[0]
                  );
                  return hasEvent ? "team-has-event" : null;
                }
                return null;
              }}
            />
          </div>
          <div className="team-calendar-block">
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  const hasEvent = events.some(
                    (event) => event.date === date.toISOString().split("T")[0]
                  );
                  return hasEvent ? "team-has-event" : null;
                }
                return null;
              }}
            />
          </div>
        </div>

        <div className="team-right-panel">
          <div className="team-event-list">
            {events.map((event) => (
              <div className="team-event-card" key={event.key}>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p>Date: {event.date}</p>
                <p>
                  Joined: {event.joined} / {event.capacity}
                </p>
                <button onClick={() => handleJoin(event.key)}>Join</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;