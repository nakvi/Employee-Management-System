import { APIClient } from "../../../helpers/api_helper";
import { POST_LOGIN } from "../../../helpers/url_helper";
import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from "./reducer";

const api = new APIClient();

export const loginUser = (user, history) => async (dispatch) => {
  try {
    // Dummy login check
    const { email, password } = user;
    if (email === "admin@themesbrand.com" && password === "123456") {
      const dummyResponse = {
        status: "success",
        data: {
          uid: "1",
          email: "admin@themesbrand.com",
          name: "Admin User",
          token: "static_dummy_token",
        },
      };
      sessionStorage.setItem("authUser", JSON.stringify(dummyResponse));
      dispatch(loginSuccess(dummyResponse.data));
      history("/dashboard");
    } else {
      dispatch(apiError("Invalid credentials"));
    }

    // Real API call (commented out for now)
    /*
    const response = await api.create(POST_LOGIN, {
      email: user.email,
      password: user.password,
    });

    if (response && response.status === "success") {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response.data));
      history("/dashboard");
    } else {
      dispatch(apiError(response.message || "Login failed"));
    }
    */
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    const response = await api.create(POST_SOCIAL_LOGIN, { type });
    if (response && response.status === "success") {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response.data));
      history("/dashboard");
    } else {
      dispatch(apiError(response.message || "Social login failed"));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => (dispatch) => {
  dispatch(reset_login_flag());
};