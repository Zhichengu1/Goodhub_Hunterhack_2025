// src/components/Profile.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './profile.css'; // Import the CSS file

function Profile() {
  return (
    <div className='layout-a'>
      <div className="navi-bar">
        <Link to="/" className="title">GoodHub</Link>
        <div className="nav-btn">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/profile_c" className="nav-item">FindTeam</Link>
          <Link to="/login" className="nav-item">Login</Link>
        </div>
      </div>
      
      <div className="main">
        <div className="left-container">
          <img 
            className="profile-pic" 
            src="https://picx.zhimg.com/70/v2-ab21229c19f2a2bb799f65052247551c_1440w.awebp?source=172ae18b&biz_tag=Post" 
            alt="profile picture" 
          />
          <div className="profile-name">Patrick Luo</div>
          <div className="profile-desc">
            "Description: React applications are made of components. A component is a part of the UI (user interface) that has its own logic and appearance. Components can be as small as a button or as large as an entire page."
          </div>
          <button className="profile-edit-btn" onClick={() => alert('Edit profile functionality will be implemented later')}>
            Edit Your Profile
          </button>
        </div>
        
        <div className="right-container">
          <div className="profile-host">
            <h2 className="section-title">Event Hosted History</h2>
            <div className="event-hosted">Host</div>
            <div className="event-hosted">Host</div>
            <div className="event-hosted">Host</div>
            <div className="event-hosted">Host</div>
            <div className="event-hosted">Host</div>
            <div className="event-hosted">Host</div>
          </div>
          
          <div className="profile-participate">
            <h2 className="section-title">Event Participated History</h2>
            <div className="event-participated">Participate</div>
            <div className="event-participated">Participate</div>
            <div className="event-participated">Participate</div>
            <div className="event-participated">Participate</div>
            <div className="event-participated">Participate</div>
            <div className="event-participated">Participate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;