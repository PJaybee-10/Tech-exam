import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { UserProvider } from './context/UserContext';
import AppRouter from './AppRouter';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { config } from 'config';
import Swal from 'sweetalert2';

function App() {
  let cart;
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      cart = JSON.parse(cartData);
    }
  } catch (e) {
    cart = [];
  }

  const [user, setUser] = useState({
    firstName: null,
    _id: null,
    isAdmin: null,
    cart,
  });

  const unsetUser = () => {
    localStorage.clear();
    setUser({
      firstName: null,
      isAdmin: null,
      _id: null,
    });
  };

  const addToCart = (product) => {
    const currentItems = user.cart;
    if (!currentItems) {
      setUser({
        ...user,
        cart: [
          {
            _id: product._id,
            quantity: 1,
            price: product.price,
            name: product.name,
            order: product.order ? product.order : 0,
            images: product.images,
          },
        ],
      });
    } else {
      setUser((prevState) => {
        const currentCart = prevState.cart.filter((item) => {
          return item._id !== product._id;
        });
        const isExisting = prevState.cart.find((item) => {
          return item._id === product._id;
        });
        return {
          ...prevState,
          cart: [
            ...currentCart,
            {
              _id: product._id,
              quantity: isExisting ? isExisting.quantity + 1 : 1,
              price: product.price,
              name: product.name,
              order: isExisting ? isExisting.order : prevState.cart.length + 1,
              images: product.images,
            },
          ],
        };
      });
    }
    Swal.fire({
      // title: "Success",
      text: `Added ${product.name} to cart`,
      icon: 'success',
      toast: true,
      timer: 1500,
      position: 'top-end',
    });
  };

  const removeFromCart = (product, singleMode = false) => {
    console.log('sm', singleMode);
    const currentItems = user.cart;
    if (!currentItems) {
      return;
    } else {
      setUser((prevState) => {
        const currentCart = prevState.cart.filter((item) => {
          return item._id !== product._id;
        });
        const isExisting = prevState.cart.find((item) => {
          return item._id === product._id;
        });

        if (singleMode && isExisting && isExisting.quantity - 1 > 0) {
          return {
            ...prevState,
            cart: [
              ...currentCart,
              {
                _id: product._id,
                quantity: isExisting.quantity - 1,
                price: product.price,
                name: product.name,
                order: isExisting.order,
                images: product.images,
              },
            ],
          };
        } else {
          return {
            ...prevState,
            cart: [...currentCart],
          };
        }
      });
    }
  };

  const clearCart = () => {
    setUser({
      ...user,
      cart: [],
    });
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(user.cart));
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${config.API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({
            ...user,
            firstName: data.firstName,
            _id: data._id,
            isAdmin: data.isAdmin,
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HelmetProvider>
      <UserProvider
        value={{
          user: user,
          setUser: setUser,
          unsetUser,
          addToCart,
          clearCart,
          removeFromCart,
        }}
      >
        <Router>
          <Header />
          <main className="pt-5">
            <AppRouter />
          </main>
          <Footer />
        </Router>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
