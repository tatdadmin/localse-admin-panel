import React, { useState } from 'react';
import { APP_UPDATE } from "../../apis/Apis";

const AppUpdate = () => {
    const [formData, setFormData] = useState({
        app_type: 'Android',
        version: '',
        force_update: false
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const appUpdate = async () => {
        if (!formData.version.trim()) {
            setMessage('Please enter a version number');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');
        
        try {
            const res = await APP_UPDATE({
                app_type: formData.app_type,
                version: formData.version,
                force_update: formData.force_update ? "1" : "0"
            });

            if (res.status_code === 200) {
                setMessage(res.message || 'App version updated successfully');
                setMessageType('success');
                // Optionally reset form
                setFormData({
                    app_type: 'Android',
                    version: '',
                    force_update: false
                });
            } else {
                setMessage(res.message || 'Update failed');
                setMessageType('error');
            }
        } catch (err) {
            console.log(err);
            setMessage('An error occurred while updating the app version');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Bootstrap CSS */}
            <link 
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
                rel="stylesheet" 
            />
            
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h4 className="card-title mb-0">App Update Management</h4>
                            </div>
                            <div className="card-body">
                                {/* App Type Dropdown */}
                                <div className="mb-3">
                                    <label htmlFor="app_type" className="form-label">
                                        App Type <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="app_type"
                                        name="app_type"
                                        value={formData.app_type}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="android">Android</option>
                                        <option value="ios">IOS</option>
                                    </select>
                                </div>

                                {/* Version Input */}
                                <div className="mb-3">
                                    <label htmlFor="version" className="form-label">
                                        Version <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="version"
                                        name="version"
                                        value={formData.version}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {/* Force Update Checkbox */}
                                <div className="mb-4">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            id="force_update"
                                            name="force_update"
                                            checked={formData.force_update}
                                            onChange={handleInputChange}
                                            className="form-check-input"
                                        />
                                        <label htmlFor="force_update" className="form-check-label">
                                            Force Update
                                        </label>
                                    </div>
                                    <small className="form-text text-muted">
                                        Check this to make the update mandatory for users
                                    </small>
                                </div>

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <button
                                        type="button"
                                        onClick={appUpdate}
                                        disabled={loading}
                                        className={`btn ${loading ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-cloud-upload me-2"></i>
                                                Update App Version
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Success/Error Message */}
                                {message && (
                                    <div className={`alert ${
                                        messageType === 'success' ? 'alert-success' : 'alert-danger'
                                    } mt-4 d-flex align-items-center`} role="alert">
                                        <div className="me-2">
                                            {messageType === 'success' ? (
                                                <i className="bi bi-check-circle-fill"></i>
                                            ) : (
                                                <i className="bi bi-exclamation-triangle-fill"></i>
                                            )}
                                        </div>
                                        <div>
                                            <strong>
                                                {messageType === 'success' ? 'Success!' : 'Error!'}
                                            </strong> {message}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Info Card */}
                        <div className="card mt-4">
                            <div className="card-body">
                                <h6 className="card-title">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Current Form Data
                                </h6>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <strong>App Type:</strong>
                                    </div>
                                    <div className="col-sm-8">
                                        <span className={`badge ${formData.app_type === 'Android' ? 'bg-success' : 'bg-info'}`}>
                                            {formData.app_type}
                                        </span>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-sm-4">
                                        <strong>Version:</strong>
                                    </div>
                                    <div className="col-sm-8">
                                        {formData.version || <em className="text-muted">Not set</em>}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-sm-4">
                                        <strong>Force Update:</strong>
                                    </div>
                                    <div className="col-sm-8">
                                        <span className={`badge ${formData.force_update ? 'bg-warning' : 'bg-secondary'}`}>
                                            {formData.force_update ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap Icons */}
            <link 
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
                rel="stylesheet" 
            />
        </>
    );
};

export default AppUpdate;