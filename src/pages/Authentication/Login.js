import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser, resetLoginFlag } from "../../slices/auth/login/thunk";
import logoLight from "../../assets/images/zeta-logosvg.svg";
import { createSelector } from "reselect";
import { fetchUserLocations } from "../../helpers/api_helper";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectLoginData = createSelector(
    (state) => state.Login,
    (login) => ({
      user: login.user,
      error: login.error,
      loading: login.loading,
      errorMsg: login.errorMsg,
    })
  );

  const { error, loading, errorMsg } = useSelector(selectLoginData);
  const [passwordShow, setPasswordShow] = useState(false);
  // const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [userLocations, setUserLocations] = useState([]);
  const [locationError, setLocationError] = useState(null);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      userLogin: "",
      password: "",
      LocationId: "",
    },
    validationSchema: Yup.object({
      userLogin: Yup.string().required("Please enter your login"),
      password: Yup.string().required("Please enter your password"),
      LocationId: Yup.string().required("Please select a location"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, navigate)); // Pass navigate instead of history
    },
  });

  const handleUserLoginBlur = async () => {
    const input = validation.values.userLogin?.trim();

    if (!input) {
      setUserLocations([]);
      // setShowLocationDropdown(false);
      setLocationError(null);
      return;
    }

    try {
      setLocationError(null);
      const locations = await fetchUserLocations(input);
      console.log("Fetched locations:", locations); // Debug log
      setUserLocations(locations);
      // setShowLocationDropdown(locations.length > 0);

      if (locations.length > 0) {
        validation.setFieldValue("LocationId", locations[0].id);
      } else {
        setLocationError("No locations found for this user.");
      }
    } catch (error) {
      console.error("Error fetching user locations:", error);
      setUserLocations([]);
      // setShowLocationDropdown(false);
      setLocationError("Failed to fetch locations. Please try again.");
    }
  };

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  document.title = "Login | EMS";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="80" />
                  </Link>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome Back!</h5>
                      <p className="text-muted">Sign in to continue to EMS.</p>
                    </div>
                    {error && <Alert color="danger">{error}</Alert>}
                    {locationError && <Alert color="warning">{locationError}</Alert>}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="userLogin" className="form-label">User Login</Label>
                          <Input
                            name="userLogin"
                            className="form-control"
                            placeholder="Enter Email, Username or ID"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={(e) => {
                              validation.handleBlur(e);
                              handleUserLoginBlur();
                            }}
                            value={validation.values.userLogin}
                            invalid={validation.touched.userLogin && validation.errors.userLogin}
                          />
                          {validation.touched.userLogin && validation.errors.userLogin && (
                            <FormFeedback>{validation.errors.userLogin}</FormFeedback>
                          )}
                        </div>

                        <div className="mb-3">
                          <Label className="form-label" htmlFor="password-input">
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={validation.touched.password && validation.errors.password}
                            />
                            {validation.touched.password && validation.errors.password && (
                              <FormFeedback>{validation.errors.password}</FormFeedback>
                            )}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        {/* {showLocationDropdown && userLocations.length > 0 && ( */}
                          <div className="mb-3">
                            <Label htmlFor="LocationId" className="form-label">Location</Label>
                            <Input
                              type="select"
                              name="LocationId"
                              id="LocationId"
                              className="form-select"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.LocationId}
                              invalid={validation.touched.LocationId && validation.errors.LocationId}
                            >
                              <option value="">Select a location</option>
                              {userLocations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                  {loc.name}
                                </option>
                              ))}
                            </Input>
                            {validation.touched.LocationId && validation.errors.LocationId && (
                              <FormFeedback>{validation.errors.LocationId}</FormFeedback>
                            )}
                          </div>
                        {/* )} */}

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={loading}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {loading && <Spinner size="sm" className="me-2" />}
                            Sign In
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Login;