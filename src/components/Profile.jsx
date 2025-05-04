import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import profilePic from './default.jpg';

function Profile() {
  const [showEdit, setShowEdit] = useState(false);
  const [tempName, setTempName] = useState('Patrick Luo');
  const [tempDesc, setTempDesc] = useState(
    'Hunter College Undergraduate Student, Computer Science Major'
  );
  const [name, setName] = useState(tempName);
  const [desc, setDesc] = useState(tempDesc);

  const openEditor = () => {
    setTempName(name);
    setTempDesc(desc);
    setShowEdit(true);
  };

  const saveChanges = () => {
    setName(tempName);
    setDesc(tempDesc);
    setShowEdit(false);
  };

  const cancelEdit = () => {
    setShowEdit(false);
  };

  return (
    <div className="layout-a">
      <div className="navi-bar">
        <Link to="/" className="title">GoodHub</Link>
        <div className="nav-btn">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/profile_c" className="nav-item">Challenge Board</Link>
          <Link to="/login" className="nav-item">Login</Link>
        </div>
      </div>

      <div className="main">
        <div className="side-bar">
          <div className="user-info">
            <span className="user-avatar"><img src={profilePic} alt="profile picture"/></span>
            <span className="profile-name">{name}</span>
            <div>Volunteer</div>
          </div>

          {/* Display Return to APP button if redirect_url exists */}
          <a href="{redirect_url}" className="return-to-app">
            Return to APP
          </a>

          <ul className="side-bar-menu">
            <li className="side-bar-btn"><a href="#"></a>🏠 Dashboard</li>
            <li className="side-bar-btn"><a href="#"></a>📅 My Event</li>
            <li className="side-bar-btn"><a href="#"></a>👥 My Teams</li>
            <li className="side-bar-btn"><a href="#"></a>⭐️ My Rewards</li>
            <li className="side-bar-btn"><a href="#"></a>🕒 History</li>
            <li className="side-bar-btn"><a href="#"></a>⚙️ Settings</li>
          </ul>
          
        </div>  
        <div className="left-container">
          <img className="profile-pic" src={profilePic} alt="profile picture"/>
          <div className="profile-name">{name}</div>
          <div className="profile-desc">{desc}</div>
          <button className="profile-edit-btn" onClick={openEditor}>
            Edit Your Profile
          </button>

          {showEdit && (
            <div className="popup-overlay">
              <div className="popup-box">
                <h3>Edit Profile</h3>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Name"
                />
                <textarea
                  value={tempDesc}
                  onChange={(e) => setTempDesc(e.target.value)}
                  placeholder="Description"
                />
                <div className="popup-buttons">
                  <button onClick={saveChanges}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="right-container">
          <div className="profile-host">
            <h2 className="section-title">Challenge History</h2>
              <div className="event-hosted">
                <ul>
                  
                  <li>Community volunteer day (May 23rd, 2022)</li>
                  <li>Free food distribution (Setp 15th, 2023)</li>
                </ul>
              </div>
          </div>

          <div className="profile-participate">
            <h2 className="section-title">Event Participated History</h2>
              <div className="event-participated">
                <ul>
                  <li>2019 NYC Marathon</li>
                  <li>2020 Hunter College Volunteer Day</li>
                  <li>2021 NYC Volunteer Fair</li>
                </ul>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;