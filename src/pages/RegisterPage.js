import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import FeaturePage from 'components/FeaturePage';
import { Helmet } from 'react-helmet-async';
import LoadingOverlay from 'react-loading-overlay';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { config } from '../config';

export default function RegisterPage() {
  const [isWorking, setIsWorking] = useState(false);
  const [userRegistrationDetails, setUserRegistrationDetails] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    mobileNo: '',
  });
  const { email, password, confirmPassword, firstName, lastName, mobileNo } =
    userRegistrationDetails;
  const [isValidInput, setIsValidInput] = useState(false);
  const history = useHistory();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      mobileNo !== '' &&
      password !== '' &&
      confirmPassword === password &&
      password.length > 7
    ) {
      setIsValidInput(true);
    } else {
      setIsValidInput(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setUserRegistrationDetails((currentState) => {
      return {
        ...currentState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const registerUser = (e) => {
    e.preventDefault();
    setIsWorking(true);
    fetch(`${config.API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobileNo,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsWorking(false);
        if (data.id) {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: `Thank you for registering ${
              data.email ? ', ' + data.email : ''
            }`,
          });
          history.push('/login');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed.',
            text: data.message,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return user._id ? (
    <Redirect to="/" />
  ) : (
    <>
      <Helmet>
        <title>Register - Chellow</title>
      </Helmet>
      <FeaturePage>
        <LoadingOverlay
          active={isWorking}
          spinner
          text="Something Tasty is Loading..."
          className="loading-overlay"
        >
          <Form onSubmit={registerUser}>
            <h2 className="pb-3">Register</h2>
            <Form.Group>
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                value={userRegistrationDetails.firstName}
                name="firstName"
                onChange={handleInputChange}
                placeholder="Enter First Name"
                className="rounded-0"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={userRegistrationDetails.lastName}
                onChange={handleInputChange}
                placeholder="Enter Last Name"
                className="rounded-0"
                required
              />
            </Form.Group>{' '}
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userRegistrationDetails.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="rounded-0"
                required
              />
            </Form.Group>{' '}
            <Form.Group>
              <Form.Label>Mobile No:</Form.Label>
              <Form.Control
                type="tel"
                name="mobileNo"
                value={userRegistrationDetails.mobileNo}
                onChange={handleInputChange}
                placeholder="Enter 11 Digit Mobile No."
                className="rounded-0"
                required
              />
            </Form.Group>{' '}
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={userRegistrationDetails.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className="rounded-0"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={userRegistrationDetails.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="rounded-0"
                required
              />
            </Form.Group>
            <Button
              variant="warning"
              type="submit"
              disabled={!isValidInput}
              block
              className="rounded-0 mt-4 btn-lg"
            >
              Register
            </Button>
            <Link to="/login" className="btn btn-block btn-link mt-3">
              Already Registered? Login
            </Link>
          </Form>
        </LoadingOverlay>
      </FeaturePage>
    </>
  );
}
