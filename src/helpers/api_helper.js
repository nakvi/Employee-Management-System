// api_helper.js
import axios from "axios";
import config from "../config";

axios.defaults.baseURL = config.api.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

const token = JSON.parse(sessionStorage.getItem("authUser"))?.token;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axios.interceptors.response.use(
  (response) => response.data || response,
  (error) => {
    let message;
    const status = error.response?.status;
    switch (status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! The data you are looking for could not be found";
        break;
      default:
        message = error.response?.data?.message || error.message || "Unknown error";
    }
    return Promise.reject(message);
  }
);

const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

class APIClient {
  get = (url, params) => {
    if (params) {
      const queryString = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
      return axios.get(`${url}?${queryString}`, params);
    }
    return axios.get(url);
  };

  create = (url, data) => {
    return axios.post(url, data);
  };

  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

export const fetchUserLocations = async (userLogin) => {
  const appName = "ems";
  try {
    const response = await axios.get(
      `https://192.168.1.47:8001/ems/getddlLocation/`,
      {
        params: {
          p_userlogin: userLogin,
          p_appname: appName,
        },
      }
    );

    console.log("fetchUserLocations response:", response);
    const locations = Array.isArray(response) ? response : response.data || [];
    
    return locations.map((item) => ({
      id: item.VID,
      name: item.VName,
    }));
  } catch (error) {
    console.error("Error in fetchUserLocations:", error);
    return [];
  }
};

export { APIClient, setAuthorization, getLoggedinUser };