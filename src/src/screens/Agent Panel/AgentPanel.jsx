import React, { useCallback, useEffect, useRef, useState } from "react";
import { ADD_NEW_PROVIDER, GET_AGENT_PANEL_DETAILS } from "../../apis/Apis";
import { useNavigate } from "react-router-dom";
// import { useNavigation } from "react-router-dom";

// Mock API functions - replace with your actual API implementations
const mockApiCall = (data) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data, status: 1 }), 1000)
  );

// const ADD_NEW_PROVIDER = mockApiCall;
const CHECK_SUBSCRIPTION_STATUS = mockApiCall;
const DELETE_PENDING_LEADS = mockApiCall;
const Fetch_ALL_LEADS = mockApiCall;
// const GET_AGENT_PANEL_DETAILS = mockApiCall;
const GET_SERVICE_PROVIDER_DATA = mockApiCall;
const SEND_REQUEST_FOR_HELP = mockApiCall;
const SHOW_HELP_BTN = mockApiCall;

// Mock Redux selectors - replace with your actual Redux implementation
const useSelector = (selector) => {
  const mockState = {
    userAuth: {
      languageSwitch: "en",
      decodedToken: {
        mobile_number: "9876543210",
      },
    },
  };
  return selector(mockState);
};

// Mock navigation - replace with your actual navigation implementation
// const useNavigation = () => ({
//   goBack: () => window.history.back(),
//   navigate: (screen, params) => console.log("Navigate to:", screen, params),
// });
// const navigation = useNavigation()

// Mock language functions
const changeStaticLanguage = (translations, language) =>
  translations[language] || translations.en;
const changeDynamicLanguage = (message, key, language) => message;

