import React, { useEffect, useState } from "react";
import axios from "axios";
import { Phone, MapPin, Send, CheckCircle, AlertCircle, X, Plus, Check } from "lucide-react";
import { API_BASE_URL } from "../../constant/path";
import { useSelector } from "react-redux";
import store from "../../redux/store";
import { GET_SERVICES, SEND_SUBSCIPTION_MESSAGE } from "../../apis/Apis";
import { useLocation } from 'react-router-dom';

const BuySubscription = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const mobile = params.get('mobile');
  const videoUrl_from_url = params.get('videoUrl');
  const [mobileNumber, setMobileNumber] = useState(mobile || "");
  const [radius, setRadius] = useState('5');
  const [videoUrl, setVideoUrl] = useState(videoUrl_from_url || "");
  const [language, setLanguage] = useState("hindi");
  const [businessData, setBusinessData] = useState({});
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  // New states for service type selection
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  
  // New states for business service type selection
  const [selectedBusinessServices, setSelectedBusinessServices] = useState([]);
  const [showBusinessServiceDropdown, setShowBusinessServiceDropdown] = useState(false);

  const jwt_token = store.getState().userAuth.jwt;
  
  useEffect(() => {
    if (mobile) {
      setMobileNumber(mobile);
    }
    if (videoUrl_from_url) {
      setVideoUrl(videoUrl_from_url);
    }
  }, [mobile, videoUrl_from_url]);

  const lookupServiceProvider = async () => {
    setLoading(true);
    setErrors({});
    try {
      if (mobileNumber.length !== 10) {
        setErrors({ mobile: "Enter a valid 10-digit number" });
        setLoading(false);
        return;
      }
console.log({
  service_provider_mobile_number: mobileNumber,
  range: radius,
  include_services: selectedBusinessServices.length > 0 ? selectedBusinessServices : undefined,
})
// return false
      const response = await axios.post(
        `${API_BASE_URL}admin_panel/get-service-provider-detail-forwhatsapp`,
        {
          service_provider_mobile_number: mobileNumber,
          range: radius,
          include_services: selectedBusinessServices.length > 0 ? selectedBusinessServices : undefined,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt_token}`,
          },
        }
      );

      const { data, sp_data } = response.data;

      setBusinessData({
        business_name: sp_data.business_name,
        service_type: sp_data.service_type,
        target_area_code: sp_data.target_area_code,
      });

      const numbers = data.map((item) => item.service_provider_mobile_number);
      setTargetNumbers(numbers);
    } catch (error) {
      setErrors({ api: "Failed to fetch service provider details" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    setLoading(true);
    setErrors({});
    try {
      const payload = {
        source_mobile_number: mobileNumber,
        radius: radius,
        video_url: videoUrl,
        language: language,
        business_name: businessData.business_name,
        service_type: businessData.service_type,
        target_area_code: businessData.target_area_code,
        target_mobile_numbers: targetNumbers,
        include_services: selectedServices,
        business_include_services: selectedBusinessServices,
      };

      const res = await SEND_SUBSCIPTION_MESSAGE({
        ...payload,
      });
      console.log(res);

      console.log("Campaign payload sent:", payload);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrors({ api: "Failed to send campaign" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMobileNumber("");
    setRadius("5");
    setVideoUrl("");
    setLanguage("hindi");
    setBusinessData({});
    setTargetNumbers([]);
    setErrors({});
    setSuccess(false);
    setSelectedServices([]);
    setSelectedBusinessServices([]);
    setShowServiceDropdown(false);
    setShowBusinessServiceDropdown(false);
  };

  const handleRemove = (numberToRemove) => {
    console.log(numberToRemove)
    setTargetNumbers(prevNumbers => prevNumbers.filter(num => num !== numberToRemove));
  };

  const getActiveServices = async () => {
    setServicesLoading(true);
    try {
      const res = await GET_SERVICES();
      console.log(res,"ACTIVE SERVICES");
      setAvailableServices(res?.data || []);
    } catch (error) {
      console.log(error);
      setErrors({ services: "Failed to load services" });
    } finally {
      setServicesLoading(false);
    }
  };

  // const handleServiceToggle = (serviceType) => {
  //   setSelectedServices(prev => {
  //     const isSelected = prev.includes(serviceType);
  //     if (isSelected) {
  //       return prev.filter(s => s !== serviceType);
  //     } else {
  //       return [...prev, serviceType];
  //     }
  //   });
  // };

  // const handleSelectAll = () => {
  //   if (selectedServices.length === availableServices.length) {
  //     setSelectedServices([]);
  //   } else {
  //     setSelectedServices(availableServices.map(service => service.service_type));
  //   }
  // };

  // const removeSelectedService = (serviceToRemove) => {
  //   setSelectedServices(prev => prev.filter(s => s !== serviceToRemove));
  // };

  const handleBusinessServiceToggle = (serviceType) => {
    // alert(serviceType)
    setSelectedBusinessServices(prev => {
      const isSelected = prev.includes(serviceType);
      if (isSelected) {
        return prev.filter(s => s !== serviceType);
      } else {
        return [...prev, serviceType];
      }
    });
  };

  const handleBusinessSelectAll = () => {
    if (selectedBusinessServices.length === availableServices.length) {
      setSelectedBusinessServices([]);
    } else {
      setSelectedBusinessServices(availableServices.map(service => service.service_type));
    }
  };

  const removeSelectedBusinessService = (serviceToRemove) => {
    setSelectedBusinessServices(prev => prev.filter(s => s !== serviceToRemove));
  };

  useEffect(() => {
    getActiveServices();
  }, []);

  return (
    <div className="container py-5">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          height: 100%;
          overflow-y: auto;
          font-family: 'Inter', sans-serif;
        }
        
        .service-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
        }
        
        .service-item {
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .service-item:hover {
          background-color: #f8f9fa;
        }
        
        .service-item.selected {
          background-color: #e7f3ff;
        }
        
        .selected-services-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .selected-service-tag {
          background-color: #e7f3ff;
          color: #0066cc;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
      
      <h2 className="text-center mb-4 text-primary">Campaign Creator</h2>

      {!success && (
        <div className="card p-4 shadow">
          <h5>
            <Phone className="me-2" size={20} /> Campaign Details
          </h5>

          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label>Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter 10-digit mobile number"
              />
              {errors.mobile && (
                <small className="text-danger">
                  <AlertCircle className="me-1" size={16} />
                  {errors.mobile}
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label>Radius (km)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="e.g. 5.5"
              />
            </div>
          </div>

          {/* Service Type Selection */}
         

          <button
            className="btn btn-primary w-100 mb-4"
            onClick={lookupServiceProvider}
            disabled={loading || !mobileNumber || !radius}
          >
            {loading ? "Looking up..." : "Get Business Info"}
          </button>

          {errors.api && <div className="alert alert-danger">{errors.api}</div>}

          {businessData.business_name && (
            <>
              <h5>
                <MapPin className="me-2" size={20} /> Business Info
              </h5>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Area Code</label>
                  <input
                    className="form-control"
                    value={businessData.target_area_code || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label>Business Name</label>
                  <input
                    className="form-control"
                    value={businessData.business_name || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label>Service Type</label>
                  <div className="position-relative">
                    <div className="input-group">
                      <input
                        className="form-control"
                        value={businessData.service_type || ""}
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowBusinessServiceDropdown(!showBusinessServiceDropdown)}
                        disabled={servicesLoading}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Business Service Dropdown */}
                    {showBusinessServiceDropdown && (
                      <div className="service-dropdown">
                        {/* Select All Option */}
                        <div 
                          className="service-item fw-bold"
                          onClick={handleBusinessSelectAll}
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              {selectedBusinessServices.length === availableServices.length ? (
                                <Check size={16} className="text-success" />
                              ) : (
                                <div style={{ width: 16, height: 16, border: '2px solid #dee2e6', borderRadius: 2 }}></div>
                              )}
                            </div>
                            Select All ({availableServices.length})
                          </div>
                        </div>
                        
                        {/* Individual Services */}
                        {availableServices.map((service) => (
                          <div
                            key={service._id}
                            className={`service-item ${selectedBusinessServices.includes(service.service_type) ? 'selected' : ''}`}
                            onClick={() => handleBusinessServiceToggle(service.service_type)}
                          >
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                {selectedBusinessServices.includes(service.service_type) ? (
                                  <Check size={16} className="text-success" />
                                ) : (
                                  <div style={{ width: 16, height: 16, border: '2px solid #dee2e6', borderRadius: 2 }}></div>
                                )}
                              </div>
                              <div>
                                <div className="fw-medium">{service.service_type}</div>
                                <small className="text-muted">{service.service_category}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Business Services Display */}
                  {selectedBusinessServices.length > 0 && (
                    <div className="selected-services-container">
                      {selectedBusinessServices.map((serviceType) => (
                        <div key={serviceType} className="selected-service-tag">
                          {serviceType}
                          <button
                            type="button"
                            className="btn-close btn-close-sm"
                            style={{ fontSize: '0.7rem' }}
                            onClick={() => removeSelectedBusinessService(serviceType)}
                          ></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {targetNumbers.length > 0 && (
            <>
              <h5 className="mb-2">Target Numbers</h5>
              <p>
                {targetNumbers.length} numbers found in {radius} km
                {selectedServices.length > 0 && (
                  <span className="text-muted"> (filtered by {selectedServices.length} service types)</span>
                )}
              </p>
              <div
                className="border p-3 mb-4 rounded"
                style={{ maxHeight: 200, overflowY: "auto" }}
              >
                <div className="row">
                  {targetNumbers.map((num, index) => (
                    <div
                      className="col-6 col-md-4 mb-2"
                      key={`${num}-${index}`}
                    >
                      <div className="d-flex align-items-center bg-light px-2 py-1 rounded">
                        <code className="flex-grow-1 bg-transparent">{num}</code>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2 p-1"
                          onClick={() => handleRemove(num)}
                          style={{ 
                            border: 'none', 
                            background: 'transparent',
                            padding: '2px 4px',
                            lineHeight: 1
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label>Video URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label>Campaign Language</label>
                <select
                  className="form-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="hindi" key={language} >Hindi</option>
                  <option key={language} value="english">English</option>
                </select>
              </div>

              <button
                className="btn btn-success w-100"
                onClick={sendCampaign}
                disabled={loading || !videoUrl || !language}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="me-2" size={18} />
                    Send Campaign
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}

      {success && (
        <div className="text-center">
          <CheckCircle size={64} className="text-success mb-3" />
          <h4 className="text-success">Campaign Sent Successfully!</h4>
          <p className="text-muted">
            Sent to {targetNumbers.length} numbers in a {radius} km radius
            {selectedServices.length > 0 && (
              <span> for {selectedServices.length} service types</span>
            )}
          </p>
          <button className="btn btn-primary mt-3" onClick={reset}>
            Create New Campaign
          </button>
        </div>
      )}
    </div>
  );
};

export default BuySubscription;