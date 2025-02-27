import axios from "axios";
import { API_BASE_URL } from "../constant/path";
import store from "../redux/store";
import { setUserAuthStates } from "../redux/slices/userAuthSlice";

// ✅ Axios Client Configuration
// console.log("Initializing Axios Client...");
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // "Content-Type": "application/json",
  },
});

// console.log("Axios Client Initialized:", axiosClient);

// ✅ Request Interceptor - Add Token to Headers
axiosClient.interceptors.request.use(
  async (config) => {
    // console.log("Request Interceptor Triggered...");
    const token = store.getState().userAuth.jwt;
    // console.log("Current JWT Token:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      // console.log("Authorization Header Set:", config.headers["Authorization"]);
    }

    // console.log("Final Request Config:", config);
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - Handle Expired Token
axiosClient.interceptors.response.use(
  (response) => {
    // console.log("Response Received:", response);
    return response;
  },
  async (error) => {
    // console.error("Response Interceptor Error:", error);
    const originalRequest = error.config;
    // console.log("Original Request:", originalRequest);

    if (
      error.response?.status === 401 ||
      error.response?.data?.message === "Token has expired"
    ) {
      console.warn("Token Expired. Attempting to Refresh...");
      const refreshToken = store.getState().userAuth.refreshToken;
      // console.log("Current Refresh Token:", refreshToken);

      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;
        // console.log("Retrying Original Request with New Token...");

        try {
          // Call Refresh Token API
          // console.log("Calling Refresh Token API...");
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          // console.log("Refresh Token API Response:", res.data);

          if (res.data?.jwt) {
            // console.log("New JWT Token Received:", res.data.jwt);

            // ✅ Update Redux Store with New JWT
            store.dispatch(
              setUserAuthStates({ key: "jwt", value: res.data.jwt })
            );
            // console.log("Redux Store Updated with New JWT.");

            // ✅ Update Token in Headers
            axiosClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.jwt}`;
            originalRequest.headers["Authorization"] = `Bearer ${res.data.jwt}`;
            // console.log("Authorization Header Updated.");

            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("Refresh Token Failed. Logging Out User...");

          // ❌ Logout User if Refresh Token Fails
          store.dispatch(setUserAuthStates({ key: "jwt", value: null }));
          store.dispatch(setUserAuthStates({ key: "login", value: false }));
          console.log("User Logged Out.");

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// ✅ General Fetch Function with Debugging Logs
const _Fetch = async (method, path, body = {}, headers = {}) => {
  console.log(`_Fetch Called -> Method: ${method}, Path: ${path}, Body:`, body);
  console.log("Current Headers:", headers);

  try {
    // console.log("Sending Request to API...");
    const response = await axiosClient({
      method,
      url: path,
      data: method !== "GET" ? body : undefined,
      params: method === "GET" ? body : undefined,
      headers: { ...axiosClient.defaults.headers.common, ...headers },
      redirect: "follow",
    });

    console.log("API Response Received:", response.data);

    if (response.data.status_code === 200) {
      console.log("API Call Successful:", response.data);
      return response.data;
    } else {
      // console.warn("API Call Failed:", response.data.message);
      throw new Error(response.data.message || "Something went wrong!");
    }
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export default _Fetch;

// import { API_BASE_URL } from "../constant/path";
// import store from "../redux/store";
// import { setUserAuthStates } from "../redux/slices/userAuthSlice";
// import axios from "axios";

// // Axios axiosClient configure
// const axiosClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptors
// axiosClient.interceptors.request.use(
//   async (config) => {
//     const token = store.getState().userAuth.jwt;
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptors
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status == 401 ||
//       error.response?.status == 400 ||
//       (error.response?.data?.message === "Token has expired" &&
//         !originalRequest._retry)
//     ) {
//       originalRequest._retry = true;

//       const refreshToken = store.getState().userAuth.refreshToken;

//       if (refreshToken) {
//         try {
//           const res = await axios.post(
//             "https://www.tatd.in/app-api/driver/login/refresh_token.php",
//             { refresh_token: refreshToken }
//           );

//           if (res.data?.jwt) {
//             store.dispatch(
//               setUserAuthStates({
//                 key: "jwt",
//                 value: res.data.jwt,
//               })
//             );

//             // add new jwt in header
//             axiosClient.defaults.headers.common[
//               "Authorization"
//             ] = `Bearer ${res.data.jwt}`;
//             originalRequest.headers["Authorization"] = `Bearer ${res.data.jwt}`;
//             return axiosClient(originalRequest);
//           } else {
//             store.dispatch(
//               setUserAuthStates({
//                 key: "jwt",
//                 value: null,
//               })
//             );
//             store.dispatch(
//               setUserAuthStates({
//                 key: "login",
//                 value: false,
//               })
//             );
//           }
//         } catch (refreshError) {
//           store.dispatch(
//             setUserAuthStates({
//               key: "jwt",
//               value: null,
//             })
//           );
//           store.dispatch(
//             setUserAuthStates({
//               key: "login",
//               value: false,
//             })
//           );

//           return Promise.reject(refreshError);
//         }
//       } else {
//         store.dispatch(
//           setUserAuthStates({
//             key: "jwt",
//             value: null,
//           })
//         );
//         store.dispatch(
//           setUserAuthStates({
//             key: "login",
//             value: false,
//           })
//         );
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// const _Fetch = (method, path, body, headers = {}) => {
//   return new Promise((resolve, reject) => {
//     // Merge headers: If headers are passed, merge with default headers
//     const finalHeaders = {
//       ...axiosClient.defaults.headers.common,
//       ...headers, // Custom headers override default headers if any conflict
//     };

//     axiosClient({
//       method,
//       url: path,
//       data: method !== "GET" ? body : undefined,
//       params: method === "GET" ? body : undefined,
//       headers: finalHeaders, // Pass merged headers
//     })
//       .then((response) => {
//         // console.log(`Response data: ${path}`, response.data);
//         if (response.data.status_code == 200) {
//           resolve(response.data);
//         } else {
//           reject(response.data.message);
//         }
//       })
//       .catch((err) => {
//         console.log(`Request error: ${path}`, err);
//         reject(err.response ? err.response.data : err.message);
//       });
//   });
// };

// export default _Fetch;
