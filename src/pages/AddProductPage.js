import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import LoadingOverlay from 'react-loading-overlay';
import Swal from 'sweetalert2';
import UnauthorizedPage from './UnauthorizedPage';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

export default function AddProductPage() {
  const [isWorking, setIsWorking] = useState(false);
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stocks: '',
  });
  const { name, description, price, imageUrl, stocks } = productDetails;
  const [isValidInput, setIsValidInput] = useState(false);
  const { user } = useContext(UserContext);

  const history = useHistory();

  useEffect(() => {
    if (name !== '' && description !== '' && price !== '') {
      setIsValidInput(true);
    }
  }, [name, description, price, stocks]);

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
            const { _id, name, description, price, images, stocks } = data;
            setProductDetails({
              _id,
              name,
              description,
              price,
              imageUrl: images[0] ? images[0] : null,
              stocks: stocks ? stocks : 0,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: constants.messages.PRODUCT_NOT_AVAILABLE,
              text: data.message,
            });
          }
        })
        .catch((e) => console.error(e));
    }
  }, [productId]);

  const addProduct = (e) => {
    e.preventDefault();
    setIsWorking(true);
    const productEndpoint = !(productId === 'add')
      ? `${config.API_URL}/products/${productId}`
      : `${config.API_URL}/products`;

    fetch(productEndpoint, {
      method: !(productId === 'add') ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name,
        description,
        price,
        images: [imageUrl],
        stocks,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsWorking(false);
        if (data._id) {
          Swal.fire({
            icon: 'success',
            // title: productId === 'add' ? 'Product Added' : 'Product Updated',
            text: `${name} was ${
              productId === 'add' ? 'added' : 'updated'
            } successfully`,
            toast: true,
            timer: 1500,
            position: 'top-end',
          });
          history.push('/products');
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
        console.error(e);
        setIsWorking(false);
        Swal.fire({
          icon: 'error',
          title: 'Uh Oh :(',
          text: e.message,
        });
      });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setProductDetails((currentState) => {
      return {
        ...currentState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleFileInputChange = (event) => {
    // setImageFile(URL.createObjectURL(event.target.files[0]));
    if (!config.CLOUDINARY_PRESET) {
      event.preventDefault();
      console.error(`Cloudinary config && preset must be set as environment variables "REACT_APP_CLOUDINARY_CLOUD_NAME" and "REACT_APP_CLOUDINARY_PRESET". Current Settings are
      REACT_APP_CLOUDINARY_CLOUD_NAME: ${config.CLOUDINARY_CLOUD_NAME}
      REACT_APP_CLOUDINARY_PRESET: ${config.CLOUDINARY_PRESET}`);
      Swal.fire({
        icon: 'error',
        title: constants.messages.OH_NO,
        text: constants.messages.CONFIGURATION_ERROR_CONTACT_ADMIN,
      });
      return;
    }
    const data = new FormData();
    data.append('upload_preset', config.CLOUDINARY_PRESET);
    data.append('file', event.target.files[0]);
    data.append('cloud_name', config.CLOUDINARY_CLOUD_NAME);
    setIsWorking(true);
    fetch(
      `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: data,
      }
    )
      .then((res) => {
        setIsWorking(false);
        console.log('response', res);
        return res.json();
      })
      .then((data) => {
        if (data.secure_url) {
          setProductDetails((currentState) => ({
            ...currentState,
            imageUrl: data.secure_url,
          }));
          return;
        } else {
          console.error(data);
          Swal.fire({
            icon: 'error',
            title: constants.messages.OH_NO,
            text:
              data.error && data.error.message
                ? `Cloudinary: ${data.error.message}`
                : constants.messages.SOMETHING_WENT_WRONG,
          });
        }
      })
      .catch((e) => {
        setIsWorking(false);
        console.error(e);
        Swal.fire({
          icon: 'error',
          title: constants.messages.OH_NO,
          text: e.message,
        });
      });
  };

  return !user ? (
    <InlineLoadingWidget />
  ) : !user.isAdmin ? (
    <UnauthorizedPage />
  ) : (
    <LoadingOverlay
      active={isWorking}
      spinner
      text={constants.messages.SOMETHING_TASTY_LOADING}
    >
      <Container fluid className="bg-light">
        <Helmet>
          <title>
            {productId === 'add'
              ? constants.messages.ADD_PRODUCT
              : constants.messages.EDIT_PRODUCT}
            - Chellow
          </title>
        </Helmet>
        <Row className="p-2 p-md-5">
          <Col>
            <h2 className="text-dark my-4">
              {productId === 'add'
                ? constants.messages.ADD_PRODUCT
                : constants.messages.EDIT_PRODUCT}
            </h2>
            <Form onSubmit={(e) => addProduct(e)}>
              <Form.Group>
                <Form.Label>{constants.messages.NAME}:</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  name="name"
                  onChange={handleInputChange}
                  placeholder={constants.messages.ENTER_PRODUCT_NAME}
                  className="rounded-0"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{constants.messages.DESCRIPTION}:</Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  name="description"
                  onChange={handleInputChange}
                  placeholder={constants.messages.ENTER_PRODUCT_DESCRIPTION}
                  className="rounded-0"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{constants.messages.PRICE}:</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  min={0}
                  name="price"
                  onChange={handleInputChange}
                  placeholder={constants.messages.ENTER_PRODUCT_PRICE}
                  className="rounded-0"
                  required
                />
              </Form.Group>
              {/* <Form.Group>
                <Form.Label>Stocks:</Form.Label>
                <Form.Control
                  type="number"
                  value={stocks}
                  min={0}
                  name="stocks"
                  onChange={handleInputChange}
                  placeholder={constants.messages.ENTER_PRODUCT_STOCKS}
                  className="rounded-0"
                  required
                />
              </Form.Group> */}
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>
                      {constants.messages.IMAGE_URL_OPTIONAL}:
                    </Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="url"
                        value={imageUrl}
                        readOnly
                        name="imageUrl"
                        // onChange={handleInputChange}
                        // placeholder="Enter Image Url"
                        className="rounded-0"
                      />
                      <label
                        variant="dark"
                        className={`btn btn-dark rounded-0 ${
                          isWorking ? 'disabled' : ''
                        }`}
                        type="button"
                        htmlFor="fileSelect"
                      >
                        {constants.messages.SELECT_IMAGE}...
                      </label>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs="3" sm="2" lg="1">
                  <div className="card rounded-0">
                    <img
                      src={
                        imageUrl && imageUrl.length > 1
                          ? imageUrl
                          : 'https://via.placeholder.com/400x400.png?text=No Image'
                      }
                      alt="Preview"
                      className="img-fluid fit-cover double-line-image"
                    />
                  </div>
                </Col>
              </Row>
              <Link className="btn btn-secondary rounded-0" to="/products">
                <FontAwesomeIcon icon={faArrowCircleLeft} />{' '}
                {constants.messages.GO_BACK_TO_PRODUCTS}
              </Link>
              &nbsp;
              <Button
                variant="success"
                type="submit"
                className="rounded-0 my-4"
                disabled={!isValidInput}
              >
                {productId === 'add'
                  ? constants.messages.ADD_PRODUCT
                  : constants.messages.SAVE_CHANGES}
              </Button>
              <input
                type="file"
                id="fileSelect"
                onChange={handleFileInputChange}
                style={{ width: 16, height: 16, visibility: 'hidden' }}
              />
            </Form>
          </Col>
        </Row>
      </Container>
    </LoadingOverlay>
  );
}
