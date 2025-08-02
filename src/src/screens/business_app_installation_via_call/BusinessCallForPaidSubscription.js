
import React, { useState, useEffect } from "react";
import {
  GET_BUSINESS_APP_INSTALLATION_VIA_CALL,
  GET_BUSINESS_ENQUIRY_SUPPORT_DATA,
  GET_DATA_FOR_BUSINESS_APPLICATION,
  GET_DATA_FOR_CALL_FOR_SUBSCRIPTION,
  HANDLE_CALLS_FOR_BUSINESS_APPLICATIONS,
  SAVE_BUSINESS_APP_INSTALLATION_VIA_CALL,
  UPDATE_BUSINESS_ENQUIRY_SUPPORT_DATA,
  UPDATE_DATA_FOR_CALL_FOR_SUBSCRIPTION,
} from "../../apis/Apis";

const BusinessCallForPaidSubscription = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); // New state for submit loading
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [callLaterDateTime, setCallLaterDateTime] = useState("");
  const [remarks, setRemarks] = useState("");

  function formatUTCDate(isoDateString) {
    const date = new Date(isoDateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  const getData = async () => {
    try {
      setLoading(true);
      const res = await GET_DATA_FOR_CALL_FOR_SUBSCRIPTION();
      console.log(res,"GET_DATA_FOR_CALL_FOR_SUBSCRIPTION") ;
    //   return false

      if (res.status_code === 200) {
        setData(res.data);
        setError(null);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };
  const [err, seterr] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async () => {
    if (!status) {
      alert("Please select a status");
      return;
    }

    if (status === "CALL_LATER" && !callLaterDateTime) {
      alert("Please select a date and time for call later");
      return;
    }

    try {
      setSubmitLoading(true); // Start submit loading
      
      const payload = {
        _id:data?._id,
        b_rm_calling_status: status,
        service_provider_mobile_number:
          data?.service_provider_mobile_number || "",
        b_rm_remarks: remarks.trim(),
        b_rm_call_later:
          status === "CALL_LATER"
            ? new Date(callLaterDateTime).toISOString()
            : null,
      };

      console.log("Submitting payload:", payload);

      // return false
      const res = await UPDATE_DATA_FOR_CALL_FOR_SUBSCRIPTION(payload);
      if (res?.status_code === 200) {
        // alert("Status updated successfully!");
        setRemarks("");
        setCallLaterDateTime("");
        setStatus("");
        setLoading(true);
        getData();
      } else {
        alert("Failed to update status. Please try again.");
        console.error("API failed:", res);
      }
    } catch (err) {
      console.error("API Error:", err);
      seterr(JSON.stringify(err));
      // alert(JSON.stringify(err), "An error occurred. Please check the console.");
    } finally {
      setSubmitLoading(false); // Stop submit loading
    }
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f0f2f5",
          margin: 0,
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1rem",
        }}
      >
        <div className="d-flex justify-content-center">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#19598c" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f0f2f5",
          margin: 0,
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1rem",
        }}
      >
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f2f5",
        margin: 0,
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // minHeight: "100vh",
        fontSize: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              color: "#333",
              margin: 0,
            }}
          >
            Business Call For Paid subscription{`\n`}
            {err}
          </h1>
        </div>

        {data && (
          <div>
            {/* Contact Info */}
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Service Provider Mobile:</strong>{" "}
                {data.service_provider_mobile_number || "N/A"}
              </p>
              <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Service Provider Name:</strong> {data.business_name || "N/A"}
              </p>

              {/* <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Registration Date:</strong>{" "}
                {formatUTCDate(data.registration_date) || "N/A"}
              </p> */}

              <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Address:</strong>{" "}
                {data.business_address || "N/A"}
              </p>
              <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Service Type</strong>{" "}
                {data.service_type || "N/A"}
              </p>
              <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Subscription Amount : </strong>{" "}
                {data.amount || "N/A"}
              </p>
              <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Payment Paid Date</strong>{" "}
                {formatUTCDate(data.add_date) || "N/A"}
              </p>
              <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                <strong>Subscription End Date</strong>{" "}
                {formatUTCDate(data.subscription_end_date) || "N/A"}
              </p>

              {data.b_rm_calling_status && (
                <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                  <strong>RM Call Status:</strong>{" "}
                  {data.b_rm_calling_status || "N/A"}
                </p>
              )}
              {data.service_provider_type && (
                <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                  <strong>Registration Date:</strong>{" "}
                  {formatUTCDate(data.registration_date)  || "N/A"}
                </p>
              )}
              {/* <p style={{ fontSize: "1.2rem" }}>
                <strong>Service Type:</strong> {data.service_type || "N/A"}
              </p> */}

              {data.b_rm_calling_status == "CALL_LATER" && (
                <p style={{ margin: "0.2rem 0", fontSize: "1.2rem" }}>
                  <strong>RM Call Later:</strong>{" "}
                  {formatUTCDate(data.b_rm_call_later) || "N/A"}
                </p>
              )}
            </div>

            {/* Business Address */}
            {/* <div style={{ }}> */}

            {/* </div> */}

            {/* Status Update Section */}
            <div>
              <select
                id="status"
                value={status}
                onChange={handleStatusChange}
                required
                disabled={submitLoading} // Disable form when submitting
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  border: "1px solid #ddd",
                  borderRadius: "0.5rem",
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                  opacity: submitLoading ? 0.6 : 1, // Visual feedback when disabled
                }}
              >
                <option value="">Select</option>
                <option value="DISCUSSED">Discussed</option>
                <option value="NOT_RESPONDING">Not Responding</option>
                <option value="CALL_LATER">Call Later</option>
                <option value="NOT_INTERESTED">Not Interested</option>
              </select>

              {status === "CALL_LATER" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="callLaterDateTime"
                    style={{
                      fontSize: "1.2rem",
                      display: "block",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Select Call Later Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    id="callLaterDateTime"
                    name="callLaterDateTime"
                    value={callLaterDateTime}
                    onChange={(e) => setCallLaterDateTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    disabled={submitLoading} // Disable form when submitting
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.5rem",
                      fontSize: "1.2rem",
                      opacity: submitLoading ? 0.6 : 1, // Visual feedback when disabled
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="remarks"
                  style={{
                    fontSize: "1.2rem",
                    display: "block",
                    marginBottom: "0.2rem",
                  }}
                >
                  Remarks:
                </label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Enter your remarks here"
                  disabled={submitLoading} // Disable form when submitting
                  style={{
                    width: "100%",
                    padding: "0.7rem",
                    border: "1px solid #ddd",
                    borderRadius: "0.5rem",
                    fontSize: "1.2rem",
                    resize: "vertical",
                    opacity: submitLoading ? 0.6 : 1, // Visual feedback when disabled
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitLoading} // Disable button when submitting
                style={{
                  marginTop: "1rem",
                  padding: "0.8rem 2rem",
                  fontSize: "1.3rem",
                  color: "#fff",
                  backgroundColor: submitLoading ? "#95a5a6" : "#19598c", // Change color when loading
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: submitLoading ? "not-allowed" : "pointer", // Change cursor when loading
                  transition: "background-color 0.3s ease",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseOver={(e) => {
                  if (!submitLoading) {
                    e.target.style.backgroundColor = "#0d3e63";
                  }
                }}
                onMouseOut={(e) => {
                  if (!submitLoading) {
                    e.target.style.backgroundColor = "#19598c";
                  }
                }}
              >
                {submitLoading ? (
                  <>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #fff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default BusinessCallForPaidSubscription;