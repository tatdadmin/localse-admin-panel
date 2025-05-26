import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  Filter,
  Download,
} from "lucide-react";
import { GET_FREEONBOARDING_HOURLY_REPORTS } from "../../apis/Apis";

const HourlyFreeOnboardReport = () => {
  const [selectedView, setSelectedView] = useState("table");
  const [highlightPeaks, setHighlightPeaks] = useState(true);

  // Sample data structure based on your API response
  //   const apiData = {
  //     "status_code": 200,
  //     "message": "Hourly report generated successfully",
  //     "data": [
  //       {
  //         "date": "2025-05-26",
  //         "hours": {
  //           "0-1": 0, "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0, "5-6": 0,
  //           "6-7": 0, "7-8": 0, "8-9": 0, "9-10": 0, "10-11": 4, "11-12": 0,
  //           "12-13": 0, "13-14": 0, "14-15": 0, "15-16": 0, "16-17": 0, "17-18": 0,
  //           "18-19": 0, "19-20": 0, "20-21": 0, "21-22": 0, "22-23": 0, "23-24": 0
  //         }
  //       },
  //       {
  //         "date": "2025-05-24",
  //         "hours": {
  //           "0-1": 0, "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0, "5-6": 0,
  //           "6-7": 0, "7-8": 0, "8-9": 0, "9-10": 0, "10-11": 3, "11-12": 0,
  //           "12-13": 0, "13-14": 0, "14-15": 0, "15-16": 0, "16-17": 0, "17-18": 0,
  //           "18-19": 0, "19-20": 0, "20-21": 0, "21-22": 0, "22-23": 0, "23-24": 0
  //         }
  //       },
  //       {
  //         "date": "2025-05-23",
  //         "hours": {
  //           "0-1": 0, "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0, "5-6": 0,
  //           "6-7": 0, "7-8": 0, "8-9": 0, "9-10": 0, "10-11": 3, "11-12": 8,
  //           "12-13": 0, "13-14": 2, "14-15": 6, "15-16": 0, "16-17": 0, "17-18": 6,
  //           "18-19": 0, "19-20": 0, "20-21": 0, "21-22": 0, "22-23": 0, "23-24": 0
  //         }
  //       },
  //       {
  //         "date": "2025-05-22",
  //         "hours": {
  //           "0-1": 0, "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0, "5-6": 0,
  //           "6-7": 0, "7-8": 0, "8-9": 0, "9-10": 0, "10-11": 0, "11-12": 0,
  //           "12-13": 0, "13-14": 0, "14-15": 5, "15-16": 6, "16-17": 3, "17-18": 4,
  //           "18-19": 1, "19-20": 0, "20-21": 0, "21-22": 0, "22-23": 0, "23-24": 0
  //         }
  //       },
  //       {
  //         "date": "2025-05-21",
  //         "hours": {
  //           "0-1": 0, "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0, "5-6": 0,
  //           "6-7": 0, "7-8": 0, "8-9": 0, "9-10": 0, "10-11": 5, "11-12": 6,
  //           "12-13": 3, "13-14": 1, "14-15": 5, "15-16": 4, "16-17": 2, "17-18": 0,
  //           "18-19": 0, "19-20": 0, "20-21": 0, "21-22": 0, "22-23": 0, "23-24": 0
  //         }
  //       }
  //     ]
  //   };
  const [apiData, setapiData] = useState({});
  useEffect(() => {
    getHourlyData();
  }, []);
  const getHourlyData = async () => {
    try {
      const res = await GET_FREEONBOARDING_HOURLY_REPORTS();
      console.log(res, "free horuly onboarding reports");
      setapiData(res);
    } catch (err) {
      console.log(err);
    }
  };
  // Generate hour headers (24 hours)
  const hourHeaders = useMemo(() => {
    if (apiData?.data && apiData.data.length > 0) {
      return Object.keys(apiData.data[0].hours);
    }
    // Fallback for when data is not loaded yet
    const headers = [];
    for (let i = 0; i < 24; i++) {
      const nextHour = i + 1;
      headers.push(`${i}-${nextHour}`);
    }
    return headers;
  }, [apiData]);

  // Calculate totals and statistics
  const statistics = useMemo(() => {
    const dayTotals = apiData?.data?.map((day) => ({
      date: day.date,
      total: Object.values(day.hours).reduce((sum, value) => sum + value, 0),
    }));

    const hourTotals = {};
    hourHeaders.forEach((hour) => {
      hourTotals[hour] = apiData?.data?.reduce(
        (sum, dayData) => sum + (dayData.hours[hour] || 0),
        0
      );
    });

    const grandTotal = Object.values(hourTotals).reduce(
      (sum, value) => sum + value,
      0
    );
    const avgPerDay = grandTotal / apiData?.data?.length;
    const peakHour = Object.keys(hourTotals).reduce((a, b) =>
      hourTotals[a] > hourTotals[b] ? a : b
    );
    const peakValue = hourTotals[peakHour];

    return {
      dayTotals,
      hourTotals,
      grandTotal,
      avgPerDay,
      peakHour,
      peakValue,
    };
  }, [apiData, hourHeaders]);

  const formatTime = (hourRange) => {
    const [start, end] = hourRange.split("-");
    const startHour = parseInt(start);
    const endHour = parseInt(end);
    
    const formatHour = (hour) => {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}${period}`;
    };
    
    return `${formatHour(startHour)}-${formatHour(endHour)}`;
  };

  const getIntensityColor = (value, max) => {
    if (value === 0) return { backgroundColor: "#f9fafb", color: "#6b7280" };
    const intensity = value / max;
    if (intensity >= 0.8) return { backgroundColor: "#ef4444", color: "white" };
    if (intensity >= 0.6) return { backgroundColor: "#fb923c", color: "white" };
    if (intensity >= 0.4) return { backgroundColor: "#fbbf24", color: "black" };
    if (intensity >= 0.2) return { backgroundColor: "#86efac", color: "black" };
    return { backgroundColor: "#dcfce7", color: "black" };
  };

  const maxValue = Math.max(...Object.values(statistics.hourTotals));

  const exportToCSV = (apiData, statistics, hourHeaders) => {
    const csvRows = [];

    // Header row
    const headerRow = ["Date", ...hourHeaders, "Total"];
    csvRows.push(headerRow.join(","));

    // Data rows
    apiData.data.forEach((dayData) => {
      const row = [
        dayData.date,
        ...hourHeaders.map((hour) => dayData.hours[hour] || 0),
        statistics.dayTotals.find((d) => d.date === dayData.date)?.total || 0,
      ];
      csvRows.push(row.join(","));
    });

    // Totals row
    const totalsRow = [
      "Totals",
      ...hourHeaders.map((hour) => statistics.hourTotals[hour] || 0),
      statistics.grandTotal,
    ];
    csvRows.push(totalsRow.join(","));

    // Create and download file
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `hourly-onboard-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel (using basic HTML table format)
  const exportToExcel = (apiData, statistics, hourHeaders) => {
    let htmlTable = `
      <table border="1">
        <thead>
          <tr style="background-color: #f0f0f0; font-weight: bold;">
            <th>Date</th>
            ${hourHeaders.map((hour) => `<th>${hour}</th>`).join("")}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Data rows
    apiData.data.forEach((dayData) => {
      htmlTable += "<tr>";
      htmlTable += `<td>${dayData.date}</td>`;
      hourHeaders.forEach((hour) => {
        const value = dayData.hours[hour] || 0;
        htmlTable += `<td style="text-align: center;">${value}</td>`;
      });
      const dayTotal =
        statistics.dayTotals.find((d) => d.date === dayData.date)?.total || 0;
      htmlTable += `<td style="text-align: center; font-weight: bold; background-color: #e6f3ff;">${dayTotal}</td>`;
      htmlTable += "</tr>";
    });

    // Totals row
    htmlTable += '<tr style="background-color: #f5f5f5; font-weight: bold;">';
    htmlTable += "<td>Totals</td>";
    hourHeaders.forEach((hour) => {
      htmlTable += `<td style="text-align: center;">${
        statistics.hourTotals[hour] || 0
      }</td>`;
    });
    htmlTable += `<td style="text-align: center; background-color: #2563eb; color: white;">${statistics.grandTotal}</td>`;
    htmlTable += "</tr>";

    htmlTable += "</tbody></table>";

    // Create and download file
    const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `hourly-onboard-report-${new Date().toISOString().split("T")[0]}.xls`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = (apiData, statistics) => {
    const exportData = {
      metadata: {
        generated: new Date().toISOString(),
        status: apiData.status_code,
        message: apiData.message,
        totalRecords: apiData.data.length,
      },
      statistics: {
        grandTotal: statistics.grandTotal,
        averagePerDay: statistics.avgPerDay,
        peakHour: statistics.peakHour,
        peakValue: statistics.peakValue,
      },
      data: apiData.data,
      summary: {
        dailyTotals: statistics.dayTotals,
        hourlyTotals: statistics.hourTotals,
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `hourly-onboard-report-${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF (using basic HTML with print styles)
  const exportToPDF = (apiData, statistics, hourHeaders) => {
    const printWindow = window.open("", "_blank");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hourly Free Onboard Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            font-size: 12px;
          }
          h1 { 
            color: #2563eb; 
            text-align: center; 
            margin-bottom: 20px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            flex-wrap: wrap;
          }
          .stat-card {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            margin: 5px;
            min-width: 120px;
          }
          .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 6px; 
            text-align: center; 
            font-size: 10px;
          }
          th { 
            background-color: #f5f5f5; 
            font-weight: bold;
          }
          .date-col { 
            text-align: left; 
            font-weight: bold;
          }
          .total-col { 
            background-color: #e6f3ff; 
            font-weight: bold;
          }
          .grand-total { 
            background-color: #2563eb; 
            color: white; 
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            color: #666;
            font-size: 10px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Hourly Free Onboard Report</h1>
        
        <div class="stats">
          <div class="stat-card">
            <div>Total Onboards</div>
            <div class="stat-value">${statistics.grandTotal}</div>
          </div>
          <div class="stat-card">
            <div>Daily Average</div>
            <div class="stat-value">${statistics.avgPerDay.toFixed(1)}</div>
          </div>
          <div class="stat-card">
            <div>Peak Hour</div>
            <div class="stat-value">${statistics.peakHour}</div>
          </div>
          <div class="stat-card">
            <div>Peak Value</div>
            <div class="stat-value">${statistics.peakValue}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th class="date-col">Date</th>
              ${hourHeaders.map((hour) => `<th>${hour}</th>`).join("")}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${apiData.data
              .map((dayData) => {
                const dayTotal =
                  statistics.dayTotals.find((d) => d.date === dayData.date)
                    ?.total || 0;
                return `
                <tr>
                  <td class="date-col">${new Date(
                    dayData.date
                  ).toLocaleDateString()}</td>
                  ${hourHeaders
                    .map((hour) => `<td>${dayData.hours[hour] || 0}</td>`)
                    .join("")}
                  <td class="total-col">${dayTotal}</td>
                </tr>
              `;
              })
              .join("")}
            <tr style="background-color: #f5f5f5; font-weight: bold;">
              <td class="date-col">Totals</td>
              ${hourHeaders
                .map((hour) => `<td>${statistics.hourTotals[hour] || 0}</td>`)
                .join("")}
              <td class="grand-total">${statistics.grandTotal}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          Generated on: ${new Date().toLocaleString()}<br>
          Status: Success | Records: ${apiData.data.length}
        </div>
        
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()">Print / Save as PDF</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Main export function with dropdown options
  const handleExport = (format, apiData, statistics, hourHeaders) => {
    switch (format) {
      case "csv":
        exportToCSV(apiData, statistics, hourHeaders);
        break;
      case "excel":
        exportToExcel(apiData, statistics, hourHeaders);
        break;
      case "json":
        exportToJSON(apiData, statistics);
        break;
      case "pdf":
        exportToPDF(apiData, statistics, hourHeaders);
        break;
      default:
        console.error("Unsupported export format:", format);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "16px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    maxWidth: {
      maxWidth: "95vw",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      marginBottom: "24px",
    },
    cardHeader: {
      padding: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    iconContainer: {
      padding: "8px",
      backgroundColor: "#dbeafe",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#111827",
      margin: 0,
    },
    subtitle: {
      fontSize: "14px",
      color: "#6b7280",
      margin: "4px 0 0 0",
    },
    exportButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      padding: "0 24px 24px",
    },
    statCard: {
      padding: "16px",
      borderRadius: "8px",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statCardBlue: {
      background: "linear-gradient(to right, #3b82f6, #2563eb)",
    },
    statCardGreen: {
      background: "linear-gradient(to right, #10b981, #059669)",
    },
    statCardPurple: {
      background: "linear-gradient(to right, #8b5cf6, #7c3aed)",
    },
    statCardOrange: {
      background: "linear-gradient(to right, #f59e0b, #d97706)",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: 0,
    },
    statLabel: {
      fontSize: "12px",
      opacity: 0.8,
      margin: "0 0 4px 0",
    },
    controls: {
      padding: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px",
    },
    controlsLeft: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap",
    },
    select: {
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "4px 8px",
      fontSize: "14px",
      outline: "none",
    },
    checkbox: {
      marginRight: "8px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    tableHeader: {
        borderBottom: "2px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        position: "sticky",
        top: "-150px",
        zIndex: 10,
      },
      
      th: {
        padding: "12px 8px",
        textAlign: "center",
        fontWeight: "600",
        color: "#374151",
        fontSize: "12px",
        backgroundColor: "#f9fafb", // Add background color to prevent transparency
        position: "sticky",
        top: 0,
      },
      
      // Also update the table container to have a max height if you want:
      tableContainer: {
        overflowX: "auto",
        overflowY: "auto",
        // padding: "24px",
        maxHeight: "70vh", // Optional: set max height for vertical scrolling
      },
    thFirst: {
      textAlign: "left",
      paddingLeft: "16px",
    },
    td: {
      padding: "12px 8px",
      textAlign: "center",
      borderBottom: "1px solid #f3f4f6",
    },
    tdFirst: {
      textAlign: "left",
      paddingLeft: "16px",
      fontWeight: "500",
    },
    dateCell: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    valueCell: {
      transition: "all 0.2s",
      cursor: "pointer",
      borderRadius: "4px",
    },
    emptyCell: {
      color: "#9ca3af",
    },
    activeCell: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      fontWeight: "600",
    },
    peakCell: {
      backgroundColor: "#fecaca",
      color: "#dc2626",
      fontWeight: "bold",
      border: "1px solid #fca5a5",
    },
    totalCell: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      fontWeight: "bold",
    },
    footerRow: {
      backgroundColor: "#f3f4f6",
      fontWeight: "600",
    },
    grandTotalCell: {
      backgroundColor: "#2563eb",
      color: "white",
      fontWeight: "bold",
    },
    heatmapContainer: {
      padding: "24px",
    },
    heatmapHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    heatmapTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: 0,
    },
    legend: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      color: "#6b7280",
    },
    legendColors: {
      display: "flex",
      gap: "2px",
    },
    legendColor: {
      width: "12px",
      height: "12px",
      borderRadius: "2px",
    },
    heatmapRow: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "8px",
    },
    heatmapDate: {
      width: "80px",
      fontSize: "12px",
      fontWeight: "500",
      color: "#374151",
    },
    heatmapCells: {
      display: "flex",
      gap: "2px",
      flex: 1,
    },
    heatmapCell: {
      width: "20px",
      height: "20px",
      borderRadius: "2px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "transform 0.2s",
    },
    heatmapTotal: {
      width: "40px",
      textAlign: "right",
      fontSize: "12px",
      fontWeight: "bold",
      color: "#1e40af",
    },
    footer: {
      marginTop: "24px",
      textAlign: "center",
    },
    footerCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    footerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      fontSize: "14px",
      color: "#6b7280",
      flexWrap: "wrap",
    },
    successText: {
      color: "#059669",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.headerLeft}>
              <div style={styles.iconContainer}>
                <BarChart3 size={24} color="#2563eb" />
              </div>
              <div>
                <h1 style={styles.title}>Hourly Free Onboard Report</h1>
                <p style={styles.subtitle}>{apiData?.message}</p>
              </div>
            </div>
            <button
              style={styles.exportButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onClick={() =>
                handleExport("pdf", apiData, statistics, hourHeaders)
              }
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
              <div>
                <p style={styles.statLabel}>Total Onboards</p>
                <p style={styles.statValue}>{statistics.grandTotal}</p>
              </div>
              <Users size={32} />
            </div>

            <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
              <div>
                <p style={styles.statLabel}>Daily Average</p>
                <p style={styles.statValue}>
                  {statistics.avgPerDay.toFixed(1)}
                </p>
              </div>
              <TrendingUp size={32} />
            </div>

            <div style={{ ...styles.statCard, ...styles.statCardPurple }}>
              <div>
                <p style={styles.statLabel}>Peak Hour</p>
                <p style={styles.statValue}>
                  {formatTime(statistics.peakHour)}
                </p>
              </div>
              <Clock size={32} />
            </div>

            <div style={{ ...styles.statCard, ...styles.statCardOrange }}>
              <div>
                <p style={styles.statLabel}>Peak Value</p>
                <p style={styles.statValue}>{statistics.peakValue}</p>
              </div>
              <Calendar size={32} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.card}>
          <div style={styles.controls}>
            <div style={styles.controlsLeft}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Filter size={16} color="#6b7280" />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  View:
                </span>
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  style={styles.select}
                >
                  <option value="table">Table View</option>
                  <option value="heatmap">Heatmap View</option>
                </select>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                <input
                  type="checkbox"
                  checked={highlightPeaks}
                  onChange={(e) => setHighlightPeaks(e.target.checked)}
                  style={styles.checkbox}
                />
                <span>Highlight Peaks</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.card}>
          {selectedView === "table" ? (
            <div style={{ overflowX: "auto", padding: "24px" }}>
                <div style={styles.tableContainer}>
              <table style={styles.table}>
                {/* <thead style={styles.tableHeader}>
                  <tr>
                    <th style={{ ...styles.th, ...styles.thFirst }}>Date</th>
                    {hourHeaders.map((hour) => (
                      <th key={hour} style={styles.th}>
                        <div>{hour.split("-")[0]}</div>
                        <div style={{ fontSize: "10px", color: "#6b7280" }}>
                          {formatTime(hour)}
                        </div>
                      </th>
                    ))}
                    <th style={{ ...styles.th, backgroundColor: "#dbeafe" }}>
                      Total
                    </th>
                  </tr>
                </thead> */}
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={{ ...styles.th, ...styles.thFirst }}>Date</th>
                    {hourHeaders.map((hour) => (
                      <th key={hour} style={styles.th}>
                        <div>{hour}</div>
                        <div style={{ fontSize: "10px", color: "#6b7280" }}>
                          {formatTime(hour)}
                        </div>
                      </th>
                    ))}
                    <th style={{ ...styles.th, backgroundColor: "#dbeafe" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiData?.data?.map((dayData, index) => (
                    <tr
                      key={dayData.date}
                      style={{
                        backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                      }}
                    >
                      <td style={{ ...styles.td, ...styles.tdFirst }}>
                        <div style={styles.dateCell}>
                          <Calendar size={16} color="#9ca3af" />
                          <div>
                            <div style={{ fontWeight: "600" }}>
                              {new Date(dayData.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div style={{ fontSize: "10px", color: "#6b7280" }}>
                              {new Date(dayData.date).getFullYear()}
                            </div>
                          </div>
                        </div>
                      </td>
                      {hourHeaders.map((hour) => {
                        const value = dayData.hours[hour] || 0;
                        const isPeak =
                          highlightPeaks &&
                          value > 0 &&
                          hour === statistics.peakHour;
                        let cellStyle = { ...styles.td, ...styles.valueCell };

                        if (value > 0) {
                          if (isPeak) {
                            cellStyle = { ...cellStyle, ...styles.peakCell };
                          } else {
                            cellStyle = { ...cellStyle, ...styles.activeCell };
                          }
                        } else {
                          cellStyle = { ...cellStyle, ...styles.emptyCell };
                        }

                        return (
                          <td
                            key={hour}
                            style={cellStyle}
                            onMouseOver={(e) => {
                              if (value > 0) {
                                e.target.style.transform = "scale(1.1)";
                              }
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = "scale(1)";
                            }}
                          >
                            {value > 0 ? value : "·"}
                          </td>
                        );
                      })}
                      <td style={{ ...styles.td, ...styles.totalCell }}>
                        {statistics.dayTotals.find(
                          (d) => d.date === dayData.date
                        )?.total || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={styles.footerRow}>
                    <td style={{ ...styles.td, ...styles.tdFirst }}>Totals</td>
                    {hourHeaders.map((hour) => {
                      let cellStyle = { ...styles.td };
                      const value = statistics.hourTotals[hour];

                      if (value > 0) {
                        if (hour === statistics.peakHour && highlightPeaks) {
                          cellStyle = {
                            ...cellStyle,
                            backgroundColor: "#fca5a5",
                            color: "#dc2626",
                            fontWeight: "bold",
                          };
                        } else {
                          cellStyle = { ...cellStyle, color: "#111827" };
                        }
                      } else {
                        cellStyle = { ...cellStyle, color: "#9ca3af" };
                      }

                      return (
                        <td key={hour} style={cellStyle}>
                          {value > 0 ? value : "·"}
                        </td>
                      );
                    })}
                    <td style={{ ...styles.td, ...styles.grandTotalCell }}>
                      {statistics.grandTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>
              </div>
            </div>
          ) : (
            /* Heatmap View */
            <div style={styles.heatmapContainer}>
              <div style={styles.heatmapHeader}>
                <h3 style={styles.heatmapTitle}>Activity Heatmap</h3>
                <div style={styles.legend}>
                  <span>Low</span>
                  <div style={styles.legendColors}>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#f3f4f6",
                      }}
                    ></div>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#dcfce7",
                      }}
                    ></div>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#fde68a",
                      }}
                    ></div>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#fb923c",
                      }}
                    ></div>
                    <div
                      style={{
                        ...styles.legendColor,
                        backgroundColor: "#ef4444",
                      }}
                    ></div>
                  </div>
                  <span>High</span>
                </div>
              </div>

              <div>
                {apiData?.data?.map((dayData) => (
                  <div key={dayData.date} style={styles.heatmapRow}>
                    <div style={styles.heatmapDate}>
                      {new Date(dayData.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div style={styles.heatmapCells}>
                      {hourHeaders?.map((hour) => {
                        const value = dayData.hours[hour] || 0;
                        const colorStyle = getIntensityColor(value, maxValue);
                        return (
                          <div
                            key={hour}
                            style={{
                              ...styles.heatmapCell,
                              ...colorStyle,
                            }}
                            title={`${formatTime(hour)}: ${value} onboards`}
                            onMouseOver={(e) => {
                              e.target.style.transform = "scale(1.2)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = "scale(1)";
                            }}
                          >
                            {value > 0 ? value : ""}
                          </div>
                        );
                      })}
                    </div>
                    <div style={styles.heatmapTotal}>
                      {statistics.dayTotals.find((d) => d.date === dayData.date)
                        ?.total || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerCard}>
            <div style={styles.footerContent}>
              <span>
                Status: <span style={styles.successText}>Success</span>
              </span>
              <span>
                Records:{" "}
                <span style={{ fontWeight: "600" }}>
                  {apiData?.data?.length}
                </span>
              </span>
              <span>
                Generated:{" "}
                <span style={{ fontWeight: "600" }}>
                  {new Date().toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyFreeOnboardReport;
