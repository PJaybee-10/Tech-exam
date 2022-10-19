import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Container, Row, Form } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import { formatDate, sumCartItems } from 'shared/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants/index';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import UnauthorizedPage from './UnauthorizedPage';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [update, setUpdate] = useState({});
  const { user } = useContext(UserContext);
  const history = useHistory();
  const [order, setOrder] = useState({
    _id: null,
  });

  useEffect(() => {
    if (user._id) {
      fetch(`${config.API_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data._id) {
            setOrder(data);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Order Unavailable',
              text: data.message,
            });
            history.push(user.isAdmin ? '/orders' : '/my-orders');
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, update]);

  const handleStatusChange = (orderId, status) => {
    fetch(`${config.API_URL}/orders/setStatus/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.message) {
          Swal.fire({
            // title: "Success",
            text: data.message,
            icon: 'success',
            toast: true,
            timer: 1500,
            position: 'top-end',
          });
        }
        setUpdate({});
      })
      .catch((e) => {
        Swal.fire({
          // title: "Success",
          text: `Failed to update order ${orderId}`,
          icon: 'error',
          toast: true,
          timer: 1500,
          position: 'top-end',
        });
      });
  };

  return (
    <>
      <Helmet>
        <title>{constants.messages.ORDER_DETAILS} - Chellow</title>
      </Helmet>
      {user._id ? (
        <Container fluid>
          {order._id ? (
            <>
              <Row className="bg-light pt-5 pb-4">
                <Col xs="12" md="4" className="text-dark">
                  <h4 className="mt-2 mb-3 text-black">
                    {constants.messages.STATUS}:&nbsp;
                    {user.isAdmin ? (
                      <Form.Control
                        as="select"
                        size="sm"
                        className="rounded-0"
                        onChange={(e) => {
                          e.preventDefault();
                          handleStatusChange(order._id, e.target.value);
                        }}
                        value={order.status}
                      >
                        <option value="processing">
                          {constants.messages.PROCESSING}
                        </option>
                        <option value="shipping">
                          {constants.messages.SHIPPING}
                        </option>
                        <option value="completed">
                          {constants.messages.COMPLETED}
                        </option>
                        <option value="cancelled">
                          {constants.messages.CANCELLED}
                        </option>
                      </Form.Control>
                    ) : (
                      <span
                        className={`${
                          order.status === 'cancelled'
                            ? 'text-danger'
                            : 'text-success'
                        } text-capitalize`}
                      >
                        {order.status}
                      </span>
                    )}
                  </h4>
                  {order && (
                    <>
                      <p>
                        <b>{constants.messages.ORDER_ID}: </b>&nbsp;
                        {order._id}
                      </p>
                      <p>
                        <b>{constants.messages.DATE_PURCHASED}: </b>
                        {formatDate(
                          new Date(order.datePurchased),
                          'LLL dd, yyyy, hh:mm a'
                        )}
                      </p>
                      <p>
                        <b>{constants.messages.ORDER_TOTAL}: </b>
                        &#8369;{order.totalAmount.toFixed(2)}
                      </p>
                    </>
                  )}
                  <hr />
                  <div className="my-4">
                    <h5 className="mb-3 text-black">Customer Details</h5>
                    <p>
                      <b>{constants.messages.NAME}: </b>
                      {order.userId.firstName} {order.userId.lastName}
                    </p>
                    <p>
                      <b>{constants.messages.EMAIL}: </b>
                      <a
                        href={`mailto:${order.userId.email}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {order.userId.email}
                      </a>
                    </p>

                    <p>
                      <b>{constants.messages.MOBILENO}: </b>
                      {order.userId.mobileNo}
                    </p>
                  </div>
                </Col>

                <Col xs="12" md="8" className="bg-white">
                  {order.products.map((item) => (
                    <div key={item._id}>
                      <Card className="my-3 rounded-0">
                        <Row>
                          <Col xs="4" sm="3">
                            <img
                              src={
                                item.image
                                  ? item.image
                                  : `https://via.placeholder.com/200x200.png?text=${item.name}`
                              }
                              alt={item.name}
                              className="product-img-sm img-fluid "
                            />
                          </Col>
                          <Col xs="8" sm="9">
                            <div className="card-body">
                              <h5 className="card-title">
                                &#8369;{(item.price * item.quantity).toFixed(2)}
                              </h5>
                              <p className="card-text text-muted">
                                {item.quantity} x {item.name}{' '}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  ))}
                </Col>
                <Col xs="12" md={{ span: 8, offset: 4 }} className="bg-white">
                  <h3 className="mt-3 text-right ">
                    {' '}
                    {constants.messages.TOTAL}: &#8369;
                    <span className="text-danger font-weight-bold">
                      {order.products
                        ? sumCartItems(order.products).toFixed(2)
                        : '0.00'}{' '}
                    </span>
                  </h3>
                </Col>

                <Col
                  xs="12"
                  md={{ span: 8, offset: 4 }}
                  className="py-5 bg-white"
                >
                  <Link
                    className="btn rounded-0 btn-dark btn-block "
                    to={user.isAdmin ? '/orders' : '/my-orders'}
                  >
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} /> &nbsp;{' '}
                    {constants.messages.RETURN_TO_ORDERS}
                  </Link>
                </Col>
              </Row>
            </>
          ) : (
            <Row className="py-5">
              <Col className="py-5">
                <InlineLoadingWidget />
              </Col>
            </Row>
          )}
        </Container>
      ) : (
        <UnauthorizedPage
          title={constants.messages.CUSTOMERS_ONLY}
          actionButtonLink="/login"
          callToAction=" "
        />
      )}
    </>
  );
}
