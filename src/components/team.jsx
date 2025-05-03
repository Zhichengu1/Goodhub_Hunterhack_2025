// App.jsx
import React, { useState, useEffect } from 'react';
import './team.css';

// Simple cookie helpers
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

export default function team() {
  // State for teams list
  const [teams, setTeams] = useState([
    { id: 1, title: 'Group Alpha', description: 'Looking for frontend dev', limit: 4, members: 2, open: false, deadline: '2025-05-05T18:00' },
    { id: 2, title: 'Group Beta', description: 'Backend engineers wanted', limit: 3, members: 0, open: false, deadline: '2025-05-03T12:00' },
    { id: 3, title: 'Group Alpha', description: 'Looking for frontend dev', limit: 4, members: 1, open: false, deadline: '2025-05-06T18:00' },
    { id: 4, title: 'Group Beta', description: 'Backend engineers wanted', limit: 3, members: 1, open: false, deadline: '2025-05-13T12:00' },
    { id: 5, title: 'Group Alpha', description: 'Looking for frontend dev', limit: 4, members: 0, open: false, deadline: '2025-05-05T18:00' },
    { id: 6, title: 'Group Beta', description: 'Backend engineers wanted', limit: 3, members: 0, open: false, deadline: '2025-05-03T12:00' },
  ]);

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState(null);

  // Add form
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLimit, setFormLimit] = useState(1);
  const [formDeadline, setFormDeadline] = useState('');

  // Join form
  const [joinName, setJoinName] = useState('');
  const [joinPhone, setJoinPhone] = useState('');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Cleanup expired/full teams
  useEffect(() => {
    const interval = setInterval(() => {
      setTeams(curr => curr.filter(
        team => new Date(team.deadline) > new Date() && team.members < team.limit
      ));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter teams
  const filteredTeams = teams.filter(
    t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle expand
  const toggleTeam = id => {
    setTeams(ts => ts.map(t => t.id === id ? { ...t, open: !t.open } : t));
  };

  // Add team
  const handleAddSubmit = e => {
    e.preventDefault();
    if (!formDeadline) return;
    const newTeam = {
      id: Date.now(),
      title: formTitle,
      description: formDescription,
      limit: +formLimit,
      members: 0,
      open: false,
      deadline: formDeadline
    };
    setTeams([newTeam, ...teams]);
    setFormTitle(''); setFormDescription(''); setFormLimit(1); setFormDeadline('');
    setShowAdd(false);
  };

  // Open join modal
  const handleJoinClick = id => { setCurrentTeamId(id); setShowJoin(true); };

  // Submit join
  const handleJoinSubmit = e => {
    e.preventDefault();
    if (!joinName || !joinPhone) return;
    const key = `team_${currentTeamId}`;
    const existing = getCookie(key) ? JSON.parse(getCookie(key)) : [];
    const updated = [...existing, { name: joinName, phone: joinPhone }];
    setCookie(key, JSON.stringify(updated));
    setTeams(ts => ts.map(t => t.id === currentTeamId ? { ...t, members: t.members + 1 } : t));
    setJoinName(''); setJoinPhone(''); setShowJoin(false); setCurrentTeamId(null);
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1>GoodHub</h1>
        <div>
          <button className="button" onClick={() => setShowAdd(true)}>＋ Add</button>
          <button className="button" onClick={() => setShowSearch(true)}>🔍 Search</button>
        </div>
      </header>

      {/* Teams */}
      <div className="team-list">
        {filteredTeams.map(team => {
          const saved = getCookie(`team_${team.id}`) ? JSON.parse(getCookie(`team_${team.id}`)) : [];
          const names = saved.map(m => m.name).join(', ');
          return (
            <div key={team.id} className={`team-card ${team.open ? 'open' : ''}`}>
              <div className="title-row">
                <h2>{team.title}</h2>
                <div>
                  <span className="members">{team.members}/{team.limit}</span>
                  <span className="deadline">Ends: {new Date(team.deadline).toLocaleString()}</span>
                  <button className="button" onClick={() => handleJoinClick(team.id)}>Join</button>
                  <button className="button" onClick={() => toggleTeam(team.id)}>
                    {team.open ? '▲' : '▼'}
                  </button>
                </div>
              </div>
              {team.open && (
                <>
                  <p className="description"><strong>Description:</strong>{team.description}</p>
                  {saved.length > 0 && <p className="teammates">Teammates: {names}</p>}
                </>
              )}
            </div>
          );
        })}
        {filteredTeams.length === 0 && <p className="no-results">No teams found.</p>}
      </div>

      {/* Add Modal */}
      {showAdd && (
      <>
          <div
            className="overlay"
            onClick={() => setShowAdd(false)}
          />
          <div className="window" tabIndex={0}>
            <div className="window__title-bar">
              <div className="window__title">Create New Team</div>
              <button
                className="window__btn"
                onClick={() => setShowAdd(false)}
              >
                &times;
                <span className="visually-hidden">Close</span>
              </button>
            </div>

            <div className="window__body">
              <form onSubmit={handleAddSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />

                <label>Description</label>
                <textarea
                  placeholder="Description"
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  required
                />

                <label>Member limit</label>
                <input
                  type="number"
                  placeholder="Limit"
                  value={formLimit}
                  onChange={e => setFormLimit(e.target.value)}
                  min="1"
                  required
                />

                <label>Deadline</label>
                <input
                  type="datetime-local"
                  value={formDeadline}
                  onChange={e => setFormDeadline(e.target.value)}
                  required
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                    marginTop: '1rem'
                  }}
                >
                  <button type="submit" className="window__btn">
                    r<span className="visually-hidden">r</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="window__status-bar">
              GoodHub → Teams → Create
            </div>
          </div>
        </>
      )}

      {/* Search Modal */}
      {showSearch && (
        <>
          <div
            className="overlay"
            onClick={() => setShowSearch(false)}
          />
          <div className="window" tabIndex={0}>
            <div className="window__title-bar">
              <div className="window__title">Search Teams</div>
              <button
                className="window__btn"
                onClick={() => setShowSearch(false)}
              >
                &times;
                <span className="visually-hidden">Close</span>
              </button>
            </div>

            <div className="window__body">
              <input
                type="text"
                placeholder="Enter keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem' }}
              />
            </div>
            <div className="window__status-bar">
              GoodHub → Teams → Search
            </div>
          </div>
        </>
      )}

      {/* Join Modal */}
      {showJoin && (
        <>
          <div
            className="overlay"
            onClick={() => setShowJoin(false)}
          />

          <div className="window" tabIndex={0}>
            <div className="window__title-bar">
              <div className="window__title">Join Team</div>
              <button
                className="window__btn"
                onClick={() => setShowJoin(false)}
              >
                &times;
                <span className="visually-hidden">Close</span>
              </button>
            </div>

            <div className="window__body">
              <form onSubmit={handleJoinSubmit}>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={joinName}
                  onChange={e => setJoinName(e.target.value)}
                  required
                />

                <label style={{ marginTop: '1rem' }}>Phone</label>
                <input
                  type="tel"
                  placeholder="Your phone"
                  value={joinPhone}
                  onChange={e => setJoinPhone(e.target.value)}
                  required
                />

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '1.5rem'
                }}>
                  <button
                    type="submit"
                    className="window__btn"
                  >
                    r
                    <span className="visually-hidden">r</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="window__status-bar">
              GoodHub → Teams → Join
            </div>
          </div>
        </>
      )}
    </div>
  );
}

