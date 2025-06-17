import React from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";

const data = [
  {
    title: "Previous",
    dateRange: "01 Apr-30 Jun",
    sale: "GBP 5,251,746",
    purchase: "GBP 4,750,759",
    gp: "GBP 446,983",
    expense: "GBP 235,149",
    np: "GBP 211,834",
    rightbgColor: "bg-gradient bg-info",
    leftbgColor: "bg-info",
  },
  {
    title: "Month",
    dateRange: "01 Jun-30 Jun",
    sale: "GBP 711,877",
    purchase: "GBP 634,454",
    gp: "GBP 71,356",
    expense: "GBP 4,056",
    np: "GBP 67,300",
    // bgColor: "bg-success",
    rightbgColor: "bg-gradient bg-success",
    leftbgColor: "bg-success",
  },
  {
    title: "Today",
    dateRange: "",
    sale: "0",
    purchase: "0",
    gp: "0",
    expense: "0",
    np: "0",
    // bgColor: "bg-warning",
    rightbgColor: " bg-gradient bg-warning",
    leftbgColor: "bg-warning",
  },
];

const TileBoxs = () => {
  return (
    <Row className="border-box">
      {data.map((item, index) => (
        <Col xxl={2} md={2} lg={4} key={index} className="mb-3">
          <Card >
            <Row>
              {/* Left Side: Title + Date */}
              <Col
                md="4"
                className={`p-2  ${item.leftbgColor} text-white`}
              >
                <div className="h-100 d-flex flex-column justify-content-center">
                  <h5 className="mb-1 text-white">{item.title}</h5>
                  {item.dateRange && <small>{item.dateRange}</small>}
                </div>
              </Col>

              {/* Right Side: Financial Info */}
              <Col
                md="8"
                className={`p-2 ${item.rightbgColor} text-white`}
              >
                <div className="d-flex justify-content-between">
                  <span>SALE</span>
                  <strong>{item.sale}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>PURCHASE</span>
                  <strong>{item.purchase}</strong>
                </div>
                <hr className="bg-white my-2" />
                <div className="d-flex justify-content-between mt-2">
                  <span>GP</span>
                  <strong>{item.gp}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>EXPENSE</span>
                  <strong>{item.expense}</strong>
                </div>
                <hr className="bg-white my-2" />
                <div className="d-flex justify-content-between">
                  <span>NP</span>
                  <strong>{item.np}</strong>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TileBoxs;
