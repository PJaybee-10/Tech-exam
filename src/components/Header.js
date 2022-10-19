import React, { useContext } from 'react';
import { Badge, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserContext from '../context/UserContext';
import constants from '../constants';
import { countCartItems } from '../shared/utils';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { user } = useContext(UserContext);
  const { cart } = user;
  const cartCount = cart ? countCartItems(cart) : 0;
  /*
  NOTE on using both "to" and "href" attributes in Nav.Link: 
  For Navbar to "collapseOnSelect" apparently you still need the href attributes.

  Adding these attributes, does not affect react-router-dom. The Nav.Link still behaves like a normal react-router-dom Link.
  
  See https://stackoverflow.com/a/59799445/11854340
  */
  return (
    <header>
      <Navbar bg="warning" expand="lg" fixed="top" collapseOnSelect>
        <Navbar.Brand as={Link} to="/" className="font-monoton text-lg">
          Chellow
        </Navbar.Brand>
        <Nav.Link
          className="ml-auto d-lg-none pl-0 pr-2 text-dark flex-grow-0"
          as={NavLink}
          to="/cart"
          href="/cart"
        >
          <FontAwesomeIcon icon={faShoppingCart} />
          <Badge variant="danger" pill>
            {cartCount}
          </Badge>
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" href="/">
              {constants.messages.CHOW}
            </Nav.Link>
            <Nav.Link as={Link} to="/category/promos" href="/category/promos">
              {' '}
              {constants.messages.PROMOS}
            </Nav.Link>
            {!user.isAdmin && (
              <>
                <Nav.Link
                  className="d-lg-none"
                  as={NavLink}
                  to="/cart"
                  href="/cart"
                >
                  {' '}
                  {constants.messages.SHOPPING_CART} ({cartCount})
                </Nav.Link>
                <Nav.Link
                  className="d-none d-lg-block"
                  as={NavLink}
                  to="/cart"
                  href="/cart"
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <Badge variant="danger" pill>
                    {cartCount}
                  </Badge>
                </Nav.Link>
              </>
            )}
            <Nav.Link disabled className="d-none d-lg-block">
              &nbsp;|&nbsp;
            </Nav.Link>

            {user._id ? (
              <>
                {user.isAdmin ? (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <NavDropdown.Item
                      as={Link}
                      to="/products/edit/add"
                      href="/products/edit/add"
                    >
                      {constants.messages.ADD_PRODUCTS}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/products" href="/products">
                      {constants.messages.VIEW_PRODUCTS}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orders" href="/orders">
                      {constants.messages.VIEW_ORDERS}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/users" href="/users">
                      {constants.messages.VIEW_USERS}
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/my-orders" href="/my-orders">
                    {constants.messages.MY_ORDERS}
                  </Nav.Link>
                )}
                <NavDropdown
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUserCircle} /> {user.firstName}
                    </span>
                  }
                  id="user-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile" href="/profile">
                    {constants.messages.PROFILE}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/logout" href="/logout">
                    {constants.messages.LOGOUT}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/register" href="/register">
                  {constants.messages.REGISTER}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" href="/login">
                  {constants.messages.LOGIN}
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
