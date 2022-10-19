import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import FeaturePage from 'components/FeaturePage';
import { Helmet } from 'react-helmet-async';
import LoadingOverlay from 'react-loading-overlay';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { config } from '../config';
import constants from '../constants';

export default function LoginPage() {
  const [isWorking, setIsWorking] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const { email, password } = loginCredentials;
  const [isValidInput, setIsValidInput] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (email !== '' && password !== '') {
      setIsValidInput(true);
    }
  }, [email, password]);

  const loginUser = (e) => {
    e.preventDefault();
    setIsWorking(true);
    fetch(`${config.API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginCredentials.email,
        password: loginCredentials.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          fetch(`${config.API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              setIsWorking(false);
              setUser({
                ...user,
                firstName: data.firstName,
                _id: data._id,
                isAdmin: data.isAdmin,
              });
            });
        } else {
          setIsWorking(false);
          Swal.fire({
            icon: 'error',
            title: constants.messages.LOGIN_FAILED,
            text: data.message
              ? data.message
              : constants.messages.AN_ERROR_OCCURED,
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setIsWorking(false);
        Swal.fire({
          icon: 'error',
          title: constants.messages.UH_OH,
          text: e.message,
        });
      });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setLoginCredentials((currentState) => {
      return {
        ...currentState,
        [e.target.name]: e.target.value,
      };
    });
  };

  return user._id ? (
    user.isAdmin ? (
      <Redirect to="/products" />
    ) : (
      <Redirect to="/" />
    )
  ) : (
    <>
      <Helmet>
        <title>{constants.messages.LOGIN} - Chellow</title>
      </Helmet>
      <FeaturePage>
        <LoadingOverlay
          active={isWorking}
          spinner
          text={constants.messages.LOADING}
          className="loading-overlay"
        >
          <Form onSubmit={loginUser}>
            <h2 className="pb-3">{constants.messages.LOGIN}</h2>
            <Form.Group>
              <Form.Label>{constants.messages.EMAIL}:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder={constants.messages.ENTER_EMAIL}
                className="rounded-0 "
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{constants.messages.PASSWORD}:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder={constants.messages.ENTER_PASSWORD}
                className="rounded-0"
                required
              />
            </Form.Group>
            <Button
              variant="warning"
              type="submit"
              disabled={!isValidInput}
              block
              className="rounded-0 btn-lg"
            >
              {constants.messages.LOGIN}
            </Button>
            <Link to="/register" className="btn btn-block btn-link mt-3">
              {constants.messages.NO_ACCOUNT_CREATE_ACCOUNT}
            </Link>
          </Form>
        </LoadingOverlay>
      </FeaturePage>
    </>
  );
}
