import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import CategoriesWidget from 'components/CategoriesWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet-async';
import InlineLoadingWidget from 'components/InlineLoadingWidget';
import ProductCard from 'components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import { config } from '../config';
import constants from '../constants';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function ShopPage() {
  const [isWorking, setIsWorking] = useState(false);
  const [productCards, setProductCards] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedText, setSearchedText] = useState('');
  const [resultsModeOn, setResultsModeOn] = useState(false);

  useEffect(() => {
    if (!resultsModeOn) {
      fetch(`${config.API_URL}/products`)
        .then((res) => res.json())
        .then((data) => {
          setProductCards(
            data.map((product) => {
              return (
                <Col xs="12" md="6" key={product._id}>
                  <ProductCard product={product} />
                </Col>
              );
            })
          );
        });
    }
  }, [resultsModeOn]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setSearchedText(searchText);
    setIsWorking(true);
    fetch(encodeURI(`${config.API_URL}/products/search/${searchText}`))
      .then((res) => res.json())
      .then((data) => {
        setIsWorking(false);
        setResultsModeOn(true);
        console.log(data);
        setProductCards(
          data.map((product) => {
            return (
              <Col xs="12" md="6" key={product._id}>
                <ProductCard product={product} />
              </Col>
            );
          })
        );
      })
      .catch((e) => {
        console.error(e);
        setResultsModeOn(false);
        setIsWorking(false);
      });
  };

  const closeSearch = () => setResultsModeOn(false);

  return (
    <>
      <Helmet>
        <title>Chellow - {constants.messages.HOME_MOTTO}</title>
      </Helmet>
      <section className="bg-light">
        <ProductCarousel />
      </section>
      <section className="bg-light p-4">
        <Row>
          <Col xs={{ span: 12, order: 2 }} lg={{ span: 9, order: 1 }}>
            {productCards && !isWorking ? (
              <>
                {resultsModeOn && (
                  <Row className="py-4 bg-white">
                    <Col>
                      <b>{productCards.length} </b> Search Results for&nbsp;
                      <span className="text-danger">"{searchedText}"</span>
                      &nbsp;
                    </Col>
                    <Col className="text-right">
                      <Button
                        variant="danger"
                        className="rounded-0"
                        type="button"
                        onClick={closeSearch}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} /> Close Search
                      </Button>
                    </Col>
                  </Row>
                )}
                <Row>{productCards}</Row>
              </>
            ) : (
              <InlineLoadingWidget />
            )}
          </Col>
          <Col
            xs={{ span: 12, order: 1 }}
            lg={{ span: 3, order: 2 }}
            className="pt-4"
          >
            <Form onSubmit={handleSubmitSearch}>
              <Form.Group>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder={constants.messages.FOOD_CATEGORY}
                    aria-label={constants.messages.FOOD_CATEGORY}
                    aria-describedby="search-btn"
                    className="rounded-0"
                    value={searchText}
                    onChange={handleInputChange}
                  />
                  <Button
                    variant="dark"
                    id="search-btn"
                    className="rounded-0"
                    type="submit"
                  >
                    {constants.messages.SEARCH}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Form>
            <div className="d-none d-lg-block">
              <CategoriesWidget />
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
}
