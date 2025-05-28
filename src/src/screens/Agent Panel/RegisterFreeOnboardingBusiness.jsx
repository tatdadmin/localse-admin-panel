import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  SERVICES_TYPE_LIST_SERVICE_PROVIDER,
  SHARE_LOCATION_OF_PROVIDER,
} from "../../apis/Apis";

const RegisterFreeOnboardingBusiness = () => {
  // State management

  const location = useParams();
  console.log(location,"poiuytrewsdfg")
  const { phoneNumber, type } = location || {};
  const [formData, setFormData] = useState({
    phoneNumber: phoneNumber,   
    address: "",
    service: "",
    photograph: null,
    name: "",
    businessAddress: "",
    gstNumber: "",
    keywords: "",
    latitude: "",
    longitude: "",
  });

  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [toasts, setToasts] = useState([]);

  const fileInputRef = useRef(null);

  // Services list
  // const services = [
  //   "Plumbing",
  //   "Electrical",
  //   "Carpentry",
  //   "Painting",
  //   "Cleaning",
  //   "AC Repair",
  //   "Appliance Repair",
  //   "Home Maintenance",
  //   "Gardening",
  //   "Pest Control",
  // ];

  useEffect(() => {
    getServices();
  }, []);
  const [services, setservices] = useState([]);
  const getServices = async () => {
    try {
      const res = await SERVICES_TYPE_LIST_SERVICE_PROVIDER();
      console.log(res, "SERVICES_TYPE_LIST_SERVICE_PROVIDER");
      setservices(res?.data);
    } catch (err) {
      console.log(err);
    }
  };
  // Toast notification function
  const showToast = (message, type = "error") => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  // File handling
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showToast("File size should be less than 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, photograph: e.target.result }));
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
      setShowPhotoModal(false);
    }
  };

  // Keyword functions
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords((prev) => [...prev, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (indexToRemove) => {
    setKeywords((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  // Update formData when keywords change
  useEffect(() => {
    if (keywords.length > 0) {
      setFormData((prev) => ({ ...prev, keywords: keywords.join(", ") }));
    }
  }, [keywords]);

  // Location save function
  const handleSaveLocation = async () => {
    if (!formData.latitude.trim() || !formData.longitude.trim()) {
      showToast("Please enter both latitude and longitude", "error");
      return;
    }

    setLocationLoading(true);

    try {
      // Simulate API call for saving location
      const response = await SHARE_LOCATION_OF_PROVIDER({
        latitude: formData.latitude,
        longitude: formData.longitude,
        service_provider_mobile_number: phoneNumber,
      });
    } catch (error) {
      showToast("Failed to save location. Please try again.", "error");
    } finally {
      setLocationLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!formData.photograph) {
      showToast("Business image is required", "error");
      return false;
    }
    if (!formData.latitude.trim() || !formData.longitude.trim()) {
      showToast("Please enter both latitude and longitude", "error");
      return false;
    }
    if (!formData.name.trim()) {
      showToast("Business name is required", "error");
      return false;
    }
    if (!formData.address.trim()) {
      showToast("Business address is required", "error");
      return false;
    }
    if (!formData.service) {
      showToast("Please select a service", "error");
      return false;
    }
    return true;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setRegistrationLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast("Registration successful!", "success");

      // Reset form
      setFormData({
        phoneNumber: "",
        address: "",
        service: "",
        photograph: null,
        name: "",
        businessAddress: "",
        gstNumber: "",
        keywords: "",
        latitude: "",
        longitude: "",
      });
      setKeywords([]);
      setSelectedFile(null);
    } catch (error) {
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Toast Container */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert alert-${
              toast.type === "success" ? "success" : "danger"
            } alert-dismissible fade show mb-2 shadow-sm`}
            role="alert"
            style={{ minWidth: "280px", maxWidth: "350px" }}
          >
            <i
              className={`fas ${
                toast.type === "success"
                  ? "fa-check-circle"
                  : "fa-exclamation-triangle"
              } me-2`}
            ></i>
            <span className="small">{toast.message}</span>
            <button
              type="button"
              className="btn-close btn-close-sm"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            ></button>
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {registrationLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1055 }}
        >
          <div
            className="bg-white rounded p-4 text-center shadow-lg mx-3"
            style={{ maxWidth: "300px" }}
          >
            <div
              className="spinner-border text-success mb-3"
              style={{ width: "2.5rem", height: "2.5rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-dark mb-2">Processing Registration...</h5>
            <p className="text-muted mb-0 small">
              Please wait while we set up your account
            </p>
          </div>
        </div>
      )}

      {/* Header with Back Button */}
      {/* <div className="bg-white shadow-sm sticky-top" style={{zIndex: 1020}}>
        <div className="container py-3">
          <button className="btn btn-link text-danger p-0 fs-5" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left me-2"></i>
            <span className="fs-6">Back</span>
          </button>
        </div>
      </div> */}

      {/* Main Content - Fully Scrollable */}
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="bg-white rounded shadow">
              {/* Hero Section */}
              <div className="bg-success bg-gradient text-white p-4 p-md-5 text-center rounded-top">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <h1 className="h3 h-md-2 fw-bold mb-3">
                      Join Our Network of Service Providers
                    </h1>
                    <p className="mb-0 fs-6 fs-md-5 opacity-90">
                      Complete your registration to become a verified service
                      provider and start connecting with customers in your area
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-4 p-md-5">
                <div className="row g-4 g-lg-5">
                  {/* Left Column */}
                  <div className="col-12 col-lg-6">
                    {/* Profile Photo */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold h6 mb-3">
                        Business Image <span className="text-danger">*</span>
                      </label>
                      {!formData.photograph ? (
                        <div
                          className="border border-success border-2 border-dashed rounded p-4 text-center hover-shadow"
                          style={{
                            cursor: "pointer",
                            minHeight: "200px",
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => setShowPhotoModal(true)}
                        >
                          <i
                            className="fas fa-camera text-success mb-3"
                            style={{ fontSize: "3rem" }}
                          ></i>
                          <h6 className="text-success fw-semibold mb-2">
                            Upload Business Image
                          </h6>
                          <p className="text-muted mb-0 small">
                            Click to select an image (Max 5MB)
                          </p>
                        </div>
                      ) : (
                        <div className="position-relative d-inline-block w-100">
                          <img
                            src={formData.photograph}
                            alt="Business"
                            className="rounded shadow img-fluid w-100"
                            style={{
                              height: "200px",
                              objectFit: "cover",
                              maxWidth: "300px",
                            }}
                          />
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded opacity-0 hover-overlay"
                            style={{
                              backgroundColor: "rgba(0,0,0,0.6)",
                              cursor: "pointer",
                              transition: "opacity 0.3s",
                            }}
                            onClick={() => setShowPhotoModal(true)}
                          >
                            <span className="text-white fw-semibold">
                              Change Photo
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Business Location Coordinates */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold h6 mb-3">
                        Business Location Coordinates{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="row g-3 mb-3">
                        <div className="col-12 col-sm-6">
                          <label className="form-label small text-muted">
                            Latitude
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            placeholder="e.g., 28.6139"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                latitude: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="form-label small text-muted">
                            Longitude
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            placeholder="e.g., 77.2090"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                longitude: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Save Location Button */}
                      <button
                        onClick={handleSaveLocation}
                        className="btn btn-outline-success w-100 py-3"
                        disabled={
                          locationLoading ||
                          !formData.latitude.trim() ||
                          !formData.longitude.trim()
                        }
                      >
                        {locationLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Saving Location...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Save Location
                          </>
                        )}
                      </button>

                      <small className="text-muted d-block mt-2">
                        <i className="fas fa-info-circle me-1"></i>
                        Enter the exact coordinates of your business location
                      </small>
                    </div>

                    {/* Service Selection */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold h6 mb-3">
                        Select Your Service{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <button
                          className="btn btn-outline-secondary dropdown-toggle w-100 text-start py-3"
                          type="button"
                          onClick={() =>
                            setShowServiceDropdown(!showServiceDropdown)
                          }
                        >
                          <span
                            className={
                              formData.service ? "text-dark" : "text-muted"
                            }
                          >
                            {formData.service || "Select your service"}
                          </span>
                        </button>
                        {showServiceDropdown && (
                          <div
                            className="dropdown-menu show w-100 mt-1 shadow"
                            style={{ maxHeight: "250px", overflowY: "auto" }}
                          >
                            {services.map((service, index) => (
                              <button
                                key={index}
                                className="dropdown-item py-2 px-3"
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, service }));
                                  setShowServiceDropdown(false);
                                }}
                              >
                                {service}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-12 col-lg-6">
                    {/* Business Name */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold h6 mb-3">
                        Business Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter your business name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Business Address */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold h6 mb-3">
                        Business Address <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="4"
                        placeholder="Enter your complete business address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      ></textarea>
                    </div>

                    {/* Keywords */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold h6 mb-3">
                        Keywords{" "}
                        <small className="text-muted fw-normal">
                          (Optional)
                        </small>
                      </label>

                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Add keywords for better visibility"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <button
                          className="btn btn-success px-3"
                          type="button"
                          onClick={addKeyword}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      <div
                        className="border rounded p-3 bg-light"
                        style={{ minHeight: "120px" }}
                      >
                        {keywords.length === 0 ? (
                          <div className="text-center py-3">
                            <i
                              className="fas fa-tags text-muted mb-2"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                            <p className="text-muted mb-0 small">
                              No keywords added yet
                            </p>
                          </div>
                        ) : (
                          <>
                            <small className="text-muted d-block mb-2">
                              Click on keyword to remove
                            </small>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              {keywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="badge bg-success d-flex align-items-center gap-1 py-2 px-3"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "0.85rem",
                                  }}
                                  onClick={() => removeKeyword(index)}
                                >
                                  {keyword}
                                  <i className="fas fa-times ms-1"></i>
                                </span>
                              ))}
                            </div>
                            <small className="text-success fw-semibold">
                              {keywords.length} keywords selected
                            </small>
                          </>
                        )}
                      </div>
                    </div>

                    {/* GST Number */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold h6 mb-3">
                        GST Number{" "}
                        <small className="text-muted fw-normal">
                          (Optional)
                        </small>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter your GST number"
                        value={formData.gstNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gstNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-5 pt-4 border-top">
                  <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                      <button
                        onClick={handleSubmit}
                        className="btn btn-success w-100 py-3 fs-5 fw-semibold shadow"
                        disabled={registrationLoading}
                        style={{ borderRadius: "10px" }}
                      >
                        {registrationLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Processing Registration...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle me-2"></i>
                            Complete Registration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered mx-3">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">
                  Upload Business Image
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPhotoModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center p-4">
                <div className="mb-4">
                  <i
                    className="fas fa-camera text-success"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </div>
                <h6 className="mb-3">Choose a Professional Image</h6>
                <p className="text-muted mb-4">
                  Choose a clear, professional image that represents your
                  business well. Good lighting and minimal background work best.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />

                <div className="d-grid gap-3">
                  <button
                    className="btn btn-success py-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fas fa-image me-2"></i>
                    Choose from Gallery
                  </button>

                  <button
                    className="btn btn-outline-secondary py-2"
                    onClick={() => setShowPhotoModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        body {
          overflow: scroll;
        }

        .hover-overlay:hover {
          opacity: 1 !important;
        }

        @media (max-width: 576px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        .dropdown-menu.show {
          animation: fadeIn 0.2s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterFreeOnboardingBusiness;
