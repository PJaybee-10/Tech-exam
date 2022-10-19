import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

export default function CategoriesWidget(props) {
  return (
    <aside>
      <p className="text-black mt-5 font-weight-bold text-danger">Categories</p>
      <hr />
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/category/all" className="text-dark">
          All Chow
        </Nav.Link>
        <Nav.Link as={Link} to="/category/promos" className="text-dark">
          On Promo
        </Nav.Link>
        <Nav.Link as={Link} to="/category/drinks" className="text-dark">
          Drinks
        </Nav.Link>
      </Nav>
    </aside>
  );
}
