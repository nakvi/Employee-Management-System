import { APIClient } from "../../../helpers/api_helper";
import { POST_LOGIN } from "../../../helpers/url_helper";
import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from "./reducer";

const api = new APIClient();

export const loginUser = (user, history) => async (dispatch) => {
  try {
    const { userLogin, password, LocationId } = user;

    // Call the login API with query parameters
    const response = await api.get(POST_LOGIN, {
      p_userlogin: userLogin,
      p_appname: "ems",
      p_userpswd: password,
      p_locationid: LocationId,
      p_logintype: "1",
    });

    // Log response for debugging
    console.log("Login API response:", response);

    // Check if response is an array and has at least one item with no error
    if (Array.isArray(response) && response.length > 0 && response[0].ErrorMessage === "") {
      const userData = response[0]; // Take the first user object

      // Store the entire userData object in sessionStorage
      const authResponse = { data: userData };
      sessionStorage.setItem("authUser", JSON.stringify(authResponse));

      // Dispatch only the necessary fields to Redux
      const reduxUserData = {
        uid: userData.UserID,
        userLogin: userData.Userlogin,
        name: userData.Userfullname,
        Location: userData.LocationName,
        LocationCode: userData.LocationCode,
        Software_Start_Date: userData.StartDate,
        Software_End_Date: userData.EndDate,
        token: userData.EMStoken || "no-token-provided",
        isAdmin: userData.IsAdmin,
        ServerTime: userData.ServerTime,
      };

      dispatch(loginSuccess(reduxUserData));
      history("/dashboard");
    } else {
      const errorMessage = response[0]?.ErrorMessage || "Login failed: Invalid response format";
      dispatch(apiError(errorMessage));
    }
  } catch (error) {
    console.error("Login error:", error);
    dispatch(apiError(error || "An error occurred during login"));
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

export const resetLoginFlag = () => (dispatch) => {
  dispatch(reset_login_flag());
};