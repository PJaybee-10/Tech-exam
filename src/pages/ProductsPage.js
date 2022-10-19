import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
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

export default function ProductsPage() {
  const [products, setProducts] = useState(null);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [update, setUpdate] = useState(0);
  const { user } = useContext(UserContext);

  const archive = (product) => {
    fetch(`${config.API_URL}/products/archive/${product._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUpdate({});
      })
      .catch((e) => {
        console.error(e);
        Swal.fire({
          // title: "Success",
          text: `Failed to archive ${product.name}`,
          icon: 'error',
          toast: true,
          timer: 1500,
          position: 'top-end',
        });
      });
  };
  const activate = (product) => {
    fetch(`${config.API_URL}/products/activate/${product._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUpdate({});
      })
      .catch((e) => {
        Swal.fire({
          // title: "Success",
          text: `Failed to archive ${product.name}`,
          icon: 'error',
          toast: true,
          timer: 1500,
          position: 'top-end',
        });
      });
  };

  useEffect(() => {
    if (user.isAdmin) {
      fetch(`${config.API_URL}/products/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user, update]);

  useEffect(() => {
    if (user.isAdmin) {
      fetch(`${config.API_URL}/products/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user, update]);

  useEffect(() => {
    console.log(filterText);
  }, [filterText]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setFilterText(e.target.value);
    setCurrentTablePage(1);
  };

  const productRows = React.useMemo(() => {
    return products
      ? products
          .filter((product) =>
            product.name.toLowerCase().includes(filterText.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((product) => {
            return (
              <tr key={product._id}>
                <td>
                  <Link
                    className="btn btn-sm btn-link rounded-0"
                    to={`/products/${product._id}`}
                  >
                    <small>{product.name}</small>
                  </Link>
                </td>
                <td>
                  <small>&#8369;{product.price.toFixed(2)}</small>
                </td>
                <td>
                  <small>
                    <span
                      className={`${
                        product.isActive ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </small>
                </td>
                <td className="text-nowrap text-right">
                  {product.isActive ? (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-0 d-none d-md-inline-block"
                      title={`Archive ${product.name}`}
                      onClick={() => archive(product)}
                    >
                      <small>{constants.messages.ARCHIVE}&nbsp;</small>
                    </Button>
                  ) : (
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="rounded-0 d-none d-md-inline-block"
                      title={`Activate ${product.name}`}
                      onClick={() => activate(product)}
                    >
                      <small>{constants.messages.ACTIVATE}</small>
                    </Button>
                  )}
                  &nbsp;
                  <Link
                    className="btn btn-sm btn-warning rounded-0"
                    to={`/products/edit/${product._id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })
      : [];
  }, [products, filterText]);

  const rowsPerPage = 10;

  const handleTablePageChange = (newPage) => {
    setCurrentTablePage(newPage);
  };

  return user.isAdmin ? (
    <>
      <Helmet>
        <title>{constants.messages.PRODUCTS} - Chellow</title>
      </Helmet>
      <div className="container-fluid py-4 bg-light">
        <Row>
          <Col className="py-2 py-md-4" md="6">
            <h2 className="text-dark">{constants.messages.PRODUCTS}</h2>
          </Col>
          <Col className="py-2 py-md-4" md="6">
            <Form.Group>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder={constants.messages.FOOD_CATEGORY}
                  aria-label={constants.messages.FOOD_CATEGORY}
                  aria-describedby="search-btn"
                  className="rounded-0"
                  value={filterText}
                  onChange={handleInputChange}
                />
                <Button
                  variant="dark"
                  id="search-btn"
                  className="rounded-0"
                  type="button"
                >
                  {constants.messages.SEARCH}
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        {products ? (
          <>
            <Table striped bordered hover className="bg-white" responsive>
              <thead>
                <tr>
                  <th>{constants.messages.NAME} </th>
                  <th>{constants.messages.PRICE}</th>
                  <th>{constants.messages.STATUS}</th>
                  <th className="text-right">{constants.messages.ACTIONS}</th>
                </tr>
              </thead>
              <tbody>
                <PaginatedRows
                  perPage={rowsPerPage}
                  activePage={currentTablePage}
                >
                  {productRows}
                </PaginatedRows>
              </tbody>
            </Table>
            <Paginator
              activePage={currentTablePage}
              perPage={rowsPerPage}
              data={productRows}
              onPageChangeCallback={handleTablePageChange}
            />
          </>
        ) : (
          <InlineLoadingWidget />
        )}
      </div>
    </>
  ) : (
    <UnauthorizedPage />
  );
}
