import { useEffect, useState, useRef } from 'react'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  // State for new event highlighting
  const [newEventId, setNewEventId] = useState(null);
  
  // State for events list with coordinates
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Community Cleanup",
      location: "Downtown Community Park",
      name: "dj",
      date: "May 15, 2025",
      volunteers: 12,
      category: "Education & Youth",
      isNew: false,
      coordinates: [40.7128, -74.0060] // Default coordinates for initial event
    }
  ]);
  
  // Form and popup states
  const [showPopup, setShowPopup] = useState(false);
  const [viewPopup, setViewPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    volunteers: '',
    category: '',
    description: ''
  });
  
  // Search states
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  
  // Refs for map and markers
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const markersRef = useRef({});
  
  // Flask backend URL - change this to your actual Flask server URL
  const FLASK_URL = 'http://localhost:5000';
  
  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const openViewPopup = (event) => {
    setSelectedEvent(event);
    setViewPopup(true);
  };

  // Function to close the view popup
  const closeViewPopup = () => {
    setViewPopup(false);
  };
 
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Extract the field name from the id (remove 'event-' prefix)
    const field = id.replace('event-', '');
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  
  // Function to geocode an address and return coordinates
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          displayName: result.display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };
  
  // Handle search with keydown event
  const handleSearchKeyDown = async (e) => {
    // Check if the Enter key was pressed
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior
      
      if (!searchInput.trim()) {
        alert('Please enter an address or ZIP code');
        return;
      }
      
      const result = await geocodeAddress(searchInput);
      
      if (result) {
        setSearchResults(result);
        
        // Center map on the found location
        if (mapRef.current) {
          mapRef.current.setView([result.latitude, result.longitude], 15);
          
          // Remove existing search marker if any
          if (markerRef.current) {
            markerRef.current.remove();
          }
          
          // Add a marker at the found location
          markerRef.current = L.marker([result.latitude, result.longitude])
            .addTo(mapRef.current)
            .bindPopup(`<b>${result.displayName}</b>`)
            .openPopup();
        } else {
          console.error("Map reference is not available");
        }
      } else {
        alert('No results found for the given address');
      }
    }
  };
  
  // Function to create event markers on map
  const createEventMarkers = (eventsArray) => {
    if (!mapRef.current) return;
    
    // Clear existing event markers
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    
    // Reset markers object
    markersRef.current = {};
    
    // Create new markers for each event
    eventsArray.forEach(event => {
      if (event.coordinates) {
        const eventMarker = L.marker(event.coordinates)
          .addTo(mapRef.current)
          .bindPopup(`
              <h3 style="margin: 0 0 8px; color: #4CAD4C;">${event.title}</h3>
              <p style="margin: 4px 0;"><strong>📍 Location:</strong> ${event.location}</p>
              <p style="margin: 4px 0;"><strong>🗓️ Date:</strong> ${event.date}</p>
              <p style="margin: 4px 0;"><strong>👥 Volunteers:</strong> ${event.volunteers}</p>
              <p style="margin: 4px 0;"><strong>❤️ Category:</strong> ${event.category}</p>
          `);
        
        // Store marker reference with event id
        markersRef.current[event.id] = eventMarker;
      }
    });
  };
  
  // Function to handle login redirect with current page as return URL
  const handleLoginRedirect = () => {
    // Get current URL to return to after login
    const returnUrl = encodeURIComponent(window.location.href);
    // Redirect to Flask login with return URL as parameter
    window.location.href = `${FLASK_URL}/?redirect_url=${returnUrl}`;
  };
  
  // Function to handle form submission with geocoding
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.location || !formData.date || 
        !formData.volunteers || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Show loading state
    // You could add a loading spinner here
    
    // Geocode the location
    const geocodeResult = await geocodeAddress(formData.location);
    
    if (!geocodeResult) {
      alert('Could not find coordinates for the provided location. Please enter a valid address.');
      return;
    }
    
    // Generate a unique ID for the new event
    const newId = Date.now();
    
    // Create the new event object with coordinates
    const newEvent = {
      id: newId,
      title: formData.title,
      location: formData.location,
      date: formatDate(formData.date),
      volunteers: formData.volunteers,
      category: getCategoryName(formData.category),
      description: formData.description,
      isNew: true, // Flag to mark this as a new event for animation
      coordinates: [geocodeResult.latitude, geocodeResult.longitude]
    };
    
    // Add the new event to the beginning of the events array
    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    
    // Center map on new event location
    if (mapRef.current) {
      mapRef.current.setView([geocodeResult.latitude, geocodeResult.longitude], 15);
    }
    
    // Update markers on the map
    setTimeout(() => {
      createEventMarkers(updatedEvents);
    }, 100);
    
    // Set the new event ID for highlighting
    setNewEventId(newId);
    
    // Close the popup
    closePopup();
    
    // Reset form data
    setFormData({
      title: '',
      location: '',
      date: '',
      volunteers: '',
      category: '',
      description: ''
    });
    
    // Remove the "new" flag after animation completes
    setTimeout(() => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === newId ? {...event, isNew: false} : event
        )
      );
      setNewEventId(null);
    }, 5000);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getCategoryName = (categoryValue) => {
    const categories = {
      'education': 'Education & Youth',
      'health': 'Health & Wellness',
      'environment': 'Environment & Conservation',
      'arts': 'Arts & Culture'
    };
    return categories[categoryValue] || categoryValue;
  };
  
  const getRandomColor = () => {
    const colors = [
      '#FFD166', // Yellow
      '#FF88BC', // Pink
      '#A367DC', // Purple
      '#4CAD4C', // Green
      '#66C3FF'  // Blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Function to handle view event from map popup
  const handleViewEventFromMap = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      openViewPopup(event);
    }
  };
  
  // Map initialization effect
  useEffect(() => {
    // Initialize map centered on NYC
    const map = L.map('map', {}).setView([40.7128, -74.0060], 13);
    
    // IMPORTANT: Store the map reference
    mapRef.current = map;
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    // Create event markers for initial events
    createEventMarkers(events);
    
    // Add global function to handle clicking "View Details" in popup
    window.viewEvent = (eventId) => {
      handleViewEventFromMap(eventId);
    };
    
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    
    const mapElement = document.getElementById('map');
    if (mapElement) {
      resizeObserver.observe(mapElement);
    }
    
    return () => {
      map.remove();
      if (mapElement) {
        resizeObserver.disconnect();
      }
      // Clean up global function
      delete window.viewEvent;
    };
  }, []); // Empty dependency array for initial setup
  
  // Update markers when events change
  useEffect(() => {
    createEventMarkers(events);
  }, [events]);
  
  return (
    <div className='layout-a'>
      <div className="navi-bar">
        <div className="title">GoodHub</div>
        <div className="nav-btn">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/Team" className="nav-item">FindTeam</Link>
          {/* Replace static login div with a clickable div that redirects */}
          <div className="nav-item" onClick={handleLoginRedirect} style={{cursor: 'pointer'}}>Login</div>
        </div>
      </div>
      
      <div className='flex-container'> 
        <div id="map"></div>
        <div className="sidebar">
          {/* Search container with results display */}
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Enter ZIP code or address and press Enter" 
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
            />          
          <div className="category">
            <div className="category-item">Education & Youth</div>
            <div className="category-item">Health & Wellness</div>
            <div className="category-item">Environment & Conservation</div>
            <div className="category-item">Arts & Culture</div>
          </div>
          
          {/* Event List with New Event Animations */}
          <div className="event-list">
            {events.map(event => (
              <div 
                className={`event-list-item ${event.isNew ? 'new-event' : ''}`} 
                key={event.id}
                onClick={() => {
                  // Center map on this event's location and open popup
                  if (event.coordinates && mapRef.current) {
                    mapRef.current.setView(event.coordinates, 15);
                    const marker = markersRef.current[event.id];
                    if (marker) {
                      marker.openPopup();
                    }
                  }
                }}
              >
                {/* Add new badge and confetti for new events */}
                {event.isNew && (
                  <>
                    <div className="new-badge">✨ New!</div>
                    <div className="confetti-container">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div 
                          key={index}
                          className="confetti"
                          style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 1.5}s`,
                            backgroundColor: getRandomColor()
                          }}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="event-style-circle"></div>
                <div className="event-description" key={event.id}>
                  
                  <div className="event-name" >{event.title}</div>
                  {event.id === 1 && (
                    <Link to="/Profile" className="event-name">{event.name}</Link>
                  )}
                  <div className="event-location">
                    <span className="icon">📍</span> {event.location}
                  </div>
                  <div className="event-date">
                    <span className="icon">🗓️</span> {event.date}
                  </div>
                  <div className="event-volunteer">
                    <span className="icon">👥</span> {event.volunteers} volunteers needed
                  </div>
                  <div className="event-category">
                    <span className="icon">❤️ </span> {event.category}
                  </div>
                </div>
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent onClick
                  openViewPopup(event);
                }}>View</button>
              </div>
            ))}
          </div>
          
          <button onClick={openPopup} className="event-creation">✨ Create Event</button>
        </div>
      </div>
      
      {/* Event Creation Popup Overlay */}
      {showPopup && (
        <div className="popup-pos">
          <div className="popup">
            <div className="popup-header">
              <div className="sparkle-container">
                <div className="sparkle s1"></div>
                <div className="sparkle s2"></div>
                <div className="sparkle s3"></div>
              </div>
              ✨ Create Magical Event ✨
            </div>
            
            <form className="magical-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="event-title">Event Title</label>
                <input 
                  type="text" 
                  id="event-title" 
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Magic Under the Stars" 
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="event-location">Location</label>
                  <input 
                    type="text" 
                    id="event-location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter a valid address (will be geocoded)" 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="event-date">Date</label>
                  <input 
                    type="date" 
                    id="event-date" 
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="event-volunteers">Volunteers Needed</label>
                  <input 
                    type="number" 
                    id="event-volunteers" 
                    value={formData.volunteers}
                    onChange={handleInputChange}
                    min="1" 
                    placeholder="How many volunteers needed?" 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="event-category">Category</label>
                  <select 
                    id="event-category" 
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="education">Education & Youth</option>
                    <option value="health">Health & Wellness</option>
                    <option value="environment">Environment & Conservation</option>
                    <option value="arts">Arts & Culture</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="event-description">Description</label>
                <textarea 
                  id="event-description" 
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Tell us about your magical event..."
                  required
                ></textarea>
              </div>
              
              <div className="map-selection">
                <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: '600', color: '#7A6C36' }}>
                  Location Information
                </h3>
                <p className="map-hint">
                  Please enter a valid address above. The location will be automatically geocoded and marked on the map.
                </p>
              </div>
            
              <div className="form-actions">
                <button type="button" className="btn-close" onClick={closePopup}>Cancel</button>
                <button type="submit" className="btn-submit">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event View Popup Overlay */}
      {viewPopup && selectedEvent && (
        <div className="view-popup-overlay" onClick={closeViewPopup}>
          <div className="view-popup" onClick={(e) => e.stopPropagation()}>
            <div className="view-header">
              <h2 className="view-title">{selectedEvent.title}</h2>
              <button className="view-close" onClick={closeViewPopup}>×</button>
            </div>

            <div className="view-content">
              <div className="view-detail">
                <span className="view-icon">📍</span>
                <div className="view-text">{selectedEvent.location}</div>
              </div>

              <div className="view-detail">
                <span className="view-icon">🗓️</span>
                <div className="view-text">{selectedEvent.date}</div>
              </div>

              <div className="view-detail">
                <span className="view-icon">👥</span>
                <div className="view-text">{selectedEvent.volunteers} volunteers needed</div>
              </div>

              <div className="view-detail">
                <span className="view-icon">🏷️</span>
                <div className="view-text">{selectedEvent.category}</div>
              </div>

              {selectedEvent.description && (
                <div className="view-description">
                  <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', opacity: 0.9 }}>Description</h3>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedEvent.description || "No description provided."}</p>
                </div>
              )}
              
              <button className="join-button">
                <Link to="/Team" >Join the Match</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;