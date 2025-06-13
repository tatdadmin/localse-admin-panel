import axios from "axios";
import { API_BASE_URL } from "../constant/path";
import store from "../redux/store";
import { setUserAuthStates } from "../redux/slices/userAuthSlice";

// 🔧 Axios instance setup
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Request Interceptor - Attach Bearer Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = store.getState().userAuth.jwt;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor - Handle Token Expiry
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = store.getState().userAuth.refreshToken;

    // If token expired and retry not attempted yet
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      error.response?.data?.message === "Token has expired"
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE_URL}auth/refresh`, {
          refresh_token: refreshToken,
        });

        if (res.data?.jwt) {
          // Save new token to Redux
          store.dispatch(setUserAuthStates({ key: "jwt", value: res.data.jwt }));
          axiosClient.defaults.headers.Authorization = `Bearer ${res.data.jwt}`;
          originalRequest.headers.Authorization = `Bearer ${res.data.jwt}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Force logout on refresh failure
        store.dispatch(setUserAuthStates({ key: "jwt", value: null }));
        store.dispatch(setUserAuthStates({ key: "login", value: false }));
        return Promise.reject(refreshError);
      }
    }

    // Logout on hard 403 or failed refresh
    if (error.response?.status === 403) {
      store.dispatch(setUserAuthStates({ key: "jwt", value: null }));
      store.dispatch(setUserAuthStates({ key: "login", value: false }));
    }

    return Promise.reject(error);
  }
);


const fetchService = async (method, path, body = {}, headers = {}) => {
    try {
      const isFormData = body instanceof FormData;
  
      const response = await axiosClient({
        method,
        url: path,
        data: method !== "GET" ? body : undefined,
        params: method === "GET" ? body : undefined,
        headers: {
          ...headers,
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
      });
  // console.log(response,"API")
      if (response?.status == 200 || response?.status == 201) {
        return response.data;
      } else {
        throw new Error(response.data?.message || "Request failed.");
      }
    } catch (error) {
      console.error(`[fetchService] Error at ${path}:`, error);
      throw error?.response?.data || error.message || "Unknown error";
    }
  };
  
  export default fetchService;