const AgentPanel = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [agentDetails, setAgentDetails] = useState({});
  const [leads, setLeads] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const buttonRef = useRef(null);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const languageSwitch = useSelector((e) => e?.userAuth?.languageSwitch);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const serviceProviderMobileNumber = useSelector(
    (e) => e?.userAuth?.decodedToken?.mobile_number
  );
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [providerData, setProviderData] = useState({});
  const [agentLoader, setAgentLoader] = useState(false);
  const [isShow, setisShow] = useState(true);
  const [selectedMob, setselectedMob] = useState(null);

  const [providerTypeModalVisible, setProviderTypeModalVisible] =
    useState(false);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedMobileForProvider, setSelectedMobileForProvider] =
    useState("");

  const navigation = useNavigate();

  const openOptions = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({ x: rect.left, y: rect.bottom });
    }
    setTimeout(() => {
      setOptionModalVisible(true);
    }, 10);
  };

  const getAgentDetails = useCallback(async () => {
    try {
      const res = await GET_AGENT_PANEL_DETAILS();
      // console.log(res);
      setAgentDetails((prev) => ({ ...prev, ...res?.data }));
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  }, []);

  const fetchRecentLeads = async () => {
    try {
      const res = await Fetch_ALL_LEADS({ data_limit: "5" });
      // console.log(res, "recent leads");
      setLeads(res?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getServiceProviderDetails = useCallback(async () => {
    try {
      const response = await GET_SERVICE_PROVIDER_DATA();
      // console.log(response, "GET_SERVICE_PROVIDER_DATA");
      setProviderData(response?.data || {});
    } catch (error) {
      console.log(error, "error getServiceProviderDetails");
    } finally {
      setAgentLoader(false);
    }
  }, []);

  const showHelp = async () => {
    try {
      const res = await SHOW_HELP_BTN();
      console.log(res, "agentPanel call support");
      setisShow(res?.data == "1");
    } catch (error) {
      console.log(error, "err agent Panel Call support");
    }
  };

  useEffect(() => {
    setAgentLoader(true);
    getAgentDetails();
    getServiceProviderDetails();
    showHelp();
    fetchRecentLeads();
  }, []);

  // Add these state variables to your component
  const [freeOnboardingModalVisible, setFreeOnboardingModalVisible] =
    useState(false);
  const [selectedMobileForOnboarding, setSelectedMobileForOnboarding] =
    useState("");

  // Replace the freeOnBoardingAccess function with this:
  const freeOnBoardingAccess = (mobile) => {
    setSelectedMobileForOnboarding(mobile);
    setFreeOnboardingModalVisible(true);
  };

  const handleFreeOnBoarding = async (mobile, type) => {
    try {
      const res = await ADD_NEW_PROVIDER({
        service_provider_mobile_number: mobile,
        service_provider_type: type,
      });
      console.log(res);
      setModalVisible(false);
      console.log({
        phoneNumber: mobile,
        type: type,
      });
      // return false
      navigate("/RegisterFreeOnboardingBusiness", {
        phoneNumber: mobile,
        type: type,
      });
    } catch (error) {
      console.log(error, "error in free onboarding");
      // if (error?.status_code == "400") {
      //   alert(`⚠️ ${error?.message}`);
      // }
    }
  };

  const addNewProvider = async (type, mobileNumber) => {
    try {
      console.log(agentDetails);
      const businessAccess = agentDetails?.agent_panel_business_access == "1";
      const individualAccess =
        agentDetails?.agent_panel_individual_access == "1";
      const freeOnboarding =
        agentDetails?.agent_panel_free_onboarding_access == "1";

      const options = [];

      if (individualAccess) {
        options.push("Add Individual Service Provider");
      }
      if (businessAccess) {
        options.push("Add Business Partners");
      }
      if (freeOnboarding) {
        options.push("Free Onboarding");
      }

      if (options.length === 0) {
        alert(
          "Access Denied ❌\nYou do not have permission to add any service provider."
        );
      } else if (options.length === 1) {
        setModalVisible(false);
        if (options[0] === "Add Individual Service Provider") {
          handleRegister(mobileNumber, "individual");
        } else if (options[0] === "Add Business Partners") {
          handleRegister(mobileNumber, "business");
        } else {
          freeOnBoardingAccess(mobileNumber);
        }
      } else {
        // Show modal instead of prompt
        setAvailableOptions(options);
        setSelectedMobileForProvider(mobileNumber);
        setModalVisible(false);
        setProviderTypeModalVisible(true);
      }

      getAgentDetails();
      fetchRecentLeads();
    } catch (error) {
      alert(`Error ❌\n${error.message}`);
      console.log(error);
    }
  };

  const handleAddServiceProvider = () => {
    if (!mobileNumber) {
      alert("Error\nPlease Enter Number");
      return;
    } else if (mobileNumber.length !== 10) {
      alert("Error\nPlease enter a 10-digit mobile number");
      return;
    }
    addNewProvider("", mobileNumber);
  };

  const registerServiceProvider = async (mob) => {
    try {
      const response = await CHECK_SUBSCRIPTION_STATUS({
        service_provider_mobile_number: mob,
      });
      console.log(response, "checkSubscriptionStatus api response");
      return response?.status == 1;
    } catch (error) {
      console.log(error, "Error api checkSubscriptionStatus");
      return false;
    }
  };

  const handleRegister = async (item, type) => {
    try {
      setModalVisible(false);
      const res = await ADD_NEW_PROVIDER({
        service_provider_mobile_number: item,
        service_provider_type: type == "business" ? "Business" : "Individual",
      });
      console.log(res);

      const isSubscribed = await registerServiceProvider(item);

      if (type == "business") {
        navigate(
          isSubscribed
            ? "BusinessShowAllServices"
            : "BusinessRegistrationTerms",
          { phoneNumber: item }
        );
      } else {
        navigate(
          isSubscribed ? "ShowServiceProviderAllServices" : "SubscriptionPlans",
          { from: "other", phoneNumber: item }
        );
      }
    } catch (err) {
      console.log("Error in handleRegister:", err);
      alert(`⚠️\n${err.message || "Something went wrong. Please try again."}`);
    }
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleWhatsapp = (phoneNumber) => {
    window.open(`https://wa.me/91${phoneNumber}`, "_blank");
  };

  const handleDelete = (lead) => {
    console.log("Remove provider:", lead);
    if (
      window.confirm(
        "Confirm\nDo you really want to delete this provider? This action cannot be undone."
      )
    ) {
      deleteLead(lead);
    }
  };

  const deleteLead = async (id) => {
    try {
      const res = await DELETE_PENDING_LEADS({ id: id });
      console.log(res);
      fetchRecentLeads();
      getAgentDetails();
    } catch (err) {
      console.log(err);
    }
  };

  const sendRequestForHelp = async () => {
    console.log(providerData, "DATA");
    try {
      const res = await SEND_REQUEST_FOR_HELP({
        triggered_from: "Agent panel",
        driver_name:
          providerData?.service_provider_name || providerData?.business_name,
        pincode: "",
        services: providerData?.service_type,
        city: providerData?.aadhaar_address,
        zone: "",
        language: languageSwitch,
        driver_mobile_number: serviceProviderMobileNumber,
      });
      console.log(res.data, "request sent for help");
      alert(
        `✅\n${changeDynamicLanguage(
          res?.data?.success_message,
          "success_message",
          languageSwitch
        )}`
      );
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();

  const Header = () => {
    const dotsRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const openOptions = () => {
      if (dotsRef.current) {
        const rect = dotsRef.current.getBoundingClientRect();
        setPosition({ x: rect.left - 120, y: rect.bottom + 12 });
        setModalVisible(true);
      }
    };

    return (
      <div>
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => navigation.goBack()}
              style={styles.iconButton}
            >
              ←
            </button>
            <h1 style={styles.headerTitle}>Agent Panel</h1>
          </div>
          <div style={styles.headerActions}>
            <button
              ref={dotsRef}
              onClick={openOptions}
              style={styles.iconButton}
            >
              ⋮
            </button>
          </div>
        </div>

        {modalVisible && (
          <div style={styles.overlay} onClick={() => setModalVisible(false)}>
            <div
              style={{
                ...styles.dropdownMenu,
                left: position.x,
                top: position.y,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isShow && (
                <button
                  style={styles.dropdownItem}
                  onClick={() => {
                    sendRequestForHelp();
                    setModalVisible(false);
                  }}
                >
                  📞{" "}
                  {changeStaticLanguage(
                    {
                      bn: "কল সাপোর্ট",
                      en: "Call Support",
                      hi: "कॉल सहायता",
                      ml: "കോൾ പിന്തുണ",
                      mr: "कॉल समर्थन",
                      ta: "அழைப்பு ஆதரவு",
                      te: "కాల్ మద్దతు",
                      ur: "کال سپورٹ",
                      kn: "ಕಾಲ್ ಬೆಂಬಲ",
                    },
                    languageSwitch
                  )}
                </button>
              )}
              <button
                style={styles.dropdownItem}
                onClick={() => {
                  navigate("BankDetailsScreen");
                  setModalVisible(false);
                }}
              >
                💳{" "}
                {changeStaticLanguage(
                  {
                    bn: "ব্যাংক বিবরণ",
                    en: "Bank Details",
                    hi: "बैंक विवरण",
                    ml: "ബാങ്ക് വിശദാംശങ്ങൾ",
                    mr: "बँक तपशील",
                    ta: "வங்கி விவரங்கள்",
                    te: "బ్యాంక్ వివరాలు",
                    ur: "بینک کی تفصیلات",
                    kn: "ಬ್ಯಾಂಕ್ ವಿವರಗಳು",
                  },
                  languageSwitch
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleRefresh = () => {
    setRefresh(true);
    getAgentDetails();
    getServiceProviderDetails();
    showHelp();
    fetchRecentLeads();
    setTimeout(() => setRefresh(false), 1000);
  };

  return (
    <div style={styles.safeArea}>
      <Header />
      {agentLoader ? (
        <div style={styles.loaderContainer}>
          <div style={styles.loader}></div>
        </div>
      ) : (
        <div style={styles.scrollView}>
          <button
            onClick={handleRefresh}
            style={styles.refreshButton}
            disabled={refresh}
          >
            {refresh ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>

          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.profileImageContainer}>
                <img
                  style={styles.profileImagePlaceholder}
                  src={agentDetails?.agent_image}
                  alt="Agent"
                />
              </div>
              <div style={styles.profileInfo}>
                <h2 style={styles.profileName}>
                  {agentDetails?.agent_name || agentDetails?.business_name}
                </h2>
                <div style={styles.ratingContainer}>
                  {Array.from({
                    length: Math.floor(agentDetails?.agent_rating || 0),
                  }).map((_, i) => (
                    <span key={i} style={styles.star}>
                      ⭐
                    </span>
                  ))}
                  <span style={styles.ratingText}>
                    {agentDetails?.agent_rating}
                  </span>
                </div>
                <p style={styles.profileAddress}>
                  📍 {agentDetails?.agent_address}
                </p>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.statsContainer}>
              <button
                onClick={() =>
                  navigate("ViewAllLeads", {
                    selectedList: "pending",
                  })
                }
                style={styles.statItem}
              >
                <div style={styles.statValue}>{agentDetails?.leads_added}</div>
                <div style={styles.statLabel}>Leads</div>
              </button>
              <div style={styles.statDivider} />
              <button
                onClick={() =>
                  navigate("ViewAllLeads", {
                    selectedList: "registered",
                  })
                }
                style={styles.statItem}
              >
                <div style={styles.statValue}>
                  {agentDetails?.leads_registered}
                </div>
                <div style={styles.statLabel}>Registered</div>
              </button>
              <div style={styles.statDivider} />
              <button
                onClick={() => navigate("Earnings")}
                style={styles.statItem}
              >
                <div style={styles.statValue}>
                  {agentDetails?.total_earning}
                </div>
                <div style={styles.statLabel}>Earning</div>
              </button>
              <div style={styles.statDivider} />
              <button
                onClick={() => navigate("DuePayment")}
                style={styles.statItem}
              >
                <div style={styles.statValue}>{agentDetails?.total_due}</div>
                <div style={styles.statLabel}>Due</div>
              </button>
            </div>
          </div>

          <button
            style={styles.addButton}
            onClick={() => {
              setModalVisible(true);
              setMobileNumber("");
            }}
          >
            👤 Add Service Provider
          </button>
        </div>
      )}

      {isModalVisible && (
        <div style={styles.overlay} onClick={() => setModalVisible(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add Service Provider</h3>
              <button
                onClick={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <label style={styles.inputLabel}>Mobile Number</label>
              <div style={styles.inputContainer}>
                <span style={styles.countryCode}>+91</span>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
              <p style={styles.inputHelp}>
                Please ensure the service provider is not already registered
              </p>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmButton}
                onClick={handleAddServiceProvider}
              >
                Add Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {providerTypeModalVisible && (
        <div
          style={styles.overlay}
          onClick={() => setProviderTypeModalVisible(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add Service Provider</h3>
              <button
                onClick={() => setProviderTypeModalVisible(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <p style={styles.modalDescription}>
                Choose the type of service provider to add:
              </p>

              {availableOptions.map((option, index) => (
                <button
                  key={index}
                  style={
                    index === 0
                      ? styles.providerTypeButton
                      : styles.providerTypeButton2
                  }
                  onClick={() => {
                    if (option === "Add Individual Service Provider") {
                      handleRegister(selectedMobileForProvider, "individual");
                    } else if (option === "Add Business Partners") {
                      handleRegister(selectedMobileForProvider, "business");
                    } else {
                      freeOnBoardingAccess(selectedMobileForProvider);
                    }
                    setProviderTypeModalVisible(false);
                  }}
                >
                  {option === "Add Individual Service Provider" && "👤 "}
                  {option === "Add Business Partners" && "🏢 "}
                  {option === "Free Onboarding" && "🆓 "}
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {freeOnboardingModalVisible && (
        <div
          style={styles.overlay}
          onClick={() => setFreeOnboardingModalVisible(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Select Account Type</h3>
              <button
                onClick={() => setFreeOnboardingModalVisible(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <p style={styles.modalDescription}>
                Choose the account type for free onboarding:
              </p>

              <button
                style={styles.providerTypeButton}
                onClick={() => {
                  handleFreeOnBoarding(
                    selectedMobileForOnboarding,
                    "Free_Onboarding_Individual"
                  );
                  setFreeOnboardingModalVisible(false);
                }}
              >
                👤 Individual Account
              </button>

              <button
                style={styles.providerTypeButton2}
                onClick={() => {
                  handleFreeOnBoarding(
                    selectedMobileForOnboarding,
                    "Free_Onboarding_Business"
                  );
                  setFreeOnboardingModalVisible(false);
                }}
              >
                🏢 Business Account
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalVisible2 && (
        <div style={styles.overlay} onClick={() => setModalVisible2(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add Service Provider</h3>
              <button
                onClick={() => setModalVisible2(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <button
                style={styles.providerTypeButton}
                onClick={() => handleRegister(selectedMob, "individual")}
              >
                Add Individual Service Provider
              </button>
              <button
                style={styles.providerTypeButton2}
                onClick={() => handleRegister(selectedMob, "business")}
              >
                Add Business Service Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {freeOnboardingModalVisible && (
        <div
          style={styles.overlay}
          onClick={() => setFreeOnboardingModalVisible(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Select Account Type</h3>
              <button
                onClick={() => setFreeOnboardingModalVisible(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <p style={styles.modalDescription}>
                Choose the account type for free onboarding:
              </p>

              <button
                style={styles.providerTypeButton}
                onClick={() => {
                  handleFreeOnBoarding(
                    selectedMobileForOnboarding,
                    "Free_Onboarding_Individual"
                  );
                  setFreeOnboardingModalVisible(false);
                }}
              >
                👤 Individual Account
              </button>

              <button
                style={styles.providerTypeButton2}
                onClick={() => {
                  handleFreeOnBoarding(
                    selectedMobileForOnboarding,
                    "Free_Onboarding_Business"
                  );
                  setFreeOnboardingModalVisible(false);
                }}
              >
                🏢 Business Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modalDescription: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
    textAlign: "center",
  },
  safeArea: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4CAF50",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
  },
  iconButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    padding: "4px 8px",
  },
  scrollView: {
    padding: "16px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  refreshButton: {
    marginBottom: "16px",
    padding: "8px 16px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  profileHeader: {
    display: "flex",
    padding: "16px",
  },
  profileImageContainer: {
    marginRight: "16px",
  },
  profileImagePlaceholder: {
    width: "70px",
    height: "70px",
    borderRadius: "35px",
    border: "2px solid #4CAF50",
    objectFit: "cover",
  },
  profileInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  profileName: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
    margin: 0,
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "6px",
  },
  star: {
    fontSize: "16px",
    marginRight: "2px",
  },
  ratingText: {
    marginLeft: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#666",
  },
  profileAddress: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  divider: {
    height: "1px",
    backgroundColor: "#f0f0f0",
    margin: "0 16px",
  },
  statsContainer: {
    display: "flex",
    padding: "16px",
  },
  statItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#666",
  },
  statDivider: {
    width: "1px",
    backgroundColor: "#f0f0f0",
  },
  addButton: {
    display: "flex",
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
    padding: "14px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    marginBottom: "16px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  overlay: {
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
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    margin: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #f0f0f0",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#999",
    cursor: "pointer",
    padding: "4px",
  },
  modalContent: {
    padding: "16px",
  },
  inputLabel: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "6px",
    display: "block",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
  },
  countryCode: {
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #ddd",
    color: "#333",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    color: "#333",
    border: "none",
    outline: "none",
  },
  inputHelp: {
    fontSize: "12px",
    color: "#999",
    marginTop: "8px",
  },
  modalActions: {
    display: "flex",
    borderTop: "1px solid #f0f0f0",
    padding: "16px",
    gap: "8px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f8f9fa",
    border: "none",
    borderRadius: "8px",
    color: "#666",
    fontWeight: "500",
    cursor: "pointer",
  },
  confirmButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  providerTypeButton: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    backgroundColor: "purple",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  providerTypeButton2: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    width: "150px",
    backgroundColor: "#E9EEF6",
    padding: "8px 0",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1001,
  },
  dropdownItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#333",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #4CAF50",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Add CSS animation for loader
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100%

export default AgentPanel;
