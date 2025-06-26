import React, { useState } from 'react';
import { Upload, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const BuySubscription = () => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessData, setBusinessData] = useState({});
  const [radius, setRadius] = useState('');
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Simulate API call for mobile number lookup
  const lookupMobileNumber = async (number) => {
    setLoading(true);
    setErrors({});
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (number.length < 10) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
      setLoading(false);
      return;
    }

    // Dummy data response
    const dummyData = {
      target_area_code: '022',
      business_name: 'TechSolutions Pvt Ltd',
      service_type: 'IT Services'
    };

    setBusinessData(dummyData);
    setStep(2);
    setLoading(false);
  };

  // Simulate API call for getting target numbers based on radius
  const getTargetNumbers = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate dummy phone numbers based on area code
    const dummyNumbers = [];
    for (let i = 0; i < 15; i++) {
      const randomNum = Math.floor(1000000 + Math.random() * 9000000);
      dummyNumbers.push(`${businessData.target_area_code}${randomNum}`);
    }
    
    setTargetNumbers(dummyNumbers);
    setStep(3);
    setLoading(false);
  };

  // Video validation
  const validateVideo = (file) => {
    const errors = {};
    
    if (!file) {
      errors.video = 'Please select a video file';
      return errors;
    }

    // Check file size (15MB = 15 * 1024 * 1024 bytes)
    if (file.size > 15 * 1024 * 1024) {
      errors.video = 'Video file must be less than 15MB';
      return errors;
    }

    // For duration check, we'll simulate it since we can't actually check duration in browser without loading
    // In real scenario, you'd use HTMLVideoElement to check duration
    const simulatedDuration = Math.random() * 70; // Random duration between 0-70 seconds
    if (simulatedDuration > 54) {
      errors.video = 'Video duration must be less than 54 seconds';
      return errors;
    }

    return errors;
  };

  // Handle video upload
  const handleVideoUpload = async (file) => {
    const validationErrors = validateVideo(file);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVideoFile(file);
    setUploading(false);
    setStep(4);
  };

  // Send campaign
  const sendCampaign = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStep(5);
    setLoading(false);
  };

  const resetForm = () => {
    setStep(1);
    setMobileNumber('');
    setBusinessData({});
    setRadius('');
    setTargetNumbers([]);
    setVideoFile(null);
    setErrors({});
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="text-center mb-5 text-dark fw-bold">Campaign Creator</h1>

              {/* Progress indicator */}
              <div className="d-flex justify-content-center mb-5">
                <div className="d-flex align-items-center">
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <React.Fragment key={num}>
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${
                          step >= num ? 'bg-primary' : 'bg-secondary'
                        }`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        {step > num ? <CheckCircle size={20} /> : num}
                      </div>
                      {index < 4 && (
                        <div 
                          className={`${step > num ? 'bg-primary' : 'bg-secondary'}`}
                          style={{ width: '32px', height: '4px' }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="card shadow-lg">
                <div className="card-body p-4">
                  {/* Step 1: Mobile Number Input */}
                  {step === 1 && (
                    <div>
                      <div className="d-flex align-items-center mb-4">
                        <Phone className="text-primary me-2" size={24} />
                        <h2 className="mb-0 fs-4 fw-semibold">Enter Mobile Number</h2>
                      </div>
                      
                      <div className="mb-4">
                        <label className="form-label fw-medium">Mobile Number</label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          maxLength="10"
                        />
                        {errors.mobile && (
                          <div className="text-danger mt-2 d-flex align-items-center">
                            <AlertCircle size={16} className="me-1" />
                            <small>{errors.mobile}</small>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => lookupMobileNumber(mobileNumber)}
                        disabled={loading || !mobileNumber}
                        className="btn btn-primary btn-lg w-100"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Looking up...
                          </>
                        ) : (
                          'Lookup Business Info'
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 2: Business Info & Radius Selection */}
                  {step === 2 && (
                    <div>
                      <div className="d-flex align-items-center mb-4">
                        <MapPin className="text-primary me-2" size={24} />
                        <h2 className="mb-0 fs-4 fw-semibold">Business Information</h2>
                      </div>

                      <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-medium">Area Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={businessData.target_area_code}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-medium">Business Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={businessData.business_name}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-medium">Service Type</label>
                          <input
                            type="text"
                            className="form-control"
                            value={businessData.service_type}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Select Radius (km)</label>
                        <select
                          className="form-select form-select-lg"
                          value={radius}
                          onChange={(e) => setRadius(e.target.value)}
                        >
                          <option value="">Select radius</option>
                          <option value="5">5 km</option>
                          <option value="10">10 km</option>
                          <option value="15">15 km</option>
                          <option value="20">20 km</option>
                          <option value="25">25 km</option>
                        </select>
                      </div>

                      <button
                        onClick={getTargetNumbers}
                        disabled={loading || !radius}
                        className="btn btn-primary btn-lg w-100"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Finding Numbers...
                          </>
                        ) : (
                          'Get Target Numbers'
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 3: Target Numbers Display */}
                  {step === 3 && (
                    <div>
                      <h2 className="fs-4 fw-semibold mb-3">Target Numbers Found</h2>
                      <p className="text-muted mb-4">Found {targetNumbers.length} numbers in {radius}km radius</p>
                      
                      <div className="border rounded p-3 mb-4" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                        <div className="row g-2">
                          {targetNumbers.map((number, index) => (
                            <div key={index} className="col-md-4 col-sm-6">
                              <div className="bg-light p-2 rounded text-center">
                                <small className="font-monospace">{number}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setStep(3.5)}
                        className="btn btn-primary btn-lg w-100"
                      >
                        Continue to Video Upload
                      </button>
                    </div>
                  )}

                  {/* Step 3.5: Video Upload */}
                  {step === 3.5 && (
                    <div>
                      <div className="d-flex align-items-center mb-4">
                        <Upload className="text-primary me-2" size={24} />
                        <h2 className="mb-0 fs-4 fw-semibold">Upload Campaign Video</h2>
                      </div>

                      <div 
                        className="border border-2 border-dashed rounded p-5 text-center mb-4"
                        style={{ borderColor: '#dee2e6' }}
                      >
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleVideoUpload(file);
                          }}
                          className="d-none"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                          <Upload className="text-muted mb-3" size={48} />
                          <h5 className="text-dark">Choose video file</h5>
                          <p className="text-muted mb-0">
                            Maximum size: 15MB | Maximum duration: 54 seconds
                          </p>
                        </label>
                      </div>

                      {errors.video && (
                        <div className="alert alert-danger d-flex align-items-center">
                          <AlertCircle size={16} className="me-2" />
                          <span>{errors.video}</span>
                        </div>
                      )}

                      {uploading && (
                        <div className="text-center">
                          <div className="spinner-border text-primary mb-3" role="status"></div>
                          <p className="text-muted">Uploading video...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Confirm Campaign */}
                  {step === 4 && (
                    <div>
                      <h2 className="fs-4 fw-semibold mb-4">Confirm Campaign Details</h2>
                      
                      <div className="bg-light rounded p-4 mb-4">
                        <div className="row g-3">
                          <div className="col-12 d-flex justify-content-between">
                            <span className="fw-medium">Business:</span>
                            <span>{businessData.business_name}</span>
                          </div>
                          <div className="col-12 d-flex justify-content-between">
                            <span className="fw-medium">Service:</span>
                            <span>{businessData.service_type}</span>
                          </div>
                          <div className="col-12 d-flex justify-content-between">
                            <span className="fw-medium">Area Code:</span>
                            <span>{businessData.target_area_code}</span>
                          </div>
                          <div className="col-12 d-flex justify-content-between">
                            <span className="fw-medium">Radius:</span>
                            <span>{radius} km</span>
                          </div>
                          <div className="col-12 d-flex justify-content-between">
                            <span className="fw-medium">Target Numbers:</span>
                            <span>{targetNumbers.length}</span>
                          </div>
                          <div className="col-12 d-flex justify-content-between">
                            <span className="fw-medium">Video:</span>
                            <span className="text-truncate" style={{ maxWidth: '200px' }}>
                              {videoFile?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={sendCampaign}
                        disabled={loading}
                        className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending Campaign...
                          </>
                        ) : (
                          <>
                            <Send size={20} className="me-2" />
                            Send Campaign
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 5: Success */}
                  {step === 5 && (
                    <div className="text-center">
                      <CheckCircle className="text-success mb-4" size={64} />
                      <h2 className="fs-3 fw-semibold text-success mb-3">Campaign Sent Successfully!</h2>
                      <p className="text-muted mb-4">
                        Your campaign has been sent to {targetNumbers.length} numbers in the {radius}km radius.
                      </p>
                      
                      <button
                        onClick={resetForm}
                        className="btn btn-primary btn-lg"
                      >
                        Create New Campaign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuySubscription;