import React, { useState, useEffect } from "react";
import {
  CREATE_BLOG,
  DELETE_BLOG,
  GET_BLOGS,
  UPDATE_BLOG,
} from "../../apis/Apis";
import { useSelector } from "react-redux";

const BlogPanel = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((e) => e?.userAuth?.userAllData);

  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorName: user?.admin_name,
    image: null,
  });

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    setLoading(true);
    try {
      const res = await GET_BLOGS();
      if (res.success) {
        setBlogs(res.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      authorName: "",
      image: null,
    });
    setEditingBlog(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      authorName: blog.author_name,
      image: null,
    });
    setEditingBlog(blog);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!formData.title || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("authorName", user?.admin_name);
    if (formData.image) {
      data.append("images", formData.image);
    }

    setLoading(true);
    try {
      if (editingBlog) {
        // Update existing blog
        const res = await UPDATE_BLOG(editingBlog._id, data);
        console.log(res);
        alert("Blog updated successfully!");
        getBlogs();
        closeModal();
      } else {
        // Create new blog - ADD PROPER ERROR HANDLING
        const res = await CREATE_BLOG(data);
        console.log("Create response:", res); // Add this for debugging
        alert("Blog created successfully!");
        getBlogs();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      // More specific error handling
      const errorMessage =
        error?.message || error?.error || "Failed to save blog";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await DELETE_BLOG(id);
      //   if (res.success) {
      alert("Blog deleted successfully!");
      getBlogs();
      //   }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit",
      hour12: false, // <--- forces 24-hour time
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <>
      {/* Bootstrap CSS */}
      {/* <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      /> */}

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Blog Management Panel</h2>
              <button
                className="btn btn-primary"
                onClick={openCreateModal}
                disabled={loading}
              >
                <i className="fas fa-plus me-2"></i>
                Create New Blog
              </button>
            </div>

            {loading && (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {!loading && blogs.length === 0 && (
              <div className="text-center my-5">
                <p className="text-muted">
                  No blogs found. Create your first blog!
                </p>
              </div>
            )}

            {!loading && blogs.length > 0 && (
              <div className="row">
                {blogs.map((blog) => (
                  <div key={blog._id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                      {blog.image_url && (
                        <img
                          src={blog.image_url}
                          className="card-img-top"
                          alt={blog.title}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{blog.title}</h5>
                        <p className="card-text flex-grow-1">
                          {truncateContent(blog.content)}
                        </p>
                        <div className="mt-auto">
                          <small className="text-muted d-block mb-2">
                            By {blog.author_name} |{" "}
                            {formatDate(blog.updated_at)}
                          </small>
                          <div className="btn-group w-100" role="group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openEditModal(blog)}
                              disabled={loading}
                            >
                              <i className="fas fa-edit me-1"></i>
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(blog._id)}
                              disabled={loading}
                            >
                              <i className="fas fa-trash me-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal for Create/Edit */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingBlog ? "Edit Blog" : "Create New Blog"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={loading}
                  ></button>
                </div>
                <div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* <div className="mb-3">
                      <label htmlFor="authorName" className="form-label">Author Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="authorName"
                        name="authorName"
                        value={formData.authorName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div> */}

                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        Content *
                      </label>
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        rows="8"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                        {editingBlog ? "Update Image (optional)" : "Image *"}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                      {editingBlog && (
                        <small className="form-text text-muted">
                          Leave empty to keep current image
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          {editingBlog ? "Updating..." : "Creating..."}
                        </>
                      ) : editingBlog ? (
                        "Update Blog"
                      ) : (
                        "Create Blog"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap JS */}
      {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script> */}
      {/* Font Awesome for icons */}
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" /> */}
    </>
  );
};

export default BlogPanel;
