import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { formatDate, sumCartItems } from 'shared/utils';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import { Link } from 'react-router-dom';
import UnauthorizedPage from './UnauthorizedPage';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants';

export default function MyOrdersPage() {
  const [orderRows, setOrderRows] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user._id) {
      fetch(`${config.API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrderRows(
            data.reverse().map((order, index) => {
              return (
                <tr key={order._id}>
                  <th scope="row">{data.length - index}</th>
                  <td>
                    <Link to={`/my-orders/${order._id}`}>
                      {formatDate(
                        new Date(order.datePurchased),
                        'LLL dd, yyyy'
                      )}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/my-orders/${order._id}`}>
                      {order.products.length}
                    </Link>
                  </td>
                  <td>{sumCartItems(order.products).toFixed(2)}</td>
                  <td>
                    <span className="text-capitalize">
                      <Link to={`/my-orders/${order._id}`}>{order.status}</Link>
                    </span>
                  </td>
                  <td>
                    <Link
                      className="btn btn-sm btn-warning rounded-0"
                      to={`/orders/${order._id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })
          );
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user]);

  return user._id ? (
    user.isAdmin ? (
      <UnauthorizedPage
        title={constants.messages.CUSTOMERS_ONLY}
        message={constants.messages.ADMIN_ACCOUNTS_CANNOT_ACCESS_ORDERS}
      />
    ) : (
      <>
        <Helmet>
          <title>{constants.messages.MY_ORDERS} - Chellow</title>
        </Helmet>
        <Container fluid className="bg-light  py-4 bg-light page-section">
          <Row>
            <Col className="py-2 py-md-4" md="6">
              <h2 className="text-dark">{constants.messages.MY_ORDERS}</h2>
            </Col>
          </Row>
          {orderRows ? (
            <Table striped bordered hover className="bg-white" responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{constants.messages.DATE_PURCHASED}</th>
                  <th>{constants.messages.ITEMS}</th>
                  <th>{constants.messages.TOTAL}</th>
                  <th>{constants.messages.STATUS}</th>
                  <th>{constants.messages.ACTIONS}</th>
                </tr>
              </thead>
              <tbody>{orderRows}</tbody>
            </Table>
          ) : (
            <InlineLoadingWidget />
          )}
        </Container>
      </>
    )
  ) : (
    <UnauthorizedPage
      title={constants.messages.CUSTOMERS_ONLY}
      message={constants.messages.LOGIN_FIRST}
    />
  );
}
