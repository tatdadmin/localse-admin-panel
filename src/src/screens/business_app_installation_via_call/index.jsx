import React, { useState, useEffect } from "react";
import {
  GET_BUSINESS_APP_INSTALLATION_VIA_CALL,
  SAVE_BUSINESS_APP_INSTALLATION_VIA_CALL,
} from "../../apis/Apis";

const Business_app_installation_via_call = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      const res = await GET_BUSINESS_APP_INSTALLATION_VIA_CALL();
      // const res = {
      //     status_code:200,
      //     message:"data retrieved successfully",
      //     data:{

      //     service_provider_mobile_number:'sssssss',
      //     business_name:"sadfasdf",
      //     business_address:"asdasdfasdafds",
      //     service_type:"asdafds",
      //     b_rm_call_later:"jdjdjdjd",
      //     service_provider_type:"",
      //     registration_date:"",

      //     }

      //     }
      console.log(res);

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
      const payload = {
        b_rm_calling_status: status,
        service_provider_mobile_number: data?.service_provider_mobile_number || "",
        b_rm_remarks: remarks.trim(),
        b_rm_call_later: status === "CALL_LATER" ? new Date(callLaterDateTime).toISOString() : null,
      };
  
      console.log("Submitting payload:", payload);
  
      const res = await SAVE_BUSINESS_APP_INSTALLATION_VIA_CALL(payload);
  
      if (res?.status_code === 200) {
        alert("Status updated successfully!");
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
      alert("An error occurred. Please check the console.");
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
          fontSize: "1.2rem",
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
          fontSize: "1.2rem",
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
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "2.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          {/* <img src="https://play-lh.googleusercontent.com/_U5IxKacvFUxm3Bh8lRrJS3y04oPnYw3jJotA7lgVs71zFFX9jGehkjv767rUNm_PQ=w480-h960-rw" alt="Company Logo" style={{ width: '60px' }} /> */}
          <h1
            style={{
              fontSize: "2rem",
              color: "#333",
              margin: 0,
            }}
          >
            Manage Business App Installation
          </h1>
          {/* <div style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#19598c',
                        color: '#fff',
                        fontSize: '1.2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                    }}>
                        Active
                    </div> */}
        </div>

        {data && (
          <div>
            {/* Contact Info */}
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
                <strong>Service Provider Mobile:</strong>{" "}
                {data.service_provider_mobile_number || "N/A"}
              </p>
              <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
                <strong>Business Name:</strong> {data.business_name || "N/A"}
              </p>
              <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
                <strong>Service Type:</strong> {data.service_type || "N/A"}
                {/* {data.service_provider_type || "N/A"} |{" "} */}
                {/* {data.registration_date || "N/A"} */}
              </p>
            </div>

            {/* Business Address */}
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
                <strong>Registration Date</strong>{" "}
                {formatUTCDate(data.registration_date) || "N/A"}
              </p>
              <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
                <strong>Business Address:</strong>{" "}
                {data.business_address || "N/A"}
              </p>

              {data.b_rm_calling_status && (
                <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
                  <strong>RM Call Status:</strong>{" "}
                  {data.b_rm_calling_status || "N/A"}
                </p>
              )}

              {data.b_rm_calling_status == "CALL_LATER" && (
                <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
                  <strong>RM Call Later:</strong>{" "}
                  {formatUTCDate(data.b_rm_call_later) || "N/A"}
                </p>
              )}
            </div>

            {/* Status Update Section */}
            <div>
              <select
                id="status"
                value={status}
                onChange={handleStatusChange}
                required
                style={{
                  width: "100%",
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "0.5rem",
                  fontSize: "1.2rem",
                  marginBottom: "1.5rem",
                }}
              >
                <option value="">Select</option>
                <option value="DISCUSSED">Discussed</option>
                <option value="NOT_RESPONDING">Not Responding</option>
                <option value="CALL_LATER">Call Later</option>
                <option value="NOT_INTERSTED">Not Interested</option>
              </select>
              {status === "CALL_LATER" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    htmlFor="callLaterDateTime"
                    style={{
                      fontSize: "1.2rem",
                      display: "block",
                      marginBottom: "0.5rem",
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
                    min={new Date().toISOString().slice(0, 16)} // disallow past date/time
                    style={{
                      width: "100%",
                      padding: "1rem",
                      border: "1px solid #ddd",
                      borderRadius: "0.5rem",
                      fontSize: "1.2rem",
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="remarks"
                  style={{
                    fontSize: "1.2rem",
                    display: "block",
                    marginBottom: "0.5rem",
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
                  style={{
                    width: "100%",
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "0.5rem",
                    fontSize: "1.2rem",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 2.5rem",
                  fontSize: "1.5rem",
                  color: "#fff",
                  backgroundColor: "#19598c",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  width: "100%",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0d3e63")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#19598c")}
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Business_app_installation_via_call;
