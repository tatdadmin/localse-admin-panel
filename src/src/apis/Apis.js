// import axios from "axios";
import _Fetch from "./Service";
import fetchService from "./Service2";

export const ADMIN_LOGIN = (body) => {
  console.log("ADMIN_LOGIN Called with Credentials:", body);
  return _Fetch("POST", "admin_panel/login", body, {});
};

export const ADD_NOTIFICATION = (body) => {
  // console.log("ADD_NOTIFICATION Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/create-notification", body, {});
};

export const ADD_NOTICE = (body) => {
  // console.log("ADD_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/create-notice", body, {});
};

export const GET_ALL_NOTICE = (body) => {
  // console.log("GET_ALL_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("GET", "admin_panel/get-notice", body, {});
};

export const DELETE_NOTICE = (body) => {
  // console.log("GET_ALL_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/delete-notice", body, {});
};
export const DATE_WISE_REPORT = () => {
  // console.log("GET_ALL_NOTICE Called with BODY:",);
  // return false;
  return _Fetch("GET", "admin_panel/payment-date-wise-count", {}, {});
};
export const GET_SERVICES = () => {
  // console.log("GET_ALL_NOTICE Called with BODY:",);
  // return false;
  return _Fetch("GET", "admin_panel/get-service", {}, {});
};
export const ADD_NEW_SERVICE = (body) => {
  return _Fetch("POST", "admin_panel/add-service", body, {});
};
export const DELETE_SERVICE = (body) => {
  return _Fetch("POST", "admin_panel/delete-service", body, {});
};

export const GET_FREE_ONBOARDING_REGISTRATIONS = (body) => {
  return _Fetch(
    "GET",
    "admin_panel/free-onboarding-active-inactive-status-datewise",
    body,
    {}
  );
};

export const SHOW_INACTIVE_FREE_ONBOARDING_REGISTRATIONS = (body) => {
  return _Fetch(
    "POST",
    "admin_panel/free-onboarding-inactive-status-details",
    body,
    {}
  );
};

export const SHOW_ACTIVE_FREE_ONBOARDING_REGISTRATIONS = (body) => {
  return _Fetch(
    "POST",
    "admin_panel/free-onboarding-active-status-details",
    body,
    {}
  );
};

export const SHOW_ALL_INACTIVE_FREE_ONBOARDING_REGISTRATIONS = (body) => {
  return _Fetch(
    "POST",
    "admin_panel/free-onboarding-active-inactive-status-all",
    body,
    {}
  );
};

export const GET_AGENTS_LIST_REPORT = () => {
  return _Fetch("GET", "admin_panel/get-agent-refer-report-daywise", {}, {});
};

export const GET_AGENTS_LIST_AGENT_WISE = (BODY) => {
  return _Fetch(
    "POST",
    "admin_panel/get-agent-refer-report-agentwise-for-specific-date",
    BODY,
    {}
  );
};

export const GET_AGENTS_LIST_AGENT_WISE_WITHOUT_DATE = () => {
  return _Fetch(
    "GET",
    "admin_panel/get-registered-service-provider-agent-conversion-report",
    {},
    {}
  );
};

export const GET_AGENT_TOTEL_REGISTRATIONS = (BODY) => {
  return _Fetch(
    "POST",
    "admin_panel/get-all-registered-service-provider-details",
    BODY,
    {}
  );
};

export const GET_AGENT_TOTEL_REGISTRATIONS_WHEN_DATE_NOT_AVALAIBLE = (BODY) => {
  return _Fetch(
    "POST",
    "admin_panel/get-agent-registration-data-by-mobile-no",
    BODY,
    {}
  );
};

export const GET_AGENT_CONVERSIONS_ENTRIES = () => {
  //agent conversion report api without date
  return _Fetch(
    "GET",
    "admin_panel/get-registered-service-provider-agent-conversion-report",
    {},
    {}
  );
};

export const GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER = (BODY) => {
  return _Fetch(
    "POST",
    "admin_panel/get-agent-conversion-data-by-mobile-no",
    BODY,
    {}
  );
};

// get-agent-conversion-data-by-mobile-no

export const GET_AGENT_CONVERSIONS_ENTRIES_MOBILE_NUMBER_WITH_DATE = (BODY) => {
  return _Fetch(
    "POST",
    "admin_panel/get-agent-conversion-details-by-date-and-agent-number",
    BODY,
    {}
  );
};

