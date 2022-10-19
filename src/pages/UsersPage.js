import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UnauthorizedPage from './UnauthorizedPage';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants';
import PaginatedRows from 'components/PaginatedRows';
import Paginator from 'components/Paginator';

export default function UsersPage() {
  const [users, setUsers] = useState(null);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [update, setUpdate] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user._id) {
      fetch(`${config.API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((e) => {
          console.error(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, update]);

  const addAdmin = (user) => {
    fetch(`${config.API_URL}/users/addAdmin/${user._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        Swal.fire({
          text: data.message ? data.message : 'Success',
          icon: 'success',
          toast: true,
          timer: 1500,
          position: 'top-end',
        });
        setUpdate({});
      })
      .catch((e) => {
        console.error(e);
        Swal.fire({
          // title: "Success",
          text: `Failed to add Admin ${user.name}`,
          icon: 'error',
          toast: true,
          timer: 1500,
          position: 'top-end',
        });
      });
  };

  const removeAdmin = (user) => {
    fetch(`${config.API_URL}/users/removeAdmin/${user._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        Swal.fire({
          text: data.message ? data.message : 'Success',
          icon: 'success',
          toast: true,
          timer: 1500,
          position: 'top-end',
        });
        setUpdate({});
      })
      .catch((e) => {
        console.error(e);
        Swal.fire({
          // title: "Success",
          text: `Failed to remove Admin ${user.name}`,
          icon: 'error',
          toast: true,
          timer: 1500,
          position: 'top-end',
        });
      });
  };

  const rowsPerPage = 10;

  const userRows = React.useMemo(() => {
    return users
      ? users.reverse().map((user, index) => {
          return (
            <tr key={user._id}>
              <th scope="row">
                <small>{users.length - index}</small>
              </th>
              <td className="d-none d-md-table-cell">
                <Link to={`/users/${user._id}`}>
                  <small>{user.lastName}</small>
                </Link>
              </td>
              <td className="d-none d-md-table-cell">
                <Link to={`/users/${user._id}`}>
                  {' '}
                  <small>{user.firstName}</small>
                </Link>
              </td>
              <td>
                <Link to={`/users/${user._id}`}>
                  {' '}
                  <small>{user.email}</small>
                </Link>
              </td>
              <td className="d-none d-md-table-cell">
                <small>{user.mobileNo}</small>
              </td>
              <td className="d-none d-md-table-cell">
                <small className={user.isAdmin ? 'text-success' : 'text-dark'}>
                  {user.isAdmin ? 'Admin' : 'Customer'}
                </small>
              </td>
              <td className="text-nowrap">
                {user.isAdmin ? (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="px-1 rounded-0  "
                    block
                    onClick={() => removeAdmin(user)}
                  >
                    <small> Make Customer</small>
                  </Button>
                ) : (
                  <Button
                    variant="outline-success"
                    size="sm"
                    block
                    className="px-1 rounded-0  "
                    onClick={() => addAdmin(user)}
                  >
                    <small> Make Admin</small>
                  </Button>
                )}
              </td>
            </tr>
          );
        })
      : [];
  }, [users]);

  const handleTablePageChange = (newPage) => {
    setCurrentTablePage(newPage);
  };

  return user._id ? (
    !user.isAdmin ? (
      <UnauthorizedPage />
    ) : (
      <>
        <Helmet>
          <title>{constants.messages.USERS} - Chellow</title>
        </Helmet>
        <Container fluid className="bg-light  py-4 bg-light page-section">
          <Row>
            <Col className="py-2 py-md-4" md="6">
              <h2 className="text-dark">{constants.messages.USERS}</h2>
            </Col>
          </Row>
          {users ? (
            <>
              <Table striped bordered hover className="bg-white" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="d-none d-md-table-cell">Last Name</th>
                    <th className="d-none d-md-table-cell">First Name</th>
                    <th>Email</th>
                    <th className="d-none d-md-table-cell">Phone</th>
                    <th className="d-none d-md-table-cell">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <PaginatedRows
                    perPage={rowsPerPage}
                    activePage={currentTablePage}
                  >
                    {userRows}
                  </PaginatedRows>
                </tbody>
              </Table>
              <Paginator
                activePage={currentTablePage}
                perPage={rowsPerPage}
                data={users}
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
