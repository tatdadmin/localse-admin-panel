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
  const [selectedAreaCode, setSelectedAreaCode] = useState('all');
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

  // API call to fetch service providers data
  const getMapData = async () => {
    try {
      setIsLoading(true);
      const res = await SERVICES_TYPE_GET_MAP_DATA();
      const providers = res?.data || [];
      setServiceProviders(providers);
      
      // Log for debugging
      console.log('Fetched service providers:', providers.length);
    } catch (error) {
      console.error('Error fetching map data:', error);
      setServiceProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
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
      // { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Filter providers based on selected category and area code
  const filteredProviders = useMemo(() => {
    let filtered = [...serviceProviders]; // Create a copy
    
    console.log('Filtering providers:', {
      total: serviceProviders.length,
      selectedCategory,
      selectedAreaCode
    });
    
    // Filter by category - only filter if not 'all'
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(provider => 
        provider.service_provider_type === selectedCategory
      );
    }
    
    // Filter by area code - only filter if not 'all'
    if (selectedAreaCode !== 'all') {
      filtered = filtered.filter(provider => 
        provider.target_area_code == selectedAreaCode
      );
    }
    
    console.log('Filtered providers count:', filtered.length);
    return filtered;
  }, [serviceProviders, selectedCategory, selectedAreaCode]);

  // Get unique categories from all service providers
  const categories = useMemo(() => {
    if (serviceProviders.length === 0) return ['all'];
    
    const uniqueCategories = [...new Set(
      serviceProviders
        .map(p => p.service_provider_type)
        .filter(Boolean) // Remove null/undefined values
    )];
    
    return ['all', ...uniqueCategories.sort()];
  }, [serviceProviders]);

  // Get unique area codes from all service providers
  const areaCodes = useMemo(() => {
    if (serviceProviders.length === 0) return ['all'];
    
    const uniqueAreaCodes = [...new Set(
      serviceProviders
        .map(p => p.target_area_code)
        .filter(code => code && code !== 'None') // Remove null, undefined, and 'None'
    )];
    
    return ['all', ...uniqueAreaCodes.sort()];
  }, [serviceProviders]);

  // Clear all markers from map
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  }, []);

  // Add markers to map based on filtered providers
  const addMarkersToMap = useCallback(() => {
    if (!mapInstanceRef.current || !window.L) {
      console.warn('Map or Leaflet not ready');
      return;
    }

    console.log('Adding markers for', filteredProviders.length, 'providers');

    // Always clear existing markers first
    clearMarkers();

    if (filteredProviders.length === 0) {
      console.log('No providers to display');
      return;
    }

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
            ${serviceType ? serviceType.charAt(0) : 'S'}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    };

    const validProviders = [];

    filteredProviders.forEach((provider) => {
      if (!provider.business_address_lat_long) {
        console.warn('Provider missing coordinates:', provider.business_name);
        return;
      }

      const coords = provider.business_address_lat_long.split(',');
      if (coords.length !== 2) {
        console.warn('Invalid coordinates format:', provider.business_address_lat_long);
        return;
      }

      const [lat, lng] = coords.map(Number);
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn('Invalid coordinates values:', lat, lng);
        return;
      }

      validProviders.push(provider);
      
      try {
        const color = serviceColors[provider.service_type] || serviceColors.default;
        
        const marker = window.L.marker([lat, lng], {
          icon: createCustomIcon(color, provider.service_type)
        });

        marker.addTo(mapInstanceRef.current);

        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h6 style="margin-bottom: 8px; color: #0d6efd;">${provider.business_name || 'N/A'}</h6>
            <p style="margin-bottom: 4px;"><strong>Service:</strong> ${provider.service_type || 'N/A'}</p>
            <p style="margin-bottom: 4px;"><strong>Mobile:</strong> ${provider.service_provider_mobile_number || 'N/A'}</p>
            <p style="margin-bottom: 4px;"><strong>Type:</strong> ${provider.service_provider_type || 'N/A'}</p>
            <p style="margin-bottom: 4px;"><strong>Area Code:</strong> ${provider.target_area_code || 'N/A'}</p>
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

    console.log('Successfully added', validProviders.length, 'markers');

    // Adjust map view to show all markers
    if (validProviders.length > 0) {
      try {
        if (validProviders.length === 1) {
          const [lat, lng] = validProviders[0].business_address_lat_long.split(',').map(Number);
          mapInstanceRef.current.setView([lat, lng], 12);
        } else {
          const group = new window.L.featureGroup(markersRef.current);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
      } catch (error) {
        console.error('Error adjusting map view:', error);
      }
    }
  }, [filteredProviders, clearMarkers, serviceColors]);

  // Initialize the map
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
        console.log('Map is ready');
        // Add markers after a short delay to ensure everything is loaded
        setTimeout(() => {
          if (filteredProviders.length > 0) {
            addMarkersToMap();
          }
        }, 200);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [addMarkersToMap, filteredProviders]);

  // Load Leaflet and initialize map
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

  // Update markers when filtered providers change
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current._loaded) {
      const timeoutId = setTimeout(() => {
        addMarkersToMap();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [filteredProviders, addMarkersToMap]);

  // Calculate service type statistics
  const getServiceTypeCount = () => {
    const counts = {};
    filteredProviders.forEach(provider => {
      const serviceType = provider.service_type || 'Unknown';
      counts[serviceType] = (counts[serviceType] || 0) + 1;
    });
    return counts;
  };

  const serviceCounts = getServiceTypeCount();

  // Reset filters function
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedAreaCode('all');
  };

  return (
    <div className="container-fluid p-0" style={{ height: '80vh' }}>
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-4 col-lg-3 bg-light border-end overflow-auto">
          <div className="p-3">
            
            
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading service providers...</p>
              </div>
            ) : (
              <>
                {/* Reset Filters Button */}
                {(selectedCategory !== 'all' || selectedAreaCode !== 'all') && (
                  <div className="mb-3">
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={resetFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Area Code Filter */}
                <div className="mb-4">
                  <h6 className="text-muted">Filter by Area Code</h6>
                  <select 
                    className="form-select form-select-sm"
                    value={selectedAreaCode}
                    onChange={(e) => setSelectedAreaCode(e.target.value)}
                  >
                    <option value="all">All Area Codes</option>
                    {areaCodes.filter(code => code !== 'all').map(areaCode => (
                      <option key={areaCode} value={areaCode}>
                        {areaCode}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <h6 className="text-muted">Filter by Type</h6>
                  <select 
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {categories.filter(category => category !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category}
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

                  {/* No Results Message */}
                  {!isLoading && filteredProviders.length === 0 && (
                    <div className="text-center p-3">
                      <p className="text-muted">No service providers found for the selected filters.</p>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={resetFilters}
                      >
                        Show All Providers
                      </button>
                    </div>
                  )}
                </div>
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
          {/* <button
            className={`btn btn-primary position-absolute ${locationLoading ? 'disabled' : ''}`}
            style={{ 
              bottom: '150px', 
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
          </button> */}

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
    </div>
  );
};

export default ServiceProvidersMap;