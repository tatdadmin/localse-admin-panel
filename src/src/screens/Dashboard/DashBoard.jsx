import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/userAuthSlice";
import {
  ADD_NOTICE,
  ADD_NOTIFICATION,
  DELETE_NOTICE,
  GET_ALL_ACCESS,
} from "../../apis/Apis";
import getNotices from "../../redux/apicalls/getNotices";
import DateWiseCount from "../reports/DateWiseCount";
import AddServices from "../services/Services";
import FreeOnBoarding from "../FreeOnBoarding/FreeOnBoarding";
import AgentReports from "../reports/AgentReports";
import AgentConversionReport from "../reports/AgentConversionReports";
import ServiceProviderClicks from "../reports/ServiceProviderClicks";
import HourlyFreeOnboardReport from "../reports/FreeOnboardingHorulyReports";
import AgentPanel from "../Agent Panel/AgentPanel";
import ServiceProvidersMap from "../service providers map/ServiceProvidersMap";
import RegistrationFromAdmin from "../Agent Panel/RegistrationFromAdmin";
import Campaign_reports from "../reports/camaignReports";
import BlogPanel from "../Blogs/BlogPanel";
import InstallationReport from "../reports/InstallationReport";
import Videos from "../Videos/Videos";
import MasterAdmin from "../reports/MasterAdmin";
import AppUpdate from "../reports/AppUpdate";
import BuySubscription from "../reports/BuySubscription";
import Business_app_installation_via_call from "../business_app_installation_via_call";
import { setSelectTab } from "../../redux/slices/selectTabSlice";
import MasterReport from "../Master Report";
import { setUserAccess } from "../../redux/slices/userAccessSlice";
import EmployeeAcess from "../EmployeeAccess";
import { persistor } from "../../redux/store";

// Menu bar icon component
const MenuIcon = ({ onClick }) => (
  <div style={styles.menuIcon} onClick={onClick}>
    <div style={styles.menuBar}></div>
    <div style={styles.menuBar}></div>
    <div style={styles.menuBar}></div>
  </div>
);

