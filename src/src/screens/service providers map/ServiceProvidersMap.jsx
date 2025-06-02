import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { SERVICES_TYPE_GET_MAP_DATA } from '../../apis/Apis';

const ServiceProvidersMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Service type colors for markers
  const serviceColors = {
    'Bike Mechanic': '#FF6B6B',
    'Birthday Planner': '#4ECDC4',
    'Property Dealer': '#45B7D1',
    'Driver Service': '#96CEB4',
    'default': '#666'
  };

  // Mock API call - replace with your actual API
  const getMapData = async () => {
    try {
      setIsLoading(true);
      // Simulating API call with mock data
      const mockData = [
        {
          _id: '1',
          business_name: 'Delhi Bike Service',
          service_type: 'Bike Mechanic',
          service_provider_type: 'Individual',
          service_provider_mobile_number: '9876543210',
          current_latlong: '28.6139,77.2090'
        },
        {
          _id: '2',
          business_name: 'Party Planners Delhi',
          service_type: 'Birthday Planner',
          service_provider_type: 'Company',
          service_provider_mobile_number: '9876543211',
          current_latlong: '28.6200,77.2100'
        },
        {
          _id: '3',
          business_name: 'Prime Properties',
          service_type: 'Property Dealer',
          service_provider_type: 'Agency',
          service_provider_mobile_number: '9876543212',
          current_latlong: '28.6100,77.2050'
        },
        {
          _id: '4',
          business_name: 'Safe Drive Services',
          service_type: 'Driver Service',
          service_provider_type: 'Individual',
          service_provider_mobile_number: '9876543213',
          current_latlong: '28.6180,77.2120'
        }
      ];
      
      // Replace this with your actual API call:
      const res = await SERVICES_TYPE_GET_MAP_DATA();
      setServiceProviders(res?.data || []);
      
      // setServiceProviders(res);
    } catch (error) {
      console.error('Error fetching map data:', error);
      setServiceProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMapData();
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        if (mapInstanceRef.current && mapInstanceRef.current._loaded) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          
          try {
            // Add user location marker
            const userIcon = window.L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  background-color: #007bff;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                  position: relative;
                ">
                  <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 8px;
                    height: 8px;
                    background-color: white;
                    border-radius: 50%;
                  "></div>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            const userMarker = window.L.marker([latitude, longitude], { icon: userIcon });
            userMarker.addTo(mapInstanceRef.current);
            userMarker.bindPopup('Your Location');
          } catch (error) {
            console.error('Error adding user location marker:', error);
          }
        }
        
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enable location services.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Filter providers based on selected category
  const filteredProviders = useMemo(() => {
    if (selectedCategory === 'all') {
      return serviceProviders;
    }
    return serviceProviders.filter(provider => provider.service_provider_type === selectedCategory);
  }, [serviceProviders, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(serviceProviders.map(p => p.service_provider_type))];
    return ['all', ...uniqueCategories.filter(Boolean)];
  }, [serviceProviders]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  }, []);

  const addMarkersToMap = useCallback(() => {
    if (!mapInstanceRef.current || !window.L) {
      console.warn('Map or Leaflet not ready');
      return;
    }

    if (filteredProviders.length === 0) {
      clearMarkers();
      return;
    }

    clearMarkers();

    const createCustomIcon = (color, serviceType) => {
      return window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">
            ${serviceType.charAt(0)}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    };

    const validProviders = [];

    filteredProviders.forEach((provider) => {
      if (!provider.current_latlong) {
        return;
      }

      const coords = provider.current_latlong.split(',');
      if (coords.length !== 2) {
        return;
      }

      const [lat, lng] = coords.map(Number);
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return;
      }

      validProviders.push(provider);
      
      try {
        const color = serviceColors[provider.service_type] || serviceColors.default;
        
        const marker = window.L.marker([lat, lng], {
          icon: createCustomIcon(color, provider.service_type)
        });

        // Add to map only after marker is fully created
        marker.addTo(mapInstanceRef.current);

        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h6 style="margin-bottom: 8px; color: #0d6efd;">${provider.business_name}</h6>
            <p style="margin-bottom: 4px;"><strong>Service:</strong> ${provider.service_type}</p>
            <p style="margin-bottom: 4px;"><strong>Mobile:</strong> ${provider.service_provider_mobile_number}</p>
            <p style="margin-bottom: 4px;"><strong>Type:</strong> ${provider.service_provider_type || 'N/A'}</p>
            <p style="margin-bottom: 0;"><strong>Location:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        marker.on('click', () => {
          setSelectedProvider(provider);
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('Error creating marker for provider:', provider.business_name, error);
      }
    });

    if (validProviders.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      if (validProviders.length === 1) {
        const [lat, lng] = validProviders[0].current_latlong.split(',').map(Number);
        mapInstanceRef.current.setView([lat, lng], 12);
      } else {
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [filteredProviders, clearMarkers]);

  const initializeMap = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    if (!window.L || !mapRef.current) {
      console.error('Leaflet not loaded or map ref not available');
      return;
    }

    try {
      const map = window.L.map(mapRef.current).setView([28.6139, 77.2090], 10);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 100
      }).addTo(map);

      mapInstanceRef.current = map;
      
      // Wait for map to be ready before adding markers
      map.whenReady(() => {
        if (filteredProviders.length > 0) {
          setTimeout(() => addMarkersToMap(), 100);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [filteredProviders, addMarkersToMap]);

  useEffect(() => {
    const loadLeaflet = async () => {
      // Load CSS first
      if (!document.querySelector('link[href*="leaflet"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(cssLink);
      }

      // Load JS
      if (!window.L) {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          script.onload = () => {
            // Wait a bit more to ensure Leaflet is fully initialized
            setTimeout(() => {
              initializeMap();
              resolve();
            }, 200);
          };
          script.onerror = () => {
            console.error('Failed to load Leaflet');
            resolve();
          };
          document.head.appendChild(script);
        });
      } else {
        initializeMap();
      }
    };

    loadLeaflet();

    return () => {
      clearMarkers();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap, clearMarkers]);

  useEffect(() => {
    // Only add markers if map is ready and we have providers
    if (mapInstanceRef.current && mapInstanceRef.current._loaded && filteredProviders.length >= 0) {
      // Small delay to ensure map is fully ready
      const timeoutId = setTimeout(() => {
        addMarkersToMap();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [filteredProviders, addMarkersToMap]);

  const getServiceTypeCount = () => {
    const counts = {};
    filteredProviders.forEach(provider => {
      counts[provider.service_type] = (counts[provider.service_type] || 0) + 1;
    });
    return counts;
  };

  const serviceCounts = getServiceTypeCount();

  return (
    <div className="container-fluid p-0">
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      <div className="row g-0" style={{ height: '100vh' }}>
        {/* Sidebar */}
        <div className="col-md-4 col-lg-3 bg-light border-end overflow-auto">
          <div className="p-3">
            <h4 className="mb-3 text-primary">Service Providers</h4>
            
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading service providers...</p>
              </div>
            ) : (
              <>
                {/* Category Filter */}
                <div className="mb-4">
                  <h6 className="text-muted">Filter by Type</h6>
                  <select 
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Types' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Statistics */}
                <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '5px' }}>
                {Object.keys(serviceCounts).length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-muted">Service Statistics</h6>
                    {Object.entries(serviceCounts).map(([service, count]) => (
                      <div key={service} className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <div 
                            className="me-2"
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: serviceColors[service] || serviceColors.default,
                              borderRadius: '50%'
                            }}
                          ></div>
                          <small>{service}</small>
                        </div>
                        <span className="badge bg-secondary">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
                </div>
                

                {/* Service Providers List */}
                <h6 className="text-muted mb-3">
                  {selectedCategory === 'all' ? 'All Providers' : selectedCategory} ({filteredProviders.length})
                </h6>
                {filteredProviders.length === 0 ? (
                  <p className="text-muted">No service providers found for selected filter.</p>
                ) : (
                  filteredProviders.map((provider) => (
                    <div 
                      key={provider._id} 
                      className={`card mb-2 cursor-pointer ${selectedProvider?._id === provider._id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedProvider(provider)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-start">
                          <div 
                            className="me-2 mt-1"
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: serviceColors[provider.service_type] || serviceColors.default,
                              borderRadius: '50%'
                            }}
                          ></div>
                          <div className="flex-grow-1">
                            <h6 className="card-title mb-1 fs-6">{provider.business_name}</h6>
                            <p className="card-text mb-1">
                              <small className="text-muted">{provider.service_type}</small>
                            </p>
                            <p className="card-text mb-1">
                              <small className="text-muted">📞 {provider.service_provider_mobile_number}</small>
                            </p>
                            {provider.service_provider_type && (
                              <p className="card-text mb-0">
                                <small className="text-muted">Type: {provider.service_provider_type}</small>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="col-md-8 col-lg-9 position-relative">
          <div 
            ref={mapRef} 
            style={{ 
              height: '100vh', 
              width: '100%' 
            }}
          ></div>
          
          {/* Get My Location Button */}
          <button
            className={`btn btn-primary position-absolute ${locationLoading ? 'disabled' : ''}`}
            style={{ 
              bottom: '20px', 
              right: '20px', 
              zIndex: 1000,
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
            onClick={getCurrentLocation}
            disabled={locationLoading}
            title="Get My Location"
          >
            {locationLoading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="fas fa-crosshairs" style={{ fontSize: '18px' }}>📍</i>
            )}
          </button>

          {isLoading && (
            <div 
              className="position-absolute top-50 start-50 translate-middle"
              style={{ zIndex: 1000 }}
            >
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Provider Details Modal */}
      
    </div>
  );
};

export default ServiceProvidersMap;