export const GET_SERVICE_PROVIDER_CLICKS_DATA = () => {
  return _Fetch(
    "GET",
    "admin_panel/get-customer-clicks-report-daywise",
    {},
    {}
  );
};

export const GET_CUSTOMER_CLICKS_IN_SERVICEPROVIDERCLICK_SECTION = (body) => {
  return _Fetch(
    "POST",
    "admin_panel/get-customer-clicks-report-by-day",
    body,
    {}
  );
};

export const GET_FREEONBOARDING_HOURLY_REPORTS = () => {
  return _Fetch("get", "admin_panel/get-hourly-report", {}, {});
};

export const GET_AGENT_PANEL_DETAILS = () => {
  return _Fetch(
    "GET",
    "customer/service_provider/agent_panel/get-agent-info",
    {},
    {}
  );
};

export const ADD_NEW_PROVIDER = (body) => {
  return fetchService(
    "POST",
    "customer/service_provider/agent_panel/add-lead",
    body,
    {}
  );
};

export const SERVICES_TYPE_LIST_SERVICE_PROVIDER = () => {
  return _Fetch(
    "GET",
    "customer/service_provider/registration/get_service_type_api",
    {},
    {}
  );
};

export const SHARE_LOCATION_OF_PROVIDER = (body) => {
  console.log(body);
  return _Fetch(
    "POST",
    "customer/service_provider/agent_panel/service-provider/save-lat-long",
    body,
    {}
  );
};

export const GET_KEYWORDS_BY_SERVICE_TYPE = (body) => {
  return _Fetch(
    "POST",
    "customer/service_provider/agent_panel/get-synonyms-for-registration",
    body,
    {}
  );
};

export const SERVICES_TYPE_GET_MAP_DATA = () => {
  return _Fetch("GET", "admin_panel/get-service-provider-map-data", {}, {});
};

export const REGISTER_FREE_ONBOARDING_SERVICE_PROVIDER = (BODY) => {
  return fetchService(
    "POST",
    "customer/service_provider/agent_panel/service-provider-free-onboarding-registration",
    BODY,
    {
      "Content-Type": "multipart/form-data",
    }
  );
};

export const GET_CAMPAGIAN_DROPDOWN_VALUES = (BODY) => {
  return fetchService(
    "GET",
    "admin_panel/get-whatsapp-campaign-list",
    BODY,
    {}
  );
};
export const GET_CAMPAIGN_DATA = (BODY) => {
  return fetchService(
    "POST",
    "admin_panel/get-whatsapp-campaign-tracking-info-datewise",
    BODY,
    {}
  );
};
export const GET_BLOGS = () => {
  return fetchService("GET", "blog/get-all-blogs", {}, {});
};

export const CREATE_BLOG = (BODY) => {
  return fetchService("POST", "blog/create-blog",BODY, {});
};

export const DELETE_BLOG = (id) => {
  return fetchService("DELETE", `blog/delete-blog-by-id/${id}`,{}, {});
};

export const UPDATE_BLOG = (id,BODY) => {
  return fetchService("PUT", `blog/update-blog/${id}`,BODY, {});
};


export const INSTALLATION_REPORTS = (BODY) => {
  return fetchService("POST", `admin_panel/Person-onboarding-report`,BODY, {});
};

export const ADD_VIDEO_IN_ADMIN_PANEL = (BODY) => {
  return fetchService("POST", `admin_panel/add-video-in-customer-page`,BODY, {});
};


export const GET_ALL_VIDEOS = () => {
  return fetchService("GET", `admin_panel/get-all-video-in-customer-section`,{}, {});
};


export const UPDATE_VIDEO = (body) => {
  console.log(body,"UPDATE_VIDEO")
  return fetchService("POST", `admin_panel/add-video-in-customer-page`,body, {});
};

export const DELETE_VIDEO = (body) => {
  return fetchService("POST", `admin_panel/delete-video-customer-section`,body, {});
};
export const INSTALLATION_REPORTS_BY_USER = (body) => {
  return fetchService("POST", `admin_panel/Person-onboarding-report-for-given-date`,body, {});
};

export const CHANGE_SERVICE_PROVIDER_NUMBER = (body) => {
  return fetchService("POST", `admin_panel/update-service-provider-mobile-number`,body, {});
};








