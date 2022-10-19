import React, { useContext } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import UserContext from 'context/UserContext';
import constants from '../constants';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(UserContext);
  const { name, description, price, images } = product;
  const image = images[0]
    ? images[0]
    : `https://via.placeholder.com/400x400.png?text=${name}`;
  return (
    <Card className=" my-4 rounded-0">
      <Row className="bg-whiteborder border-light no-gutters">
        <Col sm="4">
          <img src={image} alt="name" className="product-img img-fluid h-" />
        </Col>
        <Col sm="8" className="p-3">
          <h5 className="card-title">&#8369;{price.toFixed(2)}</h5>
          <p className="card-text">
            {name}
            <br />
            <small className="card-text text-muted ">{description}</small>{' '}
            <br />
            <Link
              to={`/products/${product._id}`}
              className="btn btn-link btn-sm rounded-0  px-0"
            >
              <FontAwesomeIcon icon={faInfoCircle} /> More Details..
            </Link>
          </p>
          <button
            type="button"
            className="btn btn-success rounded-0 btn-sm"
            onClick={() => addToCart(product)}
          >
            {constants.messages.ADD_TO_CART}
          </button>
        </Col>
      </Row>
    </Card>
  );
}