const SideBar = ({
  onSelect,
  selectedComponent,
  isOpen,
  onClose,
  access = {},
}) => {
  const sidebarStyle = {
    ...styles.sidebar,
    ...(window.innerWidth <= 768 && {
      position: "fixed",
      transform: isOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s ease-in-out",
      zIndex: 999,
      height: "100%",
    }),
  };

  const menuItems = [
    { key: "notice", label: "Notice" },
    { key: "notification", label: "Notification" },
    { key: "reports", label: "Reports" },
    { key: "services", label: "Services" },
    { key: "free_onboarding_report", label: "Free OnBoarding Report" },
    { key: "agent_reports", label: "Agent Reports" },
    { key: "service_provider_clicks", label: "Service Provider Clicks" },
    {
      key: "free_onboarding_hourly_reports",
      label: "Free Onboarding Hourly Reports",
    },
    { key: "service_providers_map", label: "Service Providers Map" },
    { key: "registration_from_admin", label: "Registration From Admin" },
    { key: "campaign_reports", label: "Campaign Reports" },
    { key: "blog_panel", label: "Blog Panel" },
    { key: "installation_report", label: "Installation Report" },
    { key: "video_panel", label: "Video Panel" },
    { key: "master_admin", label: "Master Admin" },
    { key: "app_details", label: "App Update" },
    {
      key: "business_app_installation_via_call",
      label: "Business App Installation Via Call",
    },
    {
      key: "master_report",
      label: "Master Report",
    },
    {
      key: "employee_details",
      label: "Employee Acess",
    },

    // { key: "buy_subscription", label: "Buy Subscription Campaign" },
  ];
console.log(access,"access from siderbar s")
  return (
    <div style={sidebarStyle}>
      <div style={styles.sidebarHeader}>
        <h1 style={styles.sidebarTitle}>LocalSe</h1>
        {window.innerWidth <= 768 && (
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
      </div>
      <div style={styles.menu}>
        {menuItems.map(({ key, label }) => {
          // Only show if access is granted
          // console.log(menuItems)
          if (access[key] != "1") return null;

          const isSelected = selectedComponent === key;

          return (
            <div
              key={key}
              style={{
                ...styles.menuItem,
                backgroundColor: isSelected ? "#f2b4ae" : "white",
              }}
              onClick={() => {
                onSelect(key);
                if (window.innerWidth <= 768) onClose();
              }}
              onMouseOver={(e) => (e.target.style.background = "#ddd")}
              onMouseOut={(e) =>
                (e.target.style.background = isSelected ? "#f2b4ae" : "white")
              }
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    persistor.purge(); 
  };
  const user = useSelector((e) => e?.userAuth?.userAllData);
  console.log(user, "ferwf");
  return (
    <div style={styles.header}>
      {window.innerWidth <= 768 && <MenuIcon onClick={toggleSidebar} />}
      <span>{user?.admin_name}</span>
      <span
        style={styles.logout}
        onMouseOver={(e) => (e.target.style.color = "darkred")}
        onMouseOut={(e) => (e.target.style.color = "red")}
        onClick={handleLogout}
      >
        Logout
      </span>
    </div>
  );
};

// Notice Component
const NoticeList = ({ onOpen }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNotices());
  }, [dispatch]);
  const noticeloader = useSelector((e) => e?.NoticeSlice?.loader);
  const noticeData = useSelector((e) => e?.NoticeSlice?.data);

  const handleDelete = async (id) => {
    try {
      const res = await DELETE_NOTICE({ id: id });
      // console.log(res);
      dispatch(getNotices());
      alert(res?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={styles.listContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <h2>Notices</h2>
        <button
          onClick={() => onOpen("notice")}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>

      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {noticeData &&
          noticeData.map((notice) => (
            <div key={notice?._id} style={styles.listItem}>
              {notice?.content}
              <div>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(notice._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Notification Component
const NotificationList = ({ onOpen }) => {
  return (
    <div style={styles.listContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <h2>Notifications</h2>
        <button
          onClick={() => onOpen("Notification")}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>
      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {/* Notification list items would go here */}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, type, onSubmit }) => {
  const [formData, setFormData] = useState({
    mobile: "",
    subject: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    mobile: "",
    subject: "",
    content: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = () => {
    let newErrors = {};
    if (type !== "notice") {
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      }
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({ mobile: "", subject: "", content: "" });
    setErrors({ mobile: "", subject: "", content: "" });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: window.innerWidth <= 768 ? "90%" : "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          {type === "notice" ? "Add Notice" : "Add Notification"}
        </h2>

        {type !== "notice" && (
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {errors.mobile && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {errors.mobile}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {errors.subject && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.subject}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              minHeight: "80px",
            }}
          />
          {errors.content && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.content}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // const [selectedComponent, setSelectedComponent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const selectedComponent = useSelector((e) => e.selectTabSlice);
  // console.log(selectedComponent, "ReDUX");
  const user = useSelector((e) => e?.userAuth?.userAllData);
  // const userAccess = useSelector((e)=>e?.userAccessSlice)/
// console.log(userAccess,"user ACCesss Slice")
  const dispatch = useDispatch();
  // console.log(user, "userrr");
  useEffect(() => {
    // const userAccess = Object.entries(user?.access);

   
  }, []);
  // useEffect(() => {
  //   sessionStorage.setItem("appLoadedAt", Date.now().toString());

  //   const handleBeforeUnload = () => {
  //     const loadTime = Number(sessionStorage.getItem("appLoadedAt") || 0);
  //     const duration = Date.now() - loadTime;

  //     // Heuristic: treat close vs refresh based on time spent
  //     if (duration > 5000) {
  //     dispatch(setSelectTab("notice"));

  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [dispatch]);
const [userAccess,setUserAccess]=useState({})
  const getAllAccess = async () => {
    try {
      const res = await GET_ALL_ACCESS();
      console.log(res.data, "ALL ACCESS");
      // dispatch(setUserAccess(res?.data))
      setUserAccess(res?.data)
      console.log(res?.data,"STaTE")
      const firstKeyWithValue1 = Object.keys(res?.data).find(
        (key) => res?.data?.[key] == "1"
      );
      console.log(firstKeyWithValue1,"First kry")
      // setSelectedComponent(firstKeyWithValue1);
      console.log(selectedComponent,"selectedcomponent")
      // console.log("Jitendra",Object.keys(res?.data).some((e)=>e==selectedComponent))
      if (!selectedComponent || !Object.keys(res?.data).includes(selectedComponent)) {
        dispatch(setSelectTab(firstKeyWithValue1));
      }

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllAccess();
  }, []);

  const setSelectedComponent = (e) => {
    dispatch(setSelectTab(e));
  };
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    try {
      let response;
      if (modalType === "notice") {
        response = await ADD_NOTICE({
          subject: data?.subject,
          content: data?.content,
          to_all: "1",
          service_provider_mobile_number: data?.mobile,
        });

        if (response?.status_code === 200) {
          dispatch(getNotices());
        }
      } else {
        response = await ADD_NOTIFICATION({
          subject: data?.subject,
          content: data?.content,
          to_all: "0",
          service_provider_mobile_number: data?.mobile,
        });
      }

      if (response?.status_code === 200) {
        alert(response?.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Overlay to close sidebar when clicking outside on mobile
  const Overlay = ({ isOpen, onClose }) => {
    if (!isOpen || windowWidth > 768) return null;

    return <div style={styles.overlay} onClick={onClose} />;
  };

  // const user = useSelector((e) => e?.userAuth?.userAllData);
  console.log(user?.access, "storedaatat");
  const componentMap = {
    notice: <NoticeList onOpen={openModal} />,
    reports: <DateWiseCount />,
    services: <AddServices />,
    freeOnBoarding: <FreeOnBoarding />,
    agentReports: <AgentReports />,
    serviceProviderClicks: <ServiceProviderClicks />,
    FreeOnboardingHourlyReport: <HourlyFreeOnboardReport />,
    serviceProvidersMap: <ServiceProvidersMap />,
    RegistrationFromAdmin: <RegistrationFromAdmin />,
    Campaign_reports: <Campaign_reports />,
    BlogPanel: <BlogPanel />,
    installationReport: <InstallationReport />,
    VideoPanel: <Videos />,
  };
  return (
    <div style={styles.container}>
      <SideBar
        onSelect={setSelectedComponent}
        selectedComponent={selectedComponent}
        isOpen={sidebarOpen}
        access={userAccess}
        onClose={() => setSidebarOpen(false)}
      />
      <Overlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={styles.mainContainer}>
        <Header toggleSidebar={toggleSidebar} />
        <div style={styles.content}>
          {selectedComponent === "notice" ? (
            <NoticeList onOpen={openModal} />
          ) : selectedComponent === "reports" ? (
            <DateWiseCount />
          ) : selectedComponent === "services" ? (
            <AddServices />
          ) : selectedComponent === "free_onboarding_report" ? (
            <FreeOnBoarding />
          ) : selectedComponent === "agent_reports" ? (
            <AgentReports />
          ) : selectedComponent === "service_provider_clicks" ? (
            <ServiceProviderClicks />
          ) : selectedComponent == "free_onboarding_hourly_reports" ? (
            <HourlyFreeOnboardReport />
          ) : selectedComponent == "service_providers_map" ? (
            <ServiceProvidersMap />
          ) : selectedComponent == "registration_from_admin" ? (
            <RegistrationFromAdmin />
          ) : selectedComponent == "campaign_reports" ? (
            <Campaign_reports />
          ) : selectedComponent == "blog_panel" ? (
            <BlogPanel />
          ) : selectedComponent == "installation_report" ? (
            <InstallationReport />
          ) : selectedComponent == "video_panel" ? (
            <Videos />
          ) : selectedComponent == "notification" ? (
            <NotificationList onOpen={openModal} />
          ) : selectedComponent == "master_admin" ? (
            <MasterAdmin />
          ) : selectedComponent == "app_details" ? (
            <AppUpdate />
          ) : selectedComponent == "buy_subscription" ? (
            <BuySubscription />
          ) : selectedComponent == "business_app_installation_via_call" ? (
            <Business_app_installation_via_call />
          ) : selectedComponent == "master_report" ? (
            <MasterReport />
          ) : selectedComponent == "employee_details"?<EmployeeAcess/>:(
            <></>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        type={modalType}
        onSubmit={(e) => handleSubmit(e)}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f4f4f4",
    overflow: "hidden",
    position: "relative",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#121212",
    color: "white",
    height: "100vh",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sidebarTitle: {
    fontSize: "24px",
    margin: 0,
  },
  closeButton: {
    background: "none",
    color: "white",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0 10px",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  menuItem: {
    background: "white",
    color: "black",
    padding: "10px",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: "15px 20px",
    fontWeight: "bold",
  },
  logout: {
    color: "red",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    height: "calc(100vh - 60px)",
  },
  listContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  editButton: {
    marginRight: "10px",
    padding: "5px 10px",
    background: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  menuIcon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "24px",
    height: "20px",
    cursor: "pointer",
  },
  menuBar: {
    width: "100%",
    height: "3px",
    backgroundColor: "#333",
    margin: "2px 0",
    borderRadius: "2px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 998,
  },
};

export default Dashboard;
