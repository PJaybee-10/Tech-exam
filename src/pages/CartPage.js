import React, { useContext, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import LoadingOverlay from 'react-loading-overlay';
import Swal from 'sweetalert2';
import UnauthorizedPage from './UnauthorizedPage';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants';
import { sumCartItems } from 'shared/utils';

export default function CartPage() {
  const [isWorking, setIsWorking] = useState(false);

  const { user, clearCart, addToCart, removeFromCart } =
    useContext(UserContext);
  const { cart } = user;
  const cartTotal = cart ? sumCartItems(cart) : 0;

  const history = useHistory();

  const checkout = (e) => {
    e.preventDefault();
    setIsWorking(true);
    fetch(`${config.API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        products: cart.map((item) => {
          return {
            id: item._id,
            quantity: item.quantity,
          };
        }),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsWorking(false);

        if (data._id) {
          Swal.fire({
            icon: 'success',
            title: constants.messages.ORDER_CREATED,
            text: constants.messages.ORDER_CREATED_SUCCESSFULLY,
          });
          clearCart();
          history.push('/my-orders');
          // resetInputs();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: data.message ? data.message : 'An error occured',
          });
        }
      })
      .catch((e) => {
        setIsWorking(false);
        console.error(e);
        Swal.fire({
          icon: 'error',
          title: 'Uh Oh :(',
          text: e.message,
        });
      });
  };

  return !user ? (
    <InlineLoadingWidget />
  ) : user.isAdmin ? (
    <UnauthorizedPage
      title={constants.messages.CUSTOMERS_ONLY}
      message={constants.messages.ADMIN_ACCOUNTS_CANNOT_ACCESS_CHECKOUT}
    />
  ) : (
    <LoadingOverlay
      active={isWorking}
      spinner
      text={constants.messages.LOADING}
    >
      <Container fluid className="bg-light py-4">
        <Helmet>
          <title>{constants.messages.CART} - Chellow</title>
        </Helmet>

        <Row>
          <Col xs="12" className="bg-light p-3 mb-0 mb-md-4 text-right ">
            {constants.messages.TOTAL}: &#8369;
            <span className="text-danger font-weight-bold">
              {cartTotal.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={clearCart}
              className="btn btn-sm btn-danger ml-2"
              disabled={(cart && cart.length < 1) || isWorking}
            >
              {constants.messages.EMPTY_CART}
            </button>
          </Col>
        </Row>

        <Row>
          <Col xs="12" md={{ span: 8, offset: 2 }}>
            {cart && cart.length > 0 ? (
              cart
                .sort((a, b) => {
                  return a.order - b.order;
                })
                .map((item) => (
                  <div key={item._id}>
                    <Card className="my-3 rounded-0">
                      <Row>
                        <Col sm="5" md="4">
                          <img
                            src={
                              item.images[0]
                                ? item.images[0]
                                : `https://via.placeholder.com/200x200.png?text=${item.name}`
                            }
                            alt={item.name}
                            className="product-img img-fluid "
                          />
                        </Col>
                        <Col sm="7" md="8">
                          <div className="card-body">
                            <h5 className="card-title">
                              &#8369;{(item.price * item.quantity).toFixed(2)}
                            </h5>
                            <p className="card-text text-muted">
                              {item.quantity} x {item.name}{' '}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item, true)}
                              className="btn btn-dark rounded-0"
                            >
                              -
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                              className="btn btn-dark rounded-0"
                            >
                              +
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              onClick={() => removeFromCart(item)}
                              className="btn btn-danger rounded-0"
                            >
                              Remove
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                ))
            ) : (
              <div className="col-12 py-5 my-5 text-center">
                <p>{constants.messages.NO_ITEMS_IN_CART} </p>
                <Link to="/" className="btn btn-warning btn-lg  rounded-0 mb-4">
                  {constants.messages.LETS_GO}
                </Link>
              </div>
            )}
          </Col>{' '}
        </Row>
        <Row>
          <Col className="my-3" xs="12" md={{ span: 8, offset: 2 }}>
            {cart && cart.length > 0 && (
              <>
                {user._id ? (
                  <Button
                    variant="success"
                    className="rounded-0 my-4"
                    block
                    size="lg"
                    type="button"
                    onClick={checkout}
                    disabled={isWorking}
                  >
                    {constants.messages.CHECKOUT}
                  </Button>
                ) : (
                  <Link
                    className="btn rounded-0 btn-outline-primary border-0 btn-block "
                    to="/login"
                  >
                    {constants.messages.LOGIN_FIRST_TO_CHECKOUT}
                  </Link>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </LoadingOverlay>
  );
}
