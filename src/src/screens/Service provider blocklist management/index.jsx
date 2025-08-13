import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  ADD_SERVICE_PROVIDER_TO_BLACKLIST,
  FETCH_SERVICE_PROVIDER_BLACKLIST,
  FETCH_SERVICE_PROVIDER_BY_MOBILENUMBER,
  REMOVE_FROM_BLOCKLIST,
} from "../../apis/Apis";

// Mock API functions - replace with your actual imports

const ServiceProviderBlockList = () => {
  const [blacklistData, setBlacklistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [searchedProvider, setSearchedProvider] = useState(null);
  const [reason, setReason] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await FETCH_SERVICE_PROVIDER_BLACKLIST();
      console.log(res);
      if (res.status_code === 200) {
        setBlacklistData(res.data);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching blacklist data");
    }
    setLoading(false);
  };

  const fetchServiceProviderByMobileNumber = async () => {
    if (!searchMobile.trim()) {
      alert("Please enter mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await FETCH_SERVICE_PROVIDER_BY_MOBILENUMBER({
        service_provider_mobile_number: searchMobile,
      });
      console.log(res);
      if (res.status_code === 200) {
        setSearchedProvider(res.data);
      } else {
        alert("Service provider not found");
        setSearchedProvider(null);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching service provider details");
      setSearchedProvider(null);
    }
    setLoading(false);
  };

  const addToBlackList = async () => {
    if (!reason.trim()) {
      alert("Please enter reason for blacklisting");
      return;
    }

    setSubmitting(true);
    try {
      const res = await ADD_SERVICE_PROVIDER_TO_BLACKLIST({
        service_provider_mobile_number: searchMobile,
        reason: reason,
      });
      console.log(res);
      if (res.status_code === 200) {
        alert("Service provider added to blacklist successfully");
        setSearchMobile("");
        setSearchedProvider(null);
        setReason("");
        setShowAddForm(false);
        fetchData(); // Refresh the blacklist
      }
    } catch (error) {
      console.log(error);
      alert("Error adding to blacklist");
    }
    setSubmitting(false);
  };

  const deleteFromBlackList = async (service_provider_mobile_number,id) => {
    // if (
    //   !confirm(
    //     "Are you sure you want to remove this service provider from blacklist?"
    //   )
    // ) {
    //   return;
    // }

    setDeleting(service_provider_mobile_number);
    try {
      const res = await REMOVE_FROM_BLOCKLIST({
        service_provider_mobile_number: service_provider_mobile_number,
        _id:id
      });

      if (res.status_code === 200) {
        alert("Service provider removed from blacklist successfully");
        fetchData(); // Refresh the blacklist
      }
    } catch (error) {
      console.log(error);
      alert("Error removing from blacklist");
    }
    setDeleting("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        timeZone:"UTC",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-dark">Service Provider Blacklist</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Add New Service Provider
            </button>
          </div>

          {/* Add New Service Provider Form */}
          {showAddForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  Add Service Provider to Blacklist
                </h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label htmlFor="mobileNumber" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobileNumber"
                      placeholder="Enter mobile number"
                      value={searchMobile}
                      onChange={(e) => setSearchMobile(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={fetchServiceProviderByMobileNumber}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Service Provider Details */}
                {searchedProvider && (
                  <div className="alert alert-info">
                    <h6 className="alert-heading">Service Provider Details</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Business Name:</strong>{" "}
                          {searchedProvider.business_name}
                        </p>
                        <p className="mb-1">
                          <strong>Service Type:</strong>{" "}
                          {searchedProvider.service_type}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Mobile:</strong>{" "}
                          {searchedProvider.service_provider_mobile_number}
                        </p>
                        <p className="mb-1">
                          <strong>Address:</strong>{" "}
                          {searchedProvider.business_address}
                        </p>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-8">
                        <label htmlFor="reason" className="form-label">
                          Reason for Blacklisting
                        </label>
                        <textarea
                          className="form-control"
                          id="reason"
                          rows="3"
                          placeholder="Enter reason for adding to blacklist"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="col-md-4 d-flex align-items-end">
                        <button
                          className="btn btn-danger w-100"
                          onClick={addToBlackList}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Adding...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-ban me-2"></i>
                              Add to Blacklist
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blacklist Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Blacklisted Service Providers
                <span className="badge bg-danger ms-2">
                  {blacklistData.length}
                </span>
              </h5>
            </div>
            <div className="card-body">
              {loading && !blacklistData.length ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : blacklistData.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-inbox fa-3x mb-3"></i>
                  <p>No blacklisted service providers found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Business Name</th>
                        <th>Mobile Number</th>
                        <th>Service Type</th>
                        <th>Address</th>
                        <th>Reason</th>
                        <th>Added By</th>
                        <th>Date Added</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blacklistData.map((provider) => (
                        <tr key={provider._id}>
                          <td>
                            <strong>{provider.business_name}</strong>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {provider.service_provider_mobile_number}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {provider.service_type}
                            </span>
                          </td>
                          <td>
                            <small>{provider.business_address}</small>
                          </td>
                          <td>
                            <span className="text-danger">
                              {provider.reason}
                            </span>
                          </td>
                          <td>
                            <small>{provider.created_by}</small>
                          </td>
                          <td>
                            <small>{formatDate(provider.createdAt)}</small>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                deleteFromBlackList(
                                  provider.service_provider_mobile_number,
                                  provider._id
                                )
                              }
                              disabled={
                                deleting ===
                                provider.service_provider_mobile_number
                              }
                              title="Remove from blacklist"
                            >
                              {deleting ===
                              provider.service_provider_mobile_number ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                ></span>
                              ) : (
                                <>
                                  <i className="bi bi-trash3"></i>
                                  <span className="ms-1">Remove</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderBlockList;
