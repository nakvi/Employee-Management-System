import React from 'react';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import { Link } from 'react-router-dom';

import CountUp from "react-countup";

//Import Icons
import FeatherIcon from "feather-icons-react";

import { tileBoxs1 } from "../../common/data/index";

const TileBoxs = () => {
    return (
        <React.Fragment>
            <Row>
                {(tileBoxs1 || []).map((item, key) => (
                    <Col xl={3} md={6} key={key}>
                        <Card className={"card-animate " + item.bgColor}>
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <p className={"text-uppercase fw-medium mb-0 text-" + item.labelClass}>{item.label}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <h5 className={"fs-14 mb-0 text-" + item.percentageClass}>
                                            <i className={"fs-13 align-middle " + item.percentageIcon}></i> {item.percentage}
                                        </h5>
                                    </div>
                                </div>
                                <div className="d-flex align-items-end justify-content-between mt-4">
                                    <div>
                                        <h4 className={"fs-22 fw-semibold ff-secondary mb-4 " + item.counterClass}><span className="counter-value" data-target="559.25">
                                            <CountUp
                                                start={0}
                                                prefix={item.prefix}
                                                suffix={item.suffix}
                                                separator={item.separator}
                                                end={item.counter}
                                                decimals={item.decimals}
                                                duration={4}
                                            />
                                        </span></h4>
                                        {/* <Link to="#" className={"text-decoration-underline " + item.captionClass}>{item.caption}</Link> */}
                                    </div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span 
                                        className={"avatar-title rounded fs-3 bg-" + item.iconClass}
                                        >
                                            <i className={item.icon + " text-" + item.color}></i>
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>))}
            </Row>

        </React.Fragment>
    );
};

export default TileBoxs;