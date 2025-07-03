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
  const [userLogin, setUserLogin] = useState([]);

  const validation = useFormik({
    enableReinitialize: true,
    // initialValues: {
    //   email: "",
    //   password: "",
    // },
    initialValues: {
      email: userLogin.email || "admin@themesbrand.com" || '',
      password: userLogin.password || "123456" || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, navigate));
    },
  });

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
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email}
                            invalid={validation.touched.email && validation.errors.email}
                          />
                          {validation.touched.email && validation.errors.email && (
                            <FormFeedback>{validation.errors.email}</FormFeedback>
                          )}
                        </div>
                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
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
                        {/* <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label className="form-check-label" htmlFor="auth-remember-check">
                            Remember me
                          </Label>
                        </div> */}
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