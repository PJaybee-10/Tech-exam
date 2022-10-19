import React from 'react';
import { Col, Row } from 'react-bootstrap';

export default function FeaturePage({ children }) {
  return (
    <section className="container-fluid bg-dark feature-page py-5 ">
      <Row className="mt-0 my-md-3 px-3">
        <Col
          xs="12"
          md={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
          className="bg-light p-4"
        >
          {children}
        </Col>
      </Row>{' '}
    </section>
  );
}
