import React, { useState } from "react";
import axios from "axios";
import { Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../constant/path";
import { useSelector } from "react-redux";
import store from "../../redux/store";
import { SEND_SUBSCIPTION_MESSAGE } from "../../apis/Apis";
import { data } from "react-router-dom";

const BuySubscription = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [radius, setRadius] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [businessData, setBusinessData] = useState({});
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const jwt_token = store.getState().userAuth.jwt; // Replace with real token retrieval logic

  const lookupServiceProvider = async () => {
    setLoading(true);
    setErrors({});
    try {
      if (mobileNumber.length !== 10) {
        setErrors({ mobile: "Enter a valid 10-digit number" });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}admin_panel/get-service-provider-detail-forwhatsapp`,
        {
          service_provider_mobile_number: mobileNumber,
          range: radius,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt_token}`, // Replace with real token
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
      };

      // Simulate API call
      // await new Promise((res) => setTimeout(res, 1500));
      const res = await SEND_SUBSCIPTION_MESSAGE({
        ...payload
      })
      console.log(res)

      // Uncomment this when ready for real call:
      // await axios.post('http://your-api-endpoint/campaign/send', payload, {
      //   headers: { Authorization: 'Bearer YOUR_TOKEN' }
      // });

      console.log("Campaign payload sent:", payload); // for debug
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
    setRadius("");
    setVideoUrl("");
    setLanguage("");
    setBusinessData({});
    setTargetNumbers([]);
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Campaign Creator</h2>

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
                  <input
                    className="form-control"
                    value={businessData.service_type || ""}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}

          {targetNumbers.length > 0 && (
            <>
              <h5 className="mb-2">Target Numbers</h5>
              <p>
                {targetNumbers.length} numbers found in {radius} km
              </p>
              <div
                className="border p-3 mb-4 rounded"
                style={{ maxHeight: 200, overflowY: "auto" }}
              >
                <div className="row">
                  {targetNumbers.map((num, idx) => (
                    <div className="col-6 col-md-4 mb-2" key={idx}>
                      <code className="bg-light px-2 py-1 rounded d-block">
                        {num}
                      </code>
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
                  <option value="">Select language</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
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
            Sent to {targetNumbers.length} numbers in a {radius} km radius.
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
