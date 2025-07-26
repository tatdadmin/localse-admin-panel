import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { EXECUTE_QUERY, FETCH_DATA_COLLECTION } from "../../apis/Apis";

const DeveloperData = () => {
  const adminEmail = useSelector((e) => e?.userAuth?.userAllData?.email);
  
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [filter, setFilter] = useState('{}');
  const [project, setProject] = useState('{}');
  const [sort, setSort] = useState('{}');
  const [queryResults, setQueryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDataCollections();
  }, []);

  const fetchDataCollections = async () => {
    try {
      const res = await FETCH_DATA_COLLECTION();
      if (res?.status_code === 200) {
        setCollections(res.collections || []);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to fetch collections');
    }
  };

  const executeQuery = async (e) => {
    if (!selectedCollection) {
      alert('Please select a collection');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Parse JSON inputs
      let parsedFilter = {};
      let parsedProject = {};
      let parsedSort = {};

      try {
        parsedFilter = filter ? JSON.parse(filter) : {};
      } catch (err) {
        throw new Error('Invalid JSON in filter field');
      }

      try {
        parsedProject = project ? JSON.parse(project) : {};
      } catch (err) {
        throw new Error('Invalid JSON in project field');
      }

      try {
        parsedSort = sort ? JSON.parse(sort) : {};
      } catch (err) {
        throw new Error('Invalid JSON in sort field');
      }

      const res = await EXECUTE_QUERY({
        collection: selectedCollection,
        filter: parsedFilter,
        sort: parsedSort,
        project: parsedProject,
        format: "",
      });

      setQueryResults(res?.data || []);
// console.log(res,"DEVELOPERDARTA")
    } catch (error) {
      console.log(error);
      setError(error.message || 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (format) => {
    if (!selectedCollection) {
      alert('Please select a collection');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Parse JSON inputs
      let parsedFilter = {};
      let parsedProject = {};
      let parsedSort = {};

      try {
        parsedFilter = filter ? JSON.parse(filter) : {};
      } catch (err) {
        throw new Error('Invalid JSON in filter field');
      }

      try {
        parsedProject = project ? JSON.parse(project) : {};
      } catch (err) {
        throw new Error('Invalid JSON in project field');
      }

      try {
        parsedSort = sort ? JSON.parse(sort) : {};
      } catch (err) {
        throw new Error('Invalid JSON in sort field');
      }

      const res = await EXECUTE_QUERY({
        collection: selectedCollection,
        filter: parsedFilter,
        sort: parsedSort,
        project: parsedProject,
        format: format,
      });

      let fileContent;
      let mimeType;
      
      if (format === 'json') {
        // For JSON format
        if (typeof res === 'string') {
          fileContent = res; // Already a JSON string
        } else {
          fileContent = JSON.stringify(res, null, 2); // Convert object to formatted JSON string
        }
        mimeType = 'application/json';
      } else if (format === 'csv') {
        // For CSV format
        if (typeof res === 'string') {
          fileContent = res; // Already a CSV string
        } else {
          // If res is an array of objects, convert to CSV
          fileContent = convertArrayToCSV(res);
        }
        mimeType = 'text/csv';
      }

      // Create and download file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedCollection}_data.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error);
      setError(error.message || 'Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert array of objects to CSV
  const convertArrayToCSV = (data) => {
    if (!data || !data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.map(header => `"${header}"`).join(',');
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const clearForm = () => {
    setSelectedCollection('');
    setFilter('{}');
    setProject('{}');
    setSort('{}');
    setQueryResults([]);
    setError('');
  };

  const formatCellValue = (value) => {
    if (value === null || value === undefined) {
      return 'null';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const renderTable = () => {
    if (!queryResults.length) return null;

    const headers = Object.keys(queryResults[0]);

    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th style={{ minWidth: '50px' }}>#</th>
              {headers.map((header, index) => (
                <th key={index} style={{ minWidth: '120px', fontSize: '0.9rem' }}>
                  {header.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queryResults.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="text-center font-weight-bold text-primary">
                  {rowIndex + 1}
                </td>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} style={{ fontSize: '0.85rem', maxWidth: '200px' }}>
                    {formatCellValue(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '15px 0' }}>
      <div className="container mt-3">
        <h1 className="mb-3 text-center">Check My App Data</h1>
        
        {/* Display Admin Email */}
        <div className="alert alert-info mb-3">
          <strong>Admin Email:</strong> {adminEmail || 'Not logged in'}
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-3">
            {/* Collection Selection */}
            <div className="form-group mb-2">
              <label htmlFor="collectionSelect" className="form-label mb-1">Select a Collection:</label>
              <select 
                id="collectionSelect" 
                className="form-control form-control-sm"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <option value="">Select</option>
                {collections.map((collection, index) => (
                  <option key={index} value={collection}>
                    {collection}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Input */}
            <div className="form-group mb-2">
              <label htmlFor="filterInput" className="form-label mb-1">Filter (JSON):</label>
              <textarea 
                id="filterInput" 
                className="form-control form-control-sm" 
                rows="2"
                placeholder='{"page_url": "Customer Login"}'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <small className="form-text text-muted">
                Example: {"{"}"page_url": "Customer Login"{"}"} or {"{"}"mobile_number": "9717728228"{"}"} or leave empty
              </small>
            </div>

            {/* Project Input */}
            <div className="form-group mb-2">
              <label htmlFor="projectInput" className="form-label mb-1">Project (JSON):</label>
              <textarea 
                id="projectInput" 
                className="form-control form-control-sm" 
                rows="2"
                placeholder='{"mobile_number": 1, "login_time": 1}'
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
              <small className="form-text text-muted">
                Example: {"{"}"mobile_number": 1, "login_time": 1, "page_url": 1{"}"} or leave empty for all fields
              </small>
            </div>

            {/* Sort Input */}
            <div className="form-group mb-2">
              <label htmlFor="sortInput" className="form-label mb-1">Sort (JSON):</label>
              <textarea 
                id="sortInput" 
                className="form-control form-control-sm" 
                rows="2"
                placeholder='{"createdAt": -1}'
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              />
              <small className="form-text text-muted">
                Example: {"{"}"createdAt": -1{"}"} for newest first or {"{"}"login_time": 1{"}"} for oldest first
              </small>
            </div>

            {/* Error Display */}
            {error && (
              <div className="alert alert-danger py-2 mb-2">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="form-group text-center mb-0">
              <button 
                type="button" 
                className="btn btn-primary btn-sm mr-2"
                onClick={()=>{
                    executeQuery("runQury")
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span 
                      className="spinner-border spinner-border-sm" 
                      role="status" 
                      aria-hidden="true"
                      style={{ marginRight: '5px', width: '0.8rem', height: '0.8rem' }}
                    ></span>
                    Running Query...
                  </>
                ) : (
                  'Run Query'
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-success btn-sm mr-2"
                onClick={() => downloadFile('json')}
                disabled={loading}
              >
                Download JSON
              </button>
              
              <button 
                type="button" 
                className="btn btn-info btn-sm mr-2"
                onClick={() => downloadFile('csv')}
                disabled={loading}
              >
                Download CSV
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={clearForm}
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {queryResults.length > 0 && (
          <div className="card shadow-sm mt-3">
            <div 
              className="card-header py-2"
              style={{ 
                backgroundColor: '#007bff', 
                color: 'white',
                borderRadius: '0.375rem 0.375rem 0 0'
              }}
            >
              <h5 className="mb-0">Query Results ({queryResults.length} records)</h5>
            </div>
            <div className="card-body p-2">
              {renderTable()}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!loading && queryResults.length === 0 && selectedCollection && !error && (
          <div className="alert alert-warning mt-3">
            No results found for the current query.
          </div>
        )}
      </div>

      {/* Add Bootstrap CSS */}
      <link 
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      
      <style jsx>{`
        .card {
          border-radius: 0.5rem;
          border: 1px solid #dee2e6;
        }
        .form-control {
          border-radius: 0.375rem;
        }
        .form-control-sm {
          height: calc(1.5em + 0.5rem + 2px);
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .btn {
          border-radius: 0.375rem;
        }
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .alert {
          border-radius: 0.375rem;
        }
        .table th {
          background-color: #343a40;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }
        .table td {
          vertical-align: middle;
          word-wrap: break-word;
        }
        .table-responsive {
          border-radius: 0.375rem;
        }
        .spinner-border {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          vertical-align: text-bottom;
          border: 0.25em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border 0.75s linear infinite;
        }
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
          border-width: 0.2em;
        }
        @keyframes spinner-border {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default DeveloperData;