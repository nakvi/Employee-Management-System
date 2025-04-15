import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';

//import images
import PreviewCardHeader from "../../Components/Common/PreviewCardHeader";

const Settings = () => {
    document.title = "Profile Settings | EMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                    <Col lg={12}>
              <Card>
                <PreviewCardHeader title="Change Password" />
                <CardBody className="card-body">
                  <div className="live-preview">
                    <Row className="gy-4">
                      <Col xxl={2} md={4}>
                        <div>
                          <Label htmlFor="currentPasswordInput" className="form-label">
                            Current Password*
                          </Label>
                          <Input
                            type="password"
                            className="form-control-sm"
                            id="currentPasswordInput"
                            placeholder="Current Password"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={4}>
                        <div>
                          <Label htmlFor="newPasswordInput" className="form-label">
                          New Password*
                          </Label>
                          <Input
                            type="password"
                            className="form-control-sm"
                            id="newPasswordInput"
                            placeholder="New Password"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={4}>
                        <div>
                          <Label
                            htmlFor="confirmPasswordInput"
                            className="form-label"
                          >
                            Confirm Password*
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="confirmPasswordInput"
                            placeholder="Confirm Password"
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Settings;