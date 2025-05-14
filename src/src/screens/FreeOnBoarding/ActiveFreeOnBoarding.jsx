import React, { useEffect, useState } from "react";

const ActiveFreeOnBoarding = ({ data }) => {
  const [sortField, setSortField] = useState("business_name");
  const [ascending, setAscending] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setAscending(!ascending);
    } else {
      setSortField(field);
      setAscending(true);
    }
  };

  const getSortedData = () => {
    return [...data].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string") {
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return ascending ? valA - valB : valB - valA;
      }
    });
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return ascending ? " ▲" : " ▼";
    }
    return "";
  };

  const truncateAddress = (address, maxLength = 60) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + "...";
  };

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2
          style={{ marginBottom: "20px", fontSize: "24px", color: "#1f2937" }}
        >
          ✅ Active Service Providers
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "16px", color: "#4b5563" }}>
              Total Active Providers:{" "}
              <span style={{ fontWeight: "bold", color: "#16a34a" }}>
                {data?.length}
              </span>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(to right, rgb(31, 41, 55), rgb(34, 197, 94))",
                    color: "white",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{ padding: "14px", cursor: "pointer" }}
                    onClick={() => handleSort("business_name")}
                  >
                    🏪 Business Name{renderSortIcon("business_name")}
                  </th>
                  <th
                    style={{ padding: "14px", cursor: "pointer" }}
                    onClick={() => handleSort("service_provider_mobile_number")}
                  >
                    📱 Contact Number
                    {renderSortIcon("service_provider_mobile_number")}
                  </th>
                  <th
                    style={{ padding: "14px", cursor: "pointer" }}
                    // onClick={() => handleSort("service_provider_mobile_number")}
                  >
                    Service Type
                    {/* {renderSortIcon("service_provider_mobile_number")} */}
                  </th>
                  <th
                    style={{ padding: "14px", cursor: "pointer" }}
                    onClick={() => handleSort("business_address")}
                  >
                    📍 Address{renderSortIcon("business_address")}
                  </th>
                  <th style={{ padding: "14px", textAlign: "center" }}>
                    📊 Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ padding: "12px", textAlign: "center" }}
                    >
                      No active service providers available
                    </td>
                  </tr>
                ) : (
                  getSortedData().map((provider, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f9fafb" : "#ffffff",
                      }}
                    >
                      <td style={{ padding: "12px", fontWeight: "500" }}>
                        {provider.business_name}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <a
                          href={`tel:${provider.service_provider_mobile_number}`}
                          style={{ color: "#2563eb", textDecoration: "none" }}
                        >
                          {provider.service_provider_mobile_number}
                        </a>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#2563eb",
                          textDecoration: "none",
                        }}
                      >
                        {provider.service_type}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontSize: "14px",
                          color: "#4b5563",
                        }}
                        title={provider.business_address}
                      >
                        {truncateAddress(provider.business_address)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            backgroundColor: "#dcfce7",
                            color: "#16a34a",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {provider.active_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Summary Card */}
            <div
              style={{
                marginTop: "24px",
                backgroundColor: "#ecfdf5",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                border: "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      color: "#065f46",
                      fontSize: "18px",
                    }}
                  >
                    Active Providers Summary
                  </h3>
                  <p style={{ margin: "0", color: "#16a34a" }}>
                    {data.length} service providers are currently active in the
                    system
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#16a34a",
                    color: "white",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {data.length}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActiveFreeOnBoarding;
