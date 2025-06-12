import { useEffect, useState } from "react";

import {
  GET_CAMPAGIAN_DROPDOWN_VALUES,
  GET_CAMPAIGN_DATA,
} from "../../apis/Apis";

const Campaign_reports = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  // Filter states
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  useEffect(() => {
    getDropdownValues();
    setLoading(true);
  }, []);

  useEffect(() => {
    applySorting();
  }, [tableData, sortOrder]);

  const getDropdownValues = async () => {
    try {
      const res = await GET_CAMPAGIAN_DROPDOWN_VALUES();
      if (res.status_code === 200) {
        setCampaigns(res.data);
        // Auto-select first campaign if available
        if (res.data.length > 0) {
          setSelectedCampaign(res.data[0]);
          getTableValues(res.data[0]);
        }
      }
    } catch (error) {
      console.log("Error fetching campaigns:", error);
    }
  };

  const getTableValues = async (campaignSlug = selectedCampaign) => {
    if (!campaignSlug) return;

    setLoading(true);
    try {
      const res = await GET_CAMPAIGN_DATA({
        campaign_slug: campaignSlug,
        target_area_code:'1'
      });
      if (res.status_code === 200) {
        // Transform the nested API response structure
        const transformedData = [];
        
        // Handle the API response format: array of campaigns with nested data
        res.data.forEach(campaign => {
          const totalCount = campaign.total_count;
          
          // Check if data array exists and has items
          if (campaign.data && Array.isArray(campaign.data)) {
            campaign.data.forEach(dayData => {
              transformedData.push({
                date: dayData.date,
                clicked_count: dayData.clicked_count || 0,
                delivery_count: dayData.delivery_count || 0,
                seen_count: dayData.seen_count || 0,
                total_count: totalCount // Use the total_count from the parent campaign object
              });
            });
          }
        });
        
        console.log("Transformed data:", transformedData); // Debug log
        setTableData(transformedData);
      }
    } catch (err) {
      console.log("Error fetching campaign data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignChange = (e) => {
    const value = e.target.value;
    setSelectedCampaign(value);
    if (value) {
      getTableValues(value);
    } else {
      setTableData([]);
    }
  };

  const applySorting = () => {
    let sorted = [...tableData];

    // Date sorting
    sorted.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setFilteredData(sorted);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const calculateClickRate = (clicked, delivered) => {
    return delivered > 0 ? ((clicked / delivered) * 100).toFixed(2) : 0;
  };

  const calculateSeenRate = (seen, delivered) => {
    return delivered > 0 ? ((seen / delivered) * 100).toFixed(2) : 0;
  };

  const getTotalStats = () => {
    const data = filteredData.length > 0 ? filteredData : tableData;
    const totalClicks = data.reduce((sum, item) => sum + (item.clicked_count || 0), 0);
    const totalDelivery = data.reduce((sum, item) => sum + (item.delivery_count || 0), 0);
    const totalSeen = data.reduce((sum, item) => sum + (item.seen_count || 0), 0);
    const totalCount = data.length > 0 ? data[0].total_count : 0; // Assuming same total_count for all entries
    return { totalClicks, totalDelivery, totalSeen, totalCount };
  };

  const { totalClicks, totalDelivery, totalSeen, totalCount } = getTotalStats();

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4 text-primary">Campaign Reports</h1>

          {/* Campaign Dropdown */}
          <div className="mb-4">
            <label className="form-label fw-bold">Select Campaign</label>
            <select
              value={selectedCampaign}
              onChange={handleCampaignChange}
              className="form-select"
              style={{ maxWidth: "400px" }}
            >
              <option value="">Select a campaign...</option>
              {campaigns.map((campaign, index) => (
                <option key={index} value={campaign}>
                  {campaign}
                </option>
              ))}
            </select>
          </div>

          {/* Date Sort Filter */}
          {tableData.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Sort Options</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Sort by Date</label>
                    <select
                      className="form-select"
                      value={sortOrder}
                      onChange={handleSortChange}
                    >
                      <option value="desc">Newest First (Descending)</option>
                      <option value="asc">Oldest First (Ascending)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {tableData.length > 0 && (
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card border-primary">
                  <div className="card-body text-center">
                    <h6 className="card-title text-primary">Total Campaign Count</h6>
                    <h3 className="card-text text-primary fw-bold">
                      {totalCount}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-info">
                  <div className="card-body text-center">
                    <h6 className="card-title text-info">Total Delivered</h6>
                    <h3 className="card-text text-info fw-bold">
                      {totalDelivery}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-warning">
                  <div className="card-body text-center">
                    <h6 className="card-title text-warning">Total Seen</h6>
                    <h3 className="card-text text-warning fw-bold">
                      {totalSeen}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-success">
                  <div className="card-body text-center">
                    <h6 className="card-title text-success">Total Clicks</h6>
                    <h3 className="card-text text-success fw-bold">
                      {totalClicks}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Stats Row */}
          {tableData.length > 0 && (
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card border-success">
                  <div className="card-body text-center">
                    <h6 className="card-title text-success">Overall Click Rate</h6>
                    <h3 className="card-text text-success fw-bold">
                      {calculateClickRate(totalClicks, totalDelivery)}%
                    </h3>
                    <small className="text-muted">Clicks / Delivered</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-warning">
                  <div className="card-body text-center">
                    <h6 className="card-title text-warning">Overall Seen Rate</h6>
                    <h3 className="card-text text-warning fw-bold">
                      {calculateSeenRate(totalSeen, totalDelivery)}%
                    </h3>
                    <small className="text-muted">Seen / Delivered</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="mt-2">Loading campaign data...</div>
            </div>
          )}

          {/* Table */}
          {!loading && (filteredData.length > 0 || tableData.length > 0) && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Campaign Data - All Metrics</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Date</th>
                        {/* <th scope="col">Total Count</th> */}
                        <th scope="col">Delivered</th>
                        <th scope="col">Seen</th>
                        <th scope="col">Clicked</th>
                        <th scope="col">Click Rate</th>
                        <th scope="col">Seen Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filteredData.length > 0 ? filteredData : tableData).map(
                        (item, index) => (
                          <tr key={index}>
                            <td className="fw-medium">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            {/* <td>
                              <span className="badge bg-primary fs-6">
                                {item.total_count || 0}
                              </span>
                            </td> */}
                            <td>
                              <span className="badge bg-info fs-6">
                                {item.delivery_count || 0}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-warning fs-6">
                                {item.seen_count || 0}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-success fs-6">
                                {item.clicked_count || 0}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="progress me-2"
                                  style={{ width: "80px", height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{
                                      width: `${Math.min(
                                        calculateClickRate(
                                          item.clicked_count,
                                          item.delivery_count
                                        ),
                                        100
                                      )}%`,
                                    }}
                                    aria-valuenow={calculateClickRate(
                                      item.clicked_count,
                                      item.delivery_count
                                    )}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                                <small className="fw-medium">
                                  {calculateClickRate(
                                    item.clicked_count,
                                    item.delivery_count
                                  )}%
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="progress me-2"
                                  style={{ width: "80px", height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{
                                      width: `${Math.min(
                                        calculateSeenRate(
                                          item.seen_count,
                                          item.delivery_count
                                        ),
                                        100
                                      )}%`,
                                    }}
                                    aria-valuenow={calculateSeenRate(
                                      item.seen_count,
                                      item.delivery_count
                                    )}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                                <small className="fw-medium">
                                  {calculateSeenRate(
                                    item.seen_count,
                                    item.delivery_count
                                  )}%
                                </small>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!loading && selectedCampaign && tableData.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              <h5 className="alert-heading">No Data Available</h5>
              <p className="mb-0">
                No data available for the selected campaign
              </p>
            </div>
          )}

          {/* No Selection State */}
          {!selectedCampaign && campaigns.length > 0 && (
            <div className="alert alert-warning text-center" role="alert">
              <h5 className="alert-heading">Select Campaign</h5>
              <p className="mb-0">Please select a campaign to view reports</p>
            </div>
          )}

          {/* No Campaigns State */}
          {campaigns.length === 0 && (
            <div className="alert alert-danger text-center" role="alert">
              <h5 className="alert-heading">No Campaigns</h5>
              <p className="mb-0">No campaigns available</p>
            </div>
          )}

          {/* Filtered Results Info */}
          {tableData.length > 0 && (
            <div className="mt-3">
              <small className="text-muted">
                Showing {filteredData.length} records sorted by date (
                {sortOrder === "desc" ? "newest first" : "oldest first"})
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campaign_reports;