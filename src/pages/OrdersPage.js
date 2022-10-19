import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import {
  faCheckCircle,
  faHourglass,
  faTimesCircle,
  faTruckMoving,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate, sumCartItems } from 'shared/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UnauthorizedPage from './UnauthorizedPage';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants';
import Paginator from 'components/Paginator';
import PaginatedRows from 'components/PaginatedRows';

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [update, setUpdate] = useState(0);
  const { user } = useContext(UserContext);
  const setStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return faHourglass;
      case 'cancelled':
        return faTimesCircle;
      case 'shipping':
        return faTruckMoving;
      case 'completed':
        return faCheckCircle;
      default:
        return faHourglass;
    }
  };
  const setStatusTextColor = (status) => {
    switch (status) {
      case 'processing':
        return 'text-warning';
      case 'cancelled':
        return 'text-danger';
      case 'shipping':
        return 'text-info';
      case 'completed':
        return 'text-success';
      default:
        return 'text-dark';
    }
  };

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

  useEffect(() => {
    if (user._id) {
      fetch(`${config.API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user, update]);

  const orderRows = React.useMemo(() => {
    return orders
      ? orders.reverse().map((order, index) => {
          return (
            <tr key={order._id}>
              <th scope="row">{orders.length - index}</th>
              <td>
                <Link to={`/orders/${order._id}`}>
                  <small>
                    {formatDate(new Date(order.datePurchased), 'LLL dd, yyyy')}
                  </small>
                </Link>
              </td>
              <td className="d-none d-md-table-cell">
                <Link to={`/users/${order.userId?._id}`}>
                  <small>
                    {order.userId?.lastName}, {order.userId?.firstName}
                  </small>
                </Link>
              </td>
              <td className="d-none d-md-table-cell">
                <Link to={`/orders/${order._id}`}>{order.products.length}</Link>
              </td>
              <td>
                <small>{sumCartItems(order.products).toFixed(2)}</small>
              </td>
              <td className="d-none d-md-table-cell">
                <InputGroup className="mb-2 rounded-0">
                  <InputGroup.Prepend className="rounded-0 d-none d-md-inline-block ">
                    <InputGroup.Text className="bg-transparent border-0">
                      <FontAwesomeIcon
                        icon={setStatusIcon(order.status)}
                        className={setStatusTextColor(order.status)}
                      />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
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
                </InputGroup>
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
      : [];
  }, [orders]);

  const handleTablePageChange = (newPage) => {
    setCurrentTablePage(newPage);
  };
  const rowsPerPage = 10;

  return user._id ? (
    !user.isAdmin ? (
      <UnauthorizedPage />
    ) : (
      <>
        <Helmet>
          <title>{constants.messages.ORDERS} - Chellow</title>
        </Helmet>
        <Container fluid className="bg-light  py-4 bg-light page-section">
          <Row>
            <Col className="py-2 py-md-4" md="6">
              <h2 className="text-dark">{constants.messages.ORDERS}</h2>
            </Col>
          </Row>
          {orders ? (
            <>
              <Table striped bordered hover className="bg-white" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{constants.messages.DATE_PURCHASED}</th>
                    <th className="d-none d-md-table-cell">
                      {constants.messages.CUSTOMER}
                    </th>
                    <th className="d-none d-md-table-cell">
                      {constants.messages.ITEMS}
                    </th>
                    <th>{constants.messages.TOTAL}</th>
                    <th className="d-none d-md-table-cell">
                      {constants.messages.STATUS}
                    </th>
                    <th>{constants.messages.ACTIONS}</th>
                  </tr>
                </thead>
                <tbody>
                  <PaginatedRows
                    perPage={rowsPerPage}
                    activePage={currentTablePage}
                  >
                    {orderRows}
                  </PaginatedRows>
                </tbody>
              </Table>
              <Paginator
                activePage={currentTablePage}
                perPage={rowsPerPage}
                data={orders}
                onPageChangeCallback={handleTablePageChange}
              />
            </>
          ) : (
            <InlineLoadingWidget />
          )}
        </Container>
      </>
    )
  ) : (
    <UnauthorizedPage />
  );
}
