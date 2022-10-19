import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants';
import { useHistory } from 'react-router-dom';

import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState({ _id: null });

  const [update, setUpdate] = useState(0);
  const { name, description, price, images } = product;
  const image =
    images && images[0]
      ? images[0]
      : `https://via.placeholder.com/400x400.png?text=${name}`;

  const { user, addToCart } = useContext(UserContext);

  const history = useHistory();

  useEffect(() => {
    if (!(productId === 'add')) {
      fetch(`${config.API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data._id) {
            setProduct(data);
          } else {
            Swal.fire({
              icon: 'error',
              title: constants.messages.PRODUCT_NOT_AVAILABLE,
              text: data.message,
            });
            history.push('/products');
          }
        })
        .catch((e) => {
          console.error(e);
          history.push('/products');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, update]);

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
  return !product.name ? (
    <InlineLoadingWidget />
  ) : (
    <Container fluid className="bg-light p-3 p-md-5">
      <Helmet>
        <title>{product.name} - Chellow</title>
      </Helmet>

      <Row className="my-5">
        <Col xs="12" md={{ span: 3, offset: 1 }}>
          <img
            src={image}
            alt="Preview"
            className="img-fluid fit-cover product-page-image"
          />
        </Col>
        <Col>
          <div>
            <h2 className="text-dark mb-4">{name}</h2>
            <p>
              <span className="text-muted">Details </span>
              <br />
              <span className="text-xl">{description}</span>
            </p>

            <h2 className="text-dark mb-4 font-weight-light">
              &#8369;{price.toFixed(2)}
            </h2>
            {user.isAdmin ? (
              <>
                <p className="my-3">
                  <span className="text-muted">Status: </span>{' '}
                  <span
                    className={`${
                      product.isActive ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <p>
                  {product.isActive ? (
                    <button
                      type="button"
                      className="btn btn-danger rounded-0 "
                      onClick={() => archive(product)}
                    >
                      {constants.messages.ARCHIVE} Product
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success rounded-0"
                      onClick={() => activate(product)}
                    >
                      {constants.messages.ACTIVATE} Product
                    </button>
                  )}
                  &nbsp;
                  <Link
                    className="btn btn-warning rounded-0"
                    to={`/products/edit/${productId}`}
                  >
                    {constants.messages.EDIT_PRODUCT}
                  </Link>
                </p>
              </>
            ) : (
              <p>
                <button
                  type="button"
                  className="btn btn-success rounded-0 "
                  onClick={() => addToCart(product)}
                >
                  {constants.messages.ADD_TO_CART}
                </button>
              </p>
            )}
            <p>
              <Link
                className="btn btn-link rounded-0"
                to={user.isAdmin ? '/products' : '/category/all'}
              >
                <FontAwesomeIcon icon={faArrowCircleLeft} />{' '}
                {constants.messages.GO_BACK_TO_PRODUCTS}
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
