import React, { useState, useEffect } from "react";
import {
  MapPin,
  Upload,
  Building,
  FileText,
  Phone,
  Wrench,
  UserPlus,
  MapPin as LocationIcon,
  Save,
} from "lucide-react";
import {
  ADD_NEW_PROVIDER,
  GET_KEYWORDS_BY_SERVICE_TYPE,
  REGISTER_FREE_ONBOARDING_SERVICE_PROVIDER,
  SERVICES_TYPE_LIST_SERVICE_PROVIDER,
  SHARE_LOCATION_OF_PROVIDER,
} from "../../apis/Apis";

const RegistrationFromAdmin = () => {
  const [formData, setFormData] = useState({
    latlong: "",
    latitude: "",
    longitude: "",
    image: null,
    businessName: "",
    businessAddress: "",
    mobileNumber: "",
    gstNumber: "",
    serviceType: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    addLead: false,
    shareLocation: false,
    saveRegistration: false,
  });
  const [completedSteps, setCompletedSteps] = useState({
    addLead: false,
    shareLocation: false,
    saveRegistration: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [keywords, setKeywords] = useState([]);

  // Fetch service types from API
  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const res = await SERVICES_TYPE_LIST_SERVICE_PROVIDER();
      // console.log(res, "SERVICES_TYPE_LIST_SERVICE_PROVIDER");
      setServiceTypes(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name == "serviceType") {
      fetchKeywordsByServiceType(value);
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
            latlong: `${lat},${lng}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get current location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  // Validation functions for each step
  const validateMobileNumber = () => {
    const newErrors = {};
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber =
        "Invalid mobile number format (must be 10 digits starting with 6-9)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLocation = () => {
    const newErrors = {};
    // if (!formData.latlong.trim()) {
    //   newErrors.latlong = "Location coordinates are required";
    // }
    if (!formData.latitude.trim()) {
      newErrors.latitude = "Latitude is required";
    } else if (isNaN(formData.latitude) || Math.abs(formData.latitude) > 90) {
      newErrors.latitude = "Invalid latitude value";
    }
    if (!formData.longitude.trim()) {
      newErrors.longitude = "Longitude is required";
    } else if (
      isNaN(formData.longitude) ||
      Math.abs(formData.longitude) > 180
    ) {
      newErrors.longitude = "Invalid longitude value";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegistration = () => {
    const newErrors = {};
    if (!formData.image) {
      newErrors.image = "Please select an image";
    }
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = "Business address is required";
    }
    if (!formData.serviceType) {
      newErrors.serviceType = "Please select a service type";
    }
    // GST validation (optional but format check if provided)
    if (
      formData.gstNumber.trim() &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gstNumber
      )
    ) {
      newErrors.gstNumber = "Invalid GST number format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchKeywordsByServiceType = async (type) => {
    try {
      const response = await GET_KEYWORDS_BY_SERVICE_TYPE({
        service_type: type,
      });
      // console.log(response, "keywords from service type");

      if (response && response.data) {
        const keywordsArray = response.data
          .split(",")
          .map((keyword) => keyword.trim())
          .filter((keyword) => keyword !== "");
        // console.log(keywordsArray);
        setKeywords(keywordsArray);
      }
    } catch (error) {
      console.log("Error fetching keywords:", error);
    }
  };

  // Step 1: Add New Provider
  const handleAddLead = async () => {
    if (!validateMobileNumber()) {
      return;
    }

    setLoading((prev) => ({ ...prev, addLead: true }));

    try {
      const res = await ADD_NEW_PROVIDER({
        service_provider_mobile_number: formData.mobileNumber,
        service_provider_type: "Free_Onboarding_Business",
      });
      // console.log(res);

      if (res?.msg_type == "error" && res?.status_code == "200") {
        alert(res?.message);
        return false;
      }

      setCompletedSteps((prev) => ({ ...prev, addLead: true }));
      alert("✅ Lead added successfully!");
    } catch (error) {
      console.log(error, "Error adding lead");
      if (error?.status_code == "400") {
        alert("⚠️ " + error?.message);
      }
    } finally {
      setLoading((prev) => ({ ...prev, addLead: false }));
    }
  };

  // Step 2: Share Location
  const handleShareLocation = async () => {
    // alert("p")
    if (!completedSteps.addLead) {
      alert("Please add lead first");
      return;
    }

    if (!validateLocation()) {
      return;
    }

    setLoading((prev) => ({ ...prev, shareLocation: true }));

    try {
      const response = await SHARE_LOCATION_OF_PROVIDER({
        latitude: formData.latitude,
        longitude: formData.longitude,
        service_provider_mobile_number: formData.mobileNumber,
      });

      // console.log("Location shared:", response);
      setCompletedSteps((prev) => ({ ...prev, shareLocation: true }));
      alert("✅ Location shared successfully!");
    } catch (error) {
      console.error("Error sharing location:", error);
      alert("❌ Failed to share location. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, shareLocation: false }));
    }
  };

  // Step 3: Save Registration
  const handleSaveRegistration = async () => {
    if (!completedSteps.addLead) {
      alert("Please add lead first");
      return;
    }

    if (!completedSteps.shareLocation) {
      alert("Please share location first");
      return;
    }

    if (!validateRegistration()) {
      return;
    }

    setLoading((prev) => ({ ...prev, saveRegistration: true }));

    try {
      const formDataToSend = new FormData();

      // Map form data to API expected format
      formDataToSend.append(
        "service_provider_mobile_number",
        formData.mobileNumber
      );
      formDataToSend.append("keywords", keywords);
      formDataToSend.append(
        "business_service_provider_name",
        formData.businessName
      );
      formDataToSend.append("service_type", formData.serviceType);
      formDataToSend.append("service_area", formData.businessAddress);
      formDataToSend.append(
        "service_provider_manual_address",
        formData.businessAddress
      );
      formDataToSend.append("registration_type", "Free_Onboarding_Business");

      // Add GST number (empty string if not provided)
      if (formData.gstNumber && formData.gstNumber.trim() !== "") {
        formDataToSend.append("gst_number", formData.gstNumber);
      } else {
        formDataToSend.append("gst_number", "");
      }

      // Add image if provided
      if (formData.image) {
        formDataToSend.append("service_provider_image", formData.image);
      }

      const response = await REGISTER_FREE_ONBOARDING_SERVICE_PROVIDER(
        formDataToSend
      );
      console.log("Registration saved:", response);

      if (response?.status_code == 200) {
        alert("✅ Registration completed successfully!");
        setCompletedSteps((prev) => ({ ...prev, saveRegistration: true }));

        // Reset form after successful completion
        setFormData({
          latlong: "",
          latitude: "",
          longitude: "",
          image: null,
          businessName: "",
          businessAddress: "",
          mobileNumber: "",
          gstNumber: "",
          serviceType: "",
        });
        setImagePreview(null);
        setCompletedSteps({
          addLead: false,
          shareLocation: false,
          saveRegistration: false,
        });
        setKeywords([]);
      }
      else if(response?.status_code==300){
        alert("oi")
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error?.status_code == "300") {
        alert("⚠️ " + error?.message);
      } else {
        alert("❌ Registration failed. write correct address or Please try again.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, saveRegistration: false }));
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow">
              <div className="card-header bg-primary text-white text-center">
                <h2 className="card-title mb-0">Registration From Admin</h2>
              </div>

              <div className="card-body p-4">
                {/* Progress Steps */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      className={`text-center ${
                        completedSteps.addLead ? "text-success" : "text-muted"
                      }`}
                    >
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                          completedSteps.addLead
                            ? "bg-success text-white"
                            : "bg-light border"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {completedSteps.addLead ? "✓" : "1"}
                      </div>
                      <div className="small mt-1">Add Lead</div>
                    </div>
                    <div
                      className={`flex-grow-1 mx-3 ${
                        completedSteps.addLead ? "bg-success" : "bg-light"
                      }`}
                      style={{ height: "2px" }}
                    ></div>
                    <div
                      className={`text-center ${
                        completedSteps.shareLocation
                          ? "text-success"
                          : "text-muted"
                      }`}
                    >
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                          completedSteps.shareLocation
                            ? "bg-success text-white"
                            : "bg-light border"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {completedSteps.shareLocation ? "✓" : "2"}
                      </div>
                      <div className="small mt-1">Share Location</div>
                    </div>
                    <div
                      className={`flex-grow-1 mx-3 ${
                        completedSteps.shareLocation ? "bg-success" : "bg-light"
                      }`}
                      style={{ height: "2px" }}
                    ></div>
                    <div
                      className={`text-center ${
                        completedSteps.saveRegistration
                          ? "text-success"
                          : "text-muted"
                      }`}
                    >
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                          completedSteps.saveRegistration
                            ? "bg-success text-white"
                            : "bg-light border"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {completedSteps.saveRegistration ? "✓" : "3"}
                      </div>
                      <div className="small mt-1">Save Registration</div>
                    </div>
                  </div>
                </div>

                {/* Step 1: Mobile Number and Add Lead */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                      <UserPlus className="me-2" size={20} />
                      Step 1: Add Lead
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label d-flex align-items-center">
                        <Phone className="me-2" size={16} />
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        className={`form-control ${
                          errors.mobileNumber ? "is-invalid" : ""
                        }`}
                        disabled={completedSteps.addLead}
                      />
                      {errors.mobileNumber && (
                        <div className="invalid-feedback">
                          {errors.mobileNumber}
                        </div>
                      )}
                      <div className="form-text">
                        Enter 10-digit mobile number starting with 6, 7, 8, or 9
                      </div>
                    </div>
                    <button
                      onClick={handleAddLead}
                      disabled={loading.addLead || completedSteps.addLead}
                      className={`btn ${
                        completedSteps.addLead ? "btn-success" : "btn-primary"
                      }`}
                    >
                      {loading.addLead ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Adding Lead...
                        </>
                      ) : completedSteps.addLead ? (
                        <>
                          <UserPlus className="me-2" size={16} />
                          Lead Added ✓
                        </>
                      ) : (
                        <>
                          <UserPlus className="me-2" size={16} />
                          Add Lead
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2: Location Section */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                      <LocationIcon className="me-2" size={20} />
                      Step 2: Share Location
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {/* <div className="col-md-8">
                        <div className="mb-3">
                          <label className="form-label">
                            Lat/Long Coordinates *
                          </label>
                          <input
                            type="text"
                            name="latlong"
                            value={formData.latlong}
                            onChange={handleInputChange}
                            placeholder="e.g., 28.6139,77.2090"
                            className={`form-control ${
                              errors.latlong ? "is-invalid" : ""
                            }`}
                            disabled={completedSteps.shareLocation}
                          />
                          {errors.latlong && (
                            <div className="invalid-feedback">
                              {errors.latlong}
                            </div>
                          )}
                        </div>
                      </div> */}
                      <div className="col-md-4">
                        <label className="form-label">&nbsp;</label>
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          className="btn btn-outline-primary d-block w-100"
                          disabled={completedSteps.shareLocation}
                        >
                          Get Current Location
                        </button>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Latitude *</label>
                          <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            placeholder="e.g., 28.6139"
                            className={`form-control ${
                              errors.latitude ? "is-invalid" : ""
                            }`}
                            disabled={completedSteps.shareLocation}
                          />
                          {errors.latitude && (
                            <div className="invalid-feedback">
                              {errors.latitude}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Longitude *</label>
                          <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            placeholder="e.g., 77.2090"
                            className={`form-control ${
                              errors.longitude ? "is-invalid" : ""
                            }`}
                            disabled={completedSteps.shareLocation}
                          />
                          {errors.longitude && (
                            <div className="invalid-feedback">
                              {errors.longitude}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleShareLocation}
                      disabled={
                        loading.shareLocation ||
                        completedSteps.shareLocation ||
                        !completedSteps.addLead
                      }
                      className={`btn ${
                        completedSteps.shareLocation
                          ? "btn-success"
                          : "btn-primary"
                      }`}
                    >
                      {loading.shareLocation ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sharing Location...
                        </>
                      ) : completedSteps.shareLocation ? (
                        <>
                          <LocationIcon className="me-2" size={16} />
                          Location Shared ✓
                        </>
                      ) : (
                        <>
                          <LocationIcon className="me-2" size={16} />
                          Share Location
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 3: Registration Details */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                      <Save className="me-2" size={20} />
                      Step 3: Save Registration
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Service Type Selection */}
                    <div className="mb-4">
                      <label className="form-label d-flex align-items-center">
                        <Wrench className="me-2" size={16} />
                        Service Type *
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.serviceType ? "is-invalid" : ""
                        }`}
                        disabled={
                          loadingServices || completedSteps.saveRegistration
                        }
                      >
                        <option value="">
                          {loadingServices
                            ? "Loading service types..."
                            : "Select a service type"}
                        </option>
                        {serviceTypes.map((service, index) => (
                          <option key={index} value={service}>
                            {service.charAt(0).toUpperCase() + service.slice(1)}
                          </option>
                        ))}
                      </select>
                      {errors.serviceType && (
                        <div className="invalid-feedback">
                          {errors.serviceType}
                        </div>
                      )}
                    </div>

                    {/* Image Selection */}
                    <div className="mb-4">
                      <label className="form-label d-flex align-items-center">
                        <Upload className="me-2" size={16} />
                        Business Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={`form-control ${
                          errors.image ? "is-invalid" : ""
                        }`}
                        disabled={completedSteps.saveRegistration}
                      />
                      {errors.image && (
                        <div className="invalid-feedback">{errors.image}</div>
                      )}
                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Business Details */}
                    <div className="mb-4">
                      <label className="form-label d-flex align-items-center">
                        <Building className="me-2" size={16} />
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Enter business name"
                        className={`form-control ${
                          errors.businessName ? "is-invalid" : ""
                        }`}
                        disabled={completedSteps.saveRegistration}
                      />
                      {errors.businessName && (
                        <div className="invalid-feedback">
                          {errors.businessName}
                        </div>
                      )}
                    </div>

                    {/* Business Address */}
                    <div className="mb-4">
                      <label className="form-label">
                        Business Manual Address *
                      </label>
                      <textarea
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        placeholder="Enter complete business address"
                        rows="3"
                        className={`form-control ${
                          errors.businessAddress ? "is-invalid" : ""
                        }`}
                        disabled={completedSteps.saveRegistration}
                      />
                      {errors.businessAddress && (
                        <div className="invalid-feedback">
                          {errors.businessAddress}
                        </div>
                      )}
                    </div>

                    {/* GST Number */}
                    <div className="mb-4">
                      <label className="form-label d-flex align-items-center">
                        <FileText className="me-2" size={16} />
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        placeholder="Enter GST number (if applicable)"
                        className={`form-control ${
                          errors.gstNumber ? "is-invalid" : ""
                        }`}
                        disabled={completedSteps.saveRegistration}
                      />
                      {errors.gstNumber && (
                        <div className="invalid-feedback">
                          {errors.gstNumber}
                        </div>
                      )}
                      <div className="form-text">
                        Format: 22AAAAA0000A1Z5 (Leave blank if not applicable)
                      </div>
                    </div>

                    <button
                      onClick={handleSaveRegistration}
                      disabled={
                        loading.saveRegistration ||
                        completedSteps.saveRegistration ||
                        !completedSteps.shareLocation
                      }
                      className={`btn ${
                        completedSteps.saveRegistration
                          ? "btn-success"
                          : "btn-primary"
                      }`}
                    >
                      {loading.saveRegistration ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving Registration...
                        </>
                      ) : completedSteps.saveRegistration ? (
                        <>
                          <Save className="me-2" size={16} />
                          Registration Saved ✓
                        </>
                      ) : (
                        <>
                          <Save className="me-2" size={16} />
                          Save Registration
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
    </>
  );
};

export default RegistrationFromAdmin;
