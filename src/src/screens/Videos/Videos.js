import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Youtube,
  Facebook,
  Instagram,
  Linkedin,
  X,
  Check,
  Upload,
  Video,
} from "lucide-react";

// Import your actual API functions
import {
  ADD_VIDEO_IN_ADMIN_PANEL,
  DELETE_VIDEO,
  GET_ALL_VIDEOS,
  SERVICES_TYPE_LIST_SERVICE_PROVIDER,
  UPDATE_VIDEO,
  UPLOAD_VIDEO,
} from "../../apis/Apis";
import { useNavigate } from "react-router-dom";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    video_url: "",
    view_status: "1",
    target_area_code: ["None"],
    social_links_youtube: "",
    social_links_instagram: "",
    social_links_linkedin: "",
    social_links_facebook: "",
    service_type: "",
    mobile_number_interviewer: "",
    video_path: "",
    static_views:""
  });

  const getAllVideos = async () => {
    try {
      setLoading(true);
      const res = await GET_ALL_VIDEOS();
      if (res.status_code === 200) {
        console.log(res?.data);
        setVideos(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTargetAreaChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      target_area_code: [value],
    }));
  };

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const validateVideoFile = (file) => {
    const maxSize = 15 * 1024 * 1024; // 15MB in bytes
    const maxDuration = 54; // 54 seconds

    if (file.size > maxSize) {
      alert("Video size should be less than or equal to 15MB");
      return false;
    }

    // Create video element to check duration
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > maxDuration) {
          alert("Video duration should be less than or equal to 54 seconds");
          resolve(false);
        } else {
          resolve(true);
        }
      };
      
      video.onerror = () => {
        alert("Invalid video file");
        resolve(false);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate video file
    const isValid = await validateVideoFile(file);
    if (!isValid) {
      e.target.value = ''; // Clear the input
      return;
    }

    try {
      setVideoUploading(true);
      
      // Create FormData for video upload
      const formDataForUpload = new FormData();
      formDataForUpload.append('video', file);

      const res = await UPLOAD_VIDEO(formDataForUpload);
      
      if (res.status_code === 200) {
        // Update form data with the returned video URL
        setFormData(prev => ({
          ...prev,
          video_path: res.data.video_url
        }));
        alert("Video uploaded successfully!");
      } else {
        alert("Failed to upload video. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setVideoUploading(false);
      e.target.value = ''; // Clear the input
    }
  };

  const handleSubmit = async () => {
    if (!validateYouTubeUrl(formData.video_url)) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    if (!formData.mobile_number_interviewer.trim()) {
      alert("Please enter interviewer mobile number");
      return;
    }

    try {
      if (editingVideo) {
        // Update existing video
        await UPDATE_VIDEO({
          action: "update",
          _id: editingVideo._id,
          ...formData,
        });
      } else {
        // Create new video
        await ADD_VIDEO_IN_ADMIN_PANEL({
          action: "create",
          ...formData,
        });
      }

      // Reset form and refresh videos
      resetForm();
      getAllVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Failed to save video. Please try again.");
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    console.log(video, "EDDD");
    setFormData({
      subject: video.subject,
      video_url: video.video_url,
      view_status: video.view_status,
      target_area_code: video.target_area_code || ["None"],
      social_links_youtube: video.social_links?.youtube || "",
      social_links_instagram: video.social_links?.instagram || "",
      social_links_linkedin: video.social_links?.linkedin || "",
      social_links_facebook: video.social_links?.facebook || "",
      service_type: video?.service_type,
      mobile_number_interviewer: video?.mobile_number_interviewer || "",
      video_path: video?.video_path || "",
      static_views:video?.static_views
    });
    setShowForm(true);
  };

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await DELETE_VIDEO({ _id: videoId });
        getAllVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      video_url: "",
      view_status: "1",
      target_area_code: ["None"],
      social_links_youtube: "",
      social_links_instagram: "",
      social_links_linkedin: "",
      social_links_facebook: "",
      service_type: "",
      mobile_number_interviewer: "",
      video_path: "",
      static_views:""
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return videoId
      ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
      : null;
  };

  const [allServices, setallServices] = useState([]);
  const fetchServices = async () => {
    try {
      const res = await SERVICES_TYPE_LIST_SERVICE_PROVIDER();
      setallServices(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div
        className="container-fluid py-4"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        <div className="container">
          <div className="card shadow-sm">
            {/* Header */}
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="h2 mb-0 text-dark fw-bold">Video Admin Panel</h1>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    <Plus size={20} />
                    Add New Video
                  </button>
                  <button
                    onClick={() => navigate("/subscription_campaign")}
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    <Plus size={20} />
                    Subscription Campaign
                  </button>
                </div>
              </div>
            </div>

            {/* Video Form Modal */}
            {showForm && (
              <div
                className="modal show d-block"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {editingVideo ? "Edit Video" : "Add New Video"}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={resetForm}
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="form-control"
                          placeholder="Enter video subject"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Mobile Number (Interviewer) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile_number_interviewer"
                          value={formData.mobile_number_interviewer}
                          onChange={handleInputChange}
                          required
                          className="form-control"
                          placeholder="Enter interviewer mobile number"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          YouTube Video URL{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="url"
                          name="video_url"
                          value={formData.video_url}
                          onChange={handleInputChange}
                          required
                          className="form-control"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>


                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                        Static views
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="static_views"
                          value={formData.static_views}
                          onChange={handleInputChange}
                          required
                          className="form-control"
                          // placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      {/* Video Upload Section */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Upload Video
                          <small className="text-muted ms-2">
                            (Max: 54 seconds, 15MB)
                          </small>
                        </label>
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="form-control"
                            disabled={videoUploading}
                          />
                          {videoUploading && (
                            <div className="d-flex align-items-center gap-2 text-primary">
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Uploading...</span>
                              </div>
                              <small>Uploading...</small>
                            </div>
                          )}
                        </div>
                        <small className="form-text text-muted">
                          <Video size={14} className="me-1" />
                          Video duration should be ≤ 54 seconds and file size ≤ 15MB
                        </small>
                      </div>

                      {/* Video Path (Disabled Field) */}
                      {formData.video_path && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Uploaded Video URL
                          </label>
                          <input
                            type="text"
                            value={formData.video_path}
                            disabled
                            className="form-control"
                            placeholder="Video URL will appear here after upload"
                          />
                          <small className="form-text text-success">
                            <Check size={14} className="me-1" />
                            Video uploaded successfully
                          </small>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Target Area Code
                        </label>
                        <select
                          value={formData.target_area_code[0]}
                          onChange={handleTargetAreaChange}
                          className="form-select"
                        >
                          <option value="None">None</option>
                          <option value="1">Target Area 1</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          View Status
                        </label>
                        <select
                          name="view_status"
                          value={formData.view_status}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Service Type
                        </label>
                        <select
                          name="service_type"
                          value={formData.service_type}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          <option value="">None</option>
                          {allServices?.map((e) => (
                            <option key={e} value={e}>
                              {e}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Social Links */}
                      <div className="border-top pt-3">
                        <h6 className="fw-semibold mb-3">Social Links</h6>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">YouTube</label>
                            <input
                              type="url"
                              name="social_links_youtube"
                              value={formData.social_links_youtube}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://youtube.com/..."
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">Instagram</label>
                            <input
                              type="url"
                              name="social_links_instagram"
                              value={formData.social_links_instagram}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://instagram.com/..."
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">LinkedIn</label>
                            <input
                              type="url"
                              name="social_links_linkedin"
                              value={formData.social_links_linkedin}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://linkedin.com/..."
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">Facebook</label>
                            <input
                              type="url"
                              name="social_links_facebook"
                              value={formData.social_links_facebook}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://facebook.com/..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-primary d-flex align-items-center gap-2"
                        disabled={videoUploading}
                      >
                        <Check size={18} />
                        {editingVideo ? "Update Video" : "Create Video"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Videos List */}
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading videos...</p>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">
                    No videos found. Create your first video!
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {videos.map((video) => (
                    <div key={video._id} className="col-lg-4 col-md-6">
                      <div className="card h-100 shadow-sm">
                        {/* Video Thumbnail */}
                        <div className="position-relative">
                          <img
                            src={
                              getYouTubeThumbnail(video.video_url) ||
                              "/api/placeholder/400/225"
                            }
                            alt={video.subject}
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            {video.view_status === "1" ? (
                              <span className="badge bg-success rounded-pill">
                                <Eye size={16} />
                              </span>
                            ) : (
                              <span className="badge bg-danger rounded-pill">
                                <EyeOff size={16} />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="card-body d-flex flex-column">
                          <h5
                            className="card-title text-truncate"
                            title={video.subject}
                          >
                            {video.subject}
                          </h5>

                          <div className="text-muted small mb-3">
                            <div>Video ID: {video.video_id}</div>
                            <div>
                              Target Area:{" "}
                              {video.target_area_code?.join(", ") || "None"}
                            </div>
                            <div>Views: {video.video_watch_count || 0}</div>
                            <div>Static Views: {video.static_views || 0}</div>


                            {video.mobile_number_interviewer && (
                              <div>Mobile: {video.mobile_number_interviewer}</div>
                            )}
                          </div>

                          {/* Social Links */}
                          <div className="d-flex gap-2 mb-3">
                            {video.social_links?.youtube && (
                              <a
                                href={video.social_links.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-danger text-decoration-none"
                              >
                                <Youtube size={20} />
                              </a>
                            )}
                            {video.social_links?.facebook && (
                              <a
                                href={video.social_links.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-decoration-none"
                              >
                                <Facebook size={20} />
                              </a>
                            )}
                            {video.social_links?.instagram && (
                              <a
                                href={video.social_links.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                style={{ color: "#E4405F" }}
                              >
                                <Instagram size={20} />
                              </a>
                            )}
                            {video.social_links?.linkedin && (
                              <a
                                href={video.social_links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                style={{ color: "#0077B5" }}
                              >
                                <Linkedin size={20} />
                              </a>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-auto d-flex justify-content-end gap-2">
                          {/* video.mobile_number_interviewer */}
                        
                        {
                          video.mobile_number_interviewer && video?.video_path && <button
                          onClick={() => {
                            // navigate("/subscription_campaign")
                            navigate(
                              `/subscription_campaign?mobile=${encodeURIComponent(video.mobile_number_interviewer)}&videoUrl=${encodeURIComponent(video?.video_path)}`
                            );
                          }}
                          className="btn btn-outline-primary btn-sm"
                          title="Edit Video"
                        >
                          Send Whatsapp
                        </button>
                        } 
                            <button
                              onClick={() => handleEdit(video)}
                              className="btn btn-outline-primary btn-sm"
                              title="Edit Video"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(video._id)}
                              className="btn btn-outline-danger btn-sm"
                              title="Delete Video"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap JS CDN */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default Videos;