import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import constants from '../constants';

export default function FeatureContents({
  title,
  message,
  callToAction,
  actionButtonLink,
  mascotImage,
}) {
  return (
    <Row>
      <Col
        xs={{ span: 9, order: 0 }}
        sm={{ span: 12, order: 0 }}
        className="d-flex align-items-center"
      >
        <h2 className="">{title}</h2>
      </Col>
      <Col
        xs={{ span: 12, order: 2 }}
        sm={{ span: 9, order: 1 }}
        className="pt-4"
      >
        <p>{message}</p>
        <p>
          <b>{callToAction} </b>
        </p>
        <Link to={actionButtonLink} className="btn btn-warning  rounded-0 mb-4">
          {constants.messages.LETS_GO}
        </Link>
      </Col>
      <Col
        xs={{ span: 3, order: 1 }}
        sm={{ span: 3, order: 2 }}
        className=" text-center "
      >
        <img alt="" src={mascotImage} className="img-fluid" />
      </Col>
    </Row>
  );
}
