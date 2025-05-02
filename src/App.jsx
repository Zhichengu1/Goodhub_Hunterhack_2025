import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize map centered on NYC
    const map = L.map('map', {}).setView([40.7128, -74.0060], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

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
    };
  }, []);

  return (
    <div className='layout-a'>
      <div className='navi-bar'>
        <div className='header-container'>
          <div className=''>GoodHub</div>
          <div className='nav-btn'>
            <div>Home</div>
            <div>FindTeam</div>
            
          </div>
          
        </div>
      </div>
      <div className='flex-container'> 
        <div id="map"></div>
        <div className="sidebar">
          <div>Search Bar</div>
          <div>category</div>
          <div>Event listing</div>
        </div>
      </div>
    </div>
  );
  
}

export default App;