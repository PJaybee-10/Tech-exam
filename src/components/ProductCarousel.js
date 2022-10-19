import React from 'react';
import { Carousel } from 'react-bootstrap';

export default function ProductCarousel() {
  return (
    <Carousel>
      <Carousel.Item interval={8000}>
        <img
          className="d-block w-100"
          src="https://res.cloudinary.com/ddng6ybes/image/upload/v1635425760/gonuts-donuts_emfpxt.jpg"
          alt="Go Nuts with our Donuts"
        />
        <Carousel.Caption>
          <div className="semi-trans-div">
            <h3 className="text-white font-weight-bold">
              <span>
                &nbsp;Go Nuts <span className="text-xxl">&nbsp;4&nbsp;</span>{' '}
                Donuts&nbsp;
              </span>
            </h3>

            <p className="text-light font-weight-bold ">
              <span>
                &nbsp; For only <b>399</b> get a box of 4 &nbsp;
              </span>
            </p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img
          className="d-block w-100"
          src="https://res.cloudinary.com/ddng6ybes/image/upload/v1635425575/value-meal_v4hbia.jpg"
          alt=""
        />

        <Carousel.Caption>
          <div className="semi-trans-div">
            <h3 className="text-white font-weight-bold">
              <span>&nbsp; Value MAX meal &nbsp;</span>
            </h3>
            <p className="text-light font-weight-bold ">
              <span>
                &nbsp; Get the most of your money with this meal &nbsp;
              </span>
            </p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
