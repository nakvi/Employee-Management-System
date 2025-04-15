import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  Label,
} from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

const Company = () => {
  document.title = "Company | EMS";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <PreviewCardHeader title="Company" />

                <CardBody className="card-body">
                  <div className="live-preview">
                    <Row className="gy-4">
                      <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="codeInput" className="form-label">
                            Code
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="codeInput"
                            placeholder="Code"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="nameInput" className="form-label">
                            Company Name
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="nameInput"
                            placeholder="Company Name"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="nameUrduInput" className="form-label">
                            Company Name Urdu
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="nameUrduInput"
                            placeholder="Company Name Urdu"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label
                            htmlFor="sortOrderInput"
                            className="form-label"
                          >
                            Sort Order
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="sortOrderInput"
                            placeholder="Sort Order"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="addressInput" className="form-label">
                            Address-1
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="addressInput"
                            placeholder="Company Address"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="address2Input" className="form-label">
                            Address-2
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="address2Input"
                            placeholder="Company Address"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label
                            htmlFor="addressUrduInput"
                            className="form-label"
                          >
                            Address-Urdu-1
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="addressUrduInput"
                            placeholder="Company Address Urdu"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label
                            htmlFor="addressUrdu2Input"
                            className="form-label"
                          >
                            Address-Urdu-2
                          </Label>
                          <Input
                            type="text"
                            className="form-control-sm"
                            id="addressUrdu2Input"
                            placeholder="Company Address Urdu"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={3}>
                        <div>
                          <Label htmlFor="fileInput" className="form-label">
                            Logo
                          </Label>
                          <Input
                            type="file"
                            className="form-control-sm"
                            id="fileInput"
                          />
                        </div>
                      </Col>
                      <Col xxl={2} md={2} className="mt-4">
                        <div className="form-check form-switch mt-3 " dir="ltr">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizesm"
                            defaultChecked=""
                          />
                          <Label
                            className="form-check-label"
                            for="customSwitchsizesm"
                          >
                            IsActive
                          </Label>
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

export default Company;
