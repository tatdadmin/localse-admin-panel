// import axios from "axios";
import _Fetch from "./Service";

export const ADMIN_LOGIN = (body) => {
  console.log("ADMIN_LOGIN Called with Credentials:", body);
  return _Fetch("POST", "admin_panel/login", body, {});
};

export const ADD_NOTIFICATION = (body) => {
  console.log("ADD_NOTIFICATION Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/create-notification", body, {});
};

export const ADD_NOTICE = (body) => {
  console.log("ADD_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("POST", "admin_panel/create-notice", body, {});
};

export const GET_ALL_NOTICE = (body) => {
  console.log("GET_ALL_NOTICE Called with BODY:", body);
  // return false;
  return _Fetch("GET", "admin_panel/get-notice", body, {});
};

export const DELETE_NOTICE = (body) => {
  console.log("GET_ALL_NOTICE Called with BODY:", body);
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
