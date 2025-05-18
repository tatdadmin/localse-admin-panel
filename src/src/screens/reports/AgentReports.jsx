import { useEffect, useState } from "react";
import {
  GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER,
  GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER_WITH_DATE,
  GET_AGENT_TOTEL_REGISTRATIONS,
  GET_AGENT_TOTEL_REGISTRATIONS_WHEN_DATE_NOT_AVALAIBLE,
  GET_AGENTS_LIST_AGENT_WISE,
  GET_AGENTS_LIST_AGENT_WISE_WITHOUT_DATE,
  GET_AGENTS_LIST_REPORT,
} from "../../apis/Apis";

const AgentReports = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [agentReports, setAgentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentListLoading, setAgentListLoading] = useState(false);
  // New state for the popup
  const [showPopup, setShowPopup] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [popupLoading, setPopupLoading] = useState(false);

  // New state for conversion entries modal
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionEntries, setConversionEntries] = useState([]);
  const [conversionModalLoading, setConversionModalLoading] = useState(false);

  // Custom styles
  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Arial",
      position: "relative", // Added for popup positioning
    },
    summaryHeading: {
      marginBottom: "20px",
      fontSize: "24px",
      color: "#1f2937",
    },
    loadingMessage: {
      textAlign: "center",
      padding: "20px",
    },
    dataTable: {
      width: "100%",
      borderCollapse: "collapse",
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      marginTop: "24px",
    },
    tableHeader: {
      background:
        "linear-gradient(to right, rgb(31, 41, 55), rgb(239, 68, 68))",
      color: "white",
      textAlign: "center",
    },
    clickableHeader: {
      padding: "14px",
      minWidth: "130px",
      cursor: "pointer",
    },
    noData: {
      padding: "12px",
      textAlign: "center",
    },
    tableRow: {
      textAlign: "center",
    },
    rowEven: {
      backgroundColor: "#f9fafb",
    },
    rowOdd: {
      backgroundColor: "#ffffff",
    },
    tableCell: {
      padding: "12px",
    },
    activeCell: {
      color: "#059669",
      fontWeight: "500",
    },
    inactiveCell: {
      color: "#dc2626",
      fontWeight: "500",
    },
    clickableCell: {
      cursor: "pointer",
      textDecoration: "underline",
    },
    totalsRow: {
      backgroundColor: "#f3f4f6",
      fontWeight: "bold",
      borderTop: "2px solid #e5e7eb",
      textAlign: "center",
    },
    summaryCards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px",
      marginTop: "24px",
    },
    summaryCard: {
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "500",
    },
    cardValue: {
      fontSize: "24px",
      fontWeight: "700",
      marginTop: "8px",
      cursor: "pointer", // Added to indicate clickable
    },
    cardBlue: {
      backgroundColor: "#f0f9ff",
      border: "1px solid #bae6fd",
      color: "#0c4a6e",
    },
    cardBlueTitle: {
      color: "#0369a1",
    },
    cardGreen: {
      backgroundColor: "#ecfdf5",
      border: "1px solid #a7f3d0",
      color: "#065f46",
    },
    cardGreenTitle: {
      color: "#059669",
    },
    cardRed: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#991b1b",
    },
    cardRedTitle: {
      color: "#dc2626",
    },
    cardPurple: {
      backgroundColor: "#f5f3ff",
      border: "1px solid #ddd6fe",
      color: "#5b21b6",
    },
    cardPurpleTitle: {
      color: "#7c3aed",
    },
    selectContainer: {
      marginBottom: "24px",
    },
    formLabel: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
    },
    formSelect: {
      display: "block",
      width: "100%",
      maxWidth: "400px",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "16px",
    },
    // New styles for popup
    popupOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    popupContent: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "24px",
      width: "90%",
      maxWidth: "80vw",
      maxHeight: "80vh",
      overflow: "auto",
      position: "relative",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    },
    popupHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    popupTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1f2937",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#6b7280",
    },
    popupTable: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
    },
    popupTableHeader: {
      background: "#f3f4f6",
      textAlign: "left",
    },
    popupTableHeaderCell: {
      padding: "12px 16px",
      fontWeight: "500",
      color: "#1f2937",
    },
    popupTableRow: {
      borderBottom: "1px solid #e5e7eb",
    },
    popupTableCell: {
      padding: "12px 16px",
      textAlign: "left",
      verticalAlign: "top",
    },
    addressCell: {
      maxWidth: "300px",
      whiteSpace: "normal",
      lineHeight: "1.5",
    },
  };

  const getAgentConversionReport = async (data) => {
    setPaymentFilter("All")
    try {
      setConversionModalLoading(true);
      setShowConversionModal(true);
      let res;

      if (selectedDate) {
        res = await GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER_WITH_DATE({
          date: data.date,
          agent_number: data.agent_number,
        });
      }else{
        res = await GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER({
            mobile_number: data.agent_number,
          });
      }

      console.log(res, "Agent conversion report Data");

      if (res.status_code === 200 && res.data) {
        setConversionEntries(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setConversionModalLoading(false);
    }
  };

  useEffect(() => {
    // Load the dates list
    getDatesList();

    // By default, show agent list without date
    getAgentsWithoutDate();
  }, []);

  // Load dates list on component mount
  const getDatesList = async () => {
    try {
      setLoading(true);
      const res = await GET_AGENTS_LIST_REPORT();
      console.log(res, "First api - dates list");

      if (res.status_code === 200 && res.data && res.data.length > 0) {
        setDates(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch agents for a specific date
  const getAgentsByDate = async (date) => {
    try {
      setAgentListLoading(true);
      const res = await GET_AGENTS_LIST_AGENT_WISE({
        date: date,
      });
      console.log(res, "Second api - agents for date", date);

      if (res.status_code === 200 && res.data) {
        setAgentReports(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAgentListLoading(false);
    }
  };

  // Get agents list without date (default view)
  const getAgentsWithoutDate = async () => {
    try {
      setAgentListLoading(true);
      const res = await GET_AGENTS_LIST_AGENT_WISE_WITHOUT_DATE();
      console.log(res, "Default api - agents without date");

      if (res.status_code === 200 && res.data) {
        setAgentReports(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAgentListLoading(false);
    }
  };

  // Handle date selection change
  const handleDateChange = (e) => {
    const newSelectedDate = e.target.value;
    setSelectedDate(newSelectedDate);

    if (newSelectedDate) {
      getAgentsByDate(newSelectedDate);
    } else {
      // If "All Dates" is selected
      getAgentsWithoutDate();
    }
  };

  // Calculate total registrations from all agents
  const totalRegistrations = agentReports.reduce(
    (sum, agent) => sum + agent.totalRegistrations,
    0
  );

  // Calculate total conversion entries from all agents
  const totalConversionEntries = agentReports.reduce(
    (sum, agent) => sum + agent.agentConversionEntries,
    0
  );

  // New function to fetch and display service providers
  const getTotalRegistrations = async (data) => {
    console.log(selectedDate, "selected date");
    console.log(data, "selected");

    try {
      setPopupLoading(true);
      setShowPopup(true);

      let res;

      if (selectedDate) {
        // Call API when selectedDate is available
        res = await GET_AGENT_TOTEL_REGISTRATIONS(data);
      } else {
        // Call alternate API when selectedDate is not available
        res = await GET_AGENT_TOTEL_REGISTRATIONS_WHEN_DATE_NOT_AVALAIBLE({
          agent_number: data?.agent_number,
        });
      }

      console.log(res, "Total registrations data");

      if (res.status_code === 200 && res.data) {
        setServiceProviders(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPopupLoading(false);
    }
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Close conversion modal
  const closeConversionModal = () => {
    setShowConversionModal(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  const [paymentFilter, setPaymentFilter] = useState("All");
const [filteredConversionEntries, setFilteredConversionEntries] = useState([]);

// Add this useEffect to filter entries when payment filter or entries change
useEffect(() => {
  if (conversionEntries.length > 0) {
    if (paymentFilter === "All") {
      setFilteredConversionEntries(conversionEntries);
    } else {
      const filtered = conversionEntries.filter(
        entry => entry.payment_status === paymentFilter
      );
      setFilteredConversionEntries(filtered);
    }
  } else {
    setFilteredConversionEntries([]);
  }
}, [paymentFilter, conversionEntries]);

// Add this handler function for payment filter change
const handlePaymentFilterChange = (e) => {
  setPaymentFilter(e.target.value);
};


  return (
    <div style={styles.container}>
      <h2 style={styles.summaryHeading}>Agent Registration Reports</h2>

      {loading ? (
        <div style={styles.loadingMessage}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "10px" }}>Loading dates...</p>
        </div>
      ) : (
        <>
          <div style={styles.selectContainer}>
            <label htmlFor="dateSelect" style={styles.formLabel}>
              Select Date:
            </label>
            <select
              id="dateSelect"
              style={styles.formSelect}
              value={selectedDate}
              onChange={handleDateChange}
            >
              <option value="">All Dates (Default)</option>
              {dates.map((dateItem) => (
                <option key={dateItem._id} value={dateItem._id}>
                  {dateItem._id} ({dateItem.totalRegistrations} registrations)
                </option>
              ))}
            </select>
          </div>

          <div style={styles.summaryCards}>
            <div style={{ ...styles.summaryCard, ...styles.cardBlue }}>
              <div style={{ ...styles.cardTitle, ...styles.cardBlueTitle }}>
                Total Agents
              </div>
              <div style={styles.cardValue}>{agentReports.length}</div>
            </div>
            <div style={{ ...styles.summaryCard, ...styles.cardGreen }}>
              <div style={{ ...styles.cardTitle, ...styles.cardGreenTitle }}>
                Total Registrations
              </div>
              <div style={styles.cardValue}>{totalRegistrations}</div>
            </div>
            <div style={{ ...styles.summaryCard, ...styles.cardPurple }}>
              <div style={{ ...styles.cardTitle, ...styles.cardPurpleTitle }}>
                Total Conversion Entries
              </div>
              <div style={styles.cardValue}>{totalConversionEntries}</div>
            </div>
            <div style={{ ...styles.summaryCard, ...styles.cardRed }}>
              <div style={{ ...styles.cardTitle, ...styles.cardRedTitle }}>
                Selected Date
              </div>
              <div style={styles.cardValue}>{selectedDate || "All Dates"}</div>
            </div>
          </div>

          {agentListLoading ? (
            <div style={styles.loadingMessage}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: "10px" }}>Loading agent data...</p>
            </div>
          ) : (
            <table style={styles.dataTable}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.clickableHeader}>#</th>
                  <th style={styles.clickableHeader}>Agent Name</th>
                  <th style={styles.clickableHeader}>Phone Number</th>
                  <th style={styles.clickableHeader}>Total Registrations</th>
                  <th style={styles.clickableHeader}>Conversion Entries</th>
                </tr>
              </thead>
              <tbody>
                {agentReports.length > 0 ? (
                  agentReports.map((agent, index) => (
                    <tr
                      key={agent.agent_number || index}
                      style={{
                        ...styles.tableRow,
                        ...(index % 2 === 0 ? styles.rowEven : styles.rowOdd),
                      }}
                    >
                      <td style={styles.tableCell}>{index + 1}</td>
                      <td style={styles.tableCell}>{agent.agent_name}</td>
                      <td style={styles.tableCell}>{agent.agent_number}</td>
                      <td
                        onClick={() => {
                          getTotalRegistrations({
                            date: selectedDate,
                            agent_number: agent?.agent_number,
                          });
                        }}
                        style={{
                          ...styles.tableCell,
                          ...styles.clickableCell,
                          ...(agent.totalRegistrations > 0
                            ? styles.activeCell
                            : styles.inactiveCell),
                        }}
                      >
                        {agent.count || agent.totalRegistrations || 0}
                      </td>
                      <td
                        onClick={() => {
                          getAgentConversionReport({
                            date: selectedDate,
                            agent_number: agent?.agent_number,
                          });
                        }}
                        style={{
                          ...styles.tableCell,
                          ...styles.clickableCell,
                          ...((agent.agentConversionEntries ||
                            agent.agentConversionCount ||
                            0) > 0
                            ? styles.activeCell
                            : styles.inactiveCell),
                        }}
                      >
                        {agent.agentConversionEntries ||
                          agent.agentConversionCount ||
                          0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.noData}>
                      No agents data available
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={styles.totalsRow}>
                  <td
                    colSpan="3"
                    style={{ textAlign: "right", padding: "12px" }}
                  >
                    Total:
                  </td>
                  <td style={{ padding: "12px" }}>{totalRegistrations}</td>
                  <td style={{ padding: "12px" }}>{totalConversionEntries}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {/* Popup for Service Providers */}
          {showPopup && (
            <div style={styles.popupOverlay} onClick={closePopup}>
              <div
                style={styles.popupContent}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.popupHeader}>
                  <h3 style={styles.popupTitle}>Service Provider Details</h3>
                  <button style={styles.closeButton} onClick={closePopup}>
                    &times;
                  </button>
                </div>

                {popupLoading ? (
                  <div style={styles.loadingMessage}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: "10px" }}>
                      Loading service provider data...
                    </p>
                  </div>
                ) : (
                  <table style={styles.popupTable}>
                    <thead>
                      <tr style={styles.popupTableHeader}>
                        <th style={styles.popupTableHeaderCell}>#</th>
                        <th style={styles.popupTableHeaderCell}>
                          Service Type
                        </th>
                        <th style={styles.popupTableHeaderCell}>
                          Business Name
                        </th>
                        <th style={styles.popupTableHeaderCell}>
                          Phone Number
                        </th>
                        <th style={styles.popupTableHeaderCell}>
                          Business Address
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceProviders.length > 0 ? (
                        serviceProviders.map((provider, index) => (
                          <tr
                            key={index}
                            style={{
                              ...styles.popupTableRow,
                              backgroundColor:
                                index % 2 === 0 ? "#f9fafb" : "white",
                            }}
                          >
                            <td style={styles.popupTableCell}>{index + 1}</td>
                            <td style={styles.popupTableCell}>
                              {provider.service_type}
                            </td>
                            <td style={styles.popupTableCell}>
                              {provider.business_name}
                            </td>
                            <td style={styles.popupTableCell}>
                              {provider.service_provider_mobile_number}
                            </td>
                            <td
                              style={{
                                ...styles.popupTableCell,
                                ...styles.addressCell,
                              }}
                            >
                              {provider.business_address}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={styles.noData}>
                            No service provider data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* New Modal for Conversion Entries */}
          {/* {showConversionModal && (
            <div style={styles.popupOverlay} onClick={closeConversionModal}>
              <div
                style={styles.popupContent}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.popupHeader}>
                  <h3 style={styles.popupTitle}>Agent Conversion Entries</h3>
                  <button
                    style={styles.closeButton}
                    onClick={closeConversionModal}
                  >
                    &times;
                  </button>
                </div>

                {conversionModalLoading ? (
                  <div style={styles.loadingMessage}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: "10px" }}>
                      Loading conversion data...
                    </p>
                  </div>
                ) : (
                  <table style={styles.popupTable}>
                    <thead>
                      <tr style={styles.popupTableHeader}>
                        <th style={styles.popupTableHeaderCell}>#</th>
                        <th style={styles.popupTableHeaderCell}>
                          Service Provider
                        </th>
                        <th style={styles.popupTableHeaderCell}>
                          Phone Number
                        </th>
                        <th style={styles.popupTableHeaderCell}>Amount</th>
                        <th style={styles.popupTableHeaderCell}>Commission</th>
                        <th style={styles.popupTableHeaderCell}>
                          Payment Status
                        </th>
                        <th style={styles.popupTableHeaderCell}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionEntries.length > 0 ? (
                        conversionEntries.map((entry, index) => (
                          <tr
                            key={index}
                            style={{
                              ...styles.popupTableRow,
                              backgroundColor:
                                index % 2 === 0 ? "#f9fafb" : "white",
                            }}
                          >
                            <td style={styles.popupTableCell}>{index + 1}</td>
                            <td style={styles.popupTableCell}>
                              {entry.service_provider_name}
                            </td>
                            <td style={styles.popupTableCell}>
                              {entry.service_provider_mobile_number}
                            </td>
                            <td style={styles.popupTableCell}>
                              ₹{entry.amount_received}
                            </td>
                            <td style={styles.popupTableCell}>
                              ₹{entry.commission_value} (
                              {entry.commission_percent}%)
                            </td>
                            <td style={styles.popupTableCell}>
                              <span
                                style={{
                                  color:
                                    entry.payment_status === "Paid"
                                      ? "#059669"
                                      : "#dc2626",
                                  fontWeight: "500",
                                }}
                              >
                                {entry.payment_status}
                              </span>
                            </td>
                            <td style={styles.popupTableCell}>
                              {formatDate(entry.add_date)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={styles.noData}>
                            No conversion entries available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )} */}
          {showConversionModal && (
  <div style={styles.popupOverlay} onClick={closeConversionModal}>
    <div
      style={styles.popupContent}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={styles.popupHeader}>
        <h3 style={styles.popupTitle}>Agent Conversion Entries</h3>
        <button
          style={styles.closeButton}
          onClick={closeConversionModal}
        >
          &times;
        </button>
      </div>

      {conversionModalLoading ? (
        <div style={styles.loadingMessage}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "10px" }}>
            Loading conversion data...
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}>
            <div style={{ maxWidth: "200px" }}>
              <label htmlFor="paymentFilter" style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
                fontSize: "14px",
              }}>
                Filter by Payment Status:
              </label>
              <select
                id="paymentFilter"
                value={paymentFilter}
                onChange={handlePaymentFilterChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
          
          <table style={styles.popupTable}>
            <thead>
              <tr style={styles.popupTableHeader}>
                <th style={styles.popupTableHeaderCell}>#</th>
                <th style={styles.popupTableHeaderCell}>
                  Service Provider
                </th>
                <th style={styles.popupTableHeaderCell}>
                  Phone Number
                </th>
                <th style={styles.popupTableHeaderCell}>Amount</th>
                <th style={styles.popupTableHeaderCell}>Commission</th>
                <th style={styles.popupTableHeaderCell}>
                  Payment Status
                </th>
                <th style={styles.popupTableHeaderCell}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversionEntries.length > 0 ? (
                filteredConversionEntries.map((entry, index) => (
                  <tr
                    key={index}
                    style={{
                      ...styles.popupTableRow,
                      backgroundColor:
                        index % 2 === 0 ? "#f9fafb" : "white",
                    }}
                  >
                    <td style={styles.popupTableCell}>{index + 1}</td>
                    <td style={styles.popupTableCell}>
                      {entry.service_provider_name}
                    </td>
                    <td style={styles.popupTableCell}>
                      {entry.service_provider_mobile_number}
                    </td>
                    <td style={styles.popupTableCell}>
                      ₹{entry.amount_received}
                    </td>
                    <td style={styles.popupTableCell}>
                      ₹{entry.commission_value} (
                      {entry.commission_percent}%)
                    </td>
                    <td style={styles.popupTableCell}>
                      <span
                        style={{
                          color:
                            entry.payment_status === "Paid"
                              ? "#059669"
                              : entry.payment_status === "REFUNDED"
                              ? "#f59e0b"
                              : "#dc2626",
                          fontWeight: "500",
                        }}
                      >
                        {entry.payment_status}
                      </span>
                    </td>
                    <td style={styles.popupTableCell}>
                      {formatDate(entry.add_date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.noData}>
                    {conversionEntries.length > 0 
                      ? "No entries match the selected filter" 
                      : "No conversion entries available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  </div>
)}
        </>
      )}
    </div>
  );
};

export default AgentReports;
