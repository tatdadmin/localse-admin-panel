import { useState, useEffect } from "react";
import {
  GET_AGENT_CONVERSIONS_ENTRIES,
  GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER,
} from "../../apis/Apis";

const AgentConversionReport = () => {
  const [agentData, setAgentData] = useState([]);
  const [agentDetailData, setAgentDetailData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("count");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  // CSS Styles
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial",
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
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    tableRowHover: {
      backgroundColor: "#f0f9ff !important",
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
    },
    cardBlue: {
      backgroundColor: "#f0f9ff",
      border: "1px solid #bae6fd",
      color: "#0c4a6e",
    },
    cardGreen: {
      backgroundColor: "#ecfdf5",
      border: "1px solid #a7f3d0",
      color: "#065f46",
    },
    cardRed: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#991b1b",
    },
    modalBackdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "90vw",
      maxHeight: "90vh",
      overflow: "auto",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      position: "relative",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "16px",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1f2937",
      margin: 0,
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#6b7280",
    },
    filterContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "16px",
      alignItems: "center",
    },
    filterLabel: {
      fontWeight: "500",
      color: "#4b5563",
    },
    filterSelect: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      backgroundColor: "#f9fafb",
      color: "#1f2937",
      fontSize: "14px",
      cursor: "pointer",
    },
    statusCell: (status) => {
      const colors = {
        Paid: {
          bg: "#ecfdf5",
          text: "#059669",
        },
        Due: {
          bg: "#fffbeb",
          text: "#d97706",
        },
        REFUNDED: {
          bg: "#fef2f2",
          text: "#dc2626",
        },
      };

      return {
        backgroundColor: colors[status]?.bg || "#f3f4f6",
        color: colors[status]?.text || "#6b7280",
        fontWeight: "500",
        padding: "4px 8px",
        borderRadius: "4px",
        display: "inline-block",
      };
    },
    modalTableHeader: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      textAlign: "left",
      padding: "12px",
      fontWeight: "600",
    },
    modalTableCell: {
      padding: "12px",
      borderBottom: "1px solid #e5e7eb",
      textAlign: "left",
    },
  };

  const getAgentConversionReport = async () => {
    try {
      setLoading(true);
      // In a real app, you would use:
      const res = await GET_AGENT_CONVERSIONS_ENTRIES();
      setAgentData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load agent conversion data");
      setLoading(false);
    }
  };

  const getAgentConversionReportForMobileNumber = async (mobile_number) => {
    try {
      setDetailLoading(true);
      // In a real app, you would use:
      const res = await GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER({
        mobile_number: mobile_number,
      });
      setAgentDetailData(res.data);
      setDetailLoading(false);
     
    } catch (error) {
      console.log(error);
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    getAgentConversionReport();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortField(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const sortedData = [...agentData].sort((a, b) => {
    if (sortField === "agent_name") {
      return sortDirection === "asc"
        ? a.agent_name.localeCompare(b.agent_name)
        : b.agent_name.localeCompare(a.agent_name);
    } else if (sortField === "count") {
      return sortDirection === "asc" ? a.count - b.count : b.count - a.count;
    } else if (sortField === "agent_number") {
      return sortDirection === "asc"
        ? a.agent_number.localeCompare(b.agent_number)
        : b.agent_number.localeCompare(a.agent_number);
    }
    return 0;
  });

  const getTotalRegistrations = () => {
    return agentData.reduce((sum, agent) => sum + agent.count, 0);
  };

  const getUniqueAgentCount = () => {
    const uniqueAgentNames = new Set(
      agentData.map((agent) => agent.agent_name)
    );
    return uniqueAgentNames.size;
  };

  const closeModal = () => {
    setSelectedAgent(null);
    setStatusFilter("All");
    setAgentDetailData([]);
  };

  const handleRowClick = (agent) => {
    setSelectedAgent(agent);
    getAgentConversionReportForMobileNumber(agent.agent_number);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredDetailData =
    statusFilter === "All"
      ? agentDetailData
      : agentDetailData.filter((item) => item.payment_status === statusFilter);

  // Calculate total commission and amount for filtered data
  const totalCommission = filteredDetailData.reduce(
    (sum, item) => sum + item.commission_value,
    0
  );
  const totalAmount = filteredDetailData.reduce(
    (sum, item) => sum + item.amount_received,
    0
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.summaryHeading}>Agent Conversion Report</h1>

      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        <div style={{ ...styles.summaryCard, ...styles.cardBlue }}>
          <div style={styles.cardTitle}>Total Registrations</div>
          <div style={styles.cardValue}>
            {loading ? "Loading..." : getTotalRegistrations()}
          </div>
        </div>

        <div style={{ ...styles.summaryCard, ...styles.cardGreen }}>
          <div style={styles.cardTitle}>Active Agents</div>
          <div style={styles.cardValue}>
            {loading ? "Loading..." : getUniqueAgentCount()}
          </div>
        </div>

        <div style={{ ...styles.summaryCard, ...styles.cardRed }}>
          <div style={styles.cardTitle}>Top Agent</div>
          <div style={styles.cardValue}>
            {loading
              ? "Loading..."
              : sortedData.length > 0
              ? sortedData[0].agent_name
              : "None"}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingMessage}>
          Loading agent conversion data...
        </div>
      ) : error ? (
        <div style={styles.loadingMessage}>{error}</div>
      ) : (
        <table style={styles.dataTable}>
          <thead>
            <tr style={styles.tableHeader}>
              <th
                style={styles.clickableHeader}
                onClick={() => handleSort("agent_name")}
              >
                Agent Name{" "}
                {sortField === "agent_name" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={styles.clickableHeader}
                onClick={() => handleSort("count")}
              >
                Registrations{" "}
                {sortField === "count" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={styles.clickableHeader}
                onClick={() => handleSort("agent_number")}
              >
                Agent Number{" "}
                {sortField === "agent_number" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.noData}>
                  No data available
                </td>
              </tr>
            ) : (
              <>
                {sortedData.map((agent, index) => (
                  <tr
                    key={`${agent.agent_name}-${agent.agent_number}-${index}`}
                    style={{
                      ...styles.tableRow,
                      ...(index % 2 === 0 ? styles.rowEven : styles.rowOdd),
                    }}
                    onClick={() => handleRowClick(agent)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0f9ff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#f9fafb" : "#ffffff";
                    }}
                  >
                    <td style={styles.tableCell}>{agent.agent_name}</td>
                    <td style={styles.tableCell}>{agent.count}</td>
                    <td style={styles.tableCell}>{agent.agent_number}</td>
                  </tr>
                ))}
                <tr style={styles.totalsRow}>
                  <td style={styles.tableCell}>Total</td>
                  <td style={styles.tableCell}>{getTotalRegistrations()}</td>
                  <td style={styles.tableCell}>
                    {getUniqueAgentCount()} Agents
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {selectedAgent && (
        <div style={styles.modalBackdrop} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                Agent Details: {selectedAgent.agent_name}
              </h3>
              <button style={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>

            <div style={styles.filterContainer}>
              <span style={styles.filterLabel}>Filter by Payment Status:</span>
              <select
                style={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            {detailLoading ? (
              <div style={styles.loadingMessage}>Loading details...</div>
            ) : (
              <>
                <table style={styles.dataTable}>
                  <thead>
                    <tr>
                      <th style={styles.modalTableHeader}>Service Provider</th>
                      <th style={styles.modalTableHeader}>Mobile</th>
                      <th style={styles.modalTableHeader}>Date</th>
                      <th style={styles.modalTableHeader}>Amount</th>
                      <th style={styles.modalTableHeader}>Commission</th>
                      <th style={styles.modalTableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDetailData.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={styles.noData}>
                          No matching records found
                        </td>
                      </tr>
                    ) : (
                      <>
                        {filteredDetailData.map((item, index) => (
                          <tr
                            key={item._id}
                            style={{
                              ...(index % 2 === 0
                                ? styles.rowEven
                                : styles.rowOdd),
                            }}
                          >
                            <td style={styles.modalTableCell}>
                              {item.service_provider_name}
                            </td>
                            <td style={styles.modalTableCell}>
                              {item.service_provider_mobile_number}
                            </td>
                            <td style={styles.modalTableCell}>
                              {formatDate(item.add_date)}
                            </td>
                            <td style={styles.modalTableCell}>
                              ₹{item.amount_received}
                            </td>
                            <td style={styles.modalTableCell}>
                              ₹{item.commission_value}
                            </td>
                            <td style={styles.modalTableCell}>
                              <span
                                style={styles.statusCell(item.payment_status)}
                              >
                                {item.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr style={styles.totalsRow}>
                          <td colSpan="3" style={styles.modalTableCell}>
                            Total
                          </td>
                          <td style={styles.modalTableCell}>₹{totalAmount}</td>
                          <td style={styles.modalTableCell}>
                            ₹{totalCommission}
                          </td>
                          <td style={styles.modalTableCell}>
                            {filteredDetailData.length} entries
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentConversionReport;
