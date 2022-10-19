import React, { useLayoutEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import AddProductPage from './pages/AddProductPage';
import ProductsPage from 'pages/ProductsPage';
import CartPage from 'pages/CartPage';
import MyOrdersPage from 'pages/MyOrdersPage';
import OrderDetailsPage from 'pages/OrderDetailsPage';
import OrdersPage from 'pages/OrdersPage';
import UsersPage from 'pages/UsersPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CategoriesPage from './pages/CategoriesPage';

const AppRouter = () => {
  const location = useLocation();
  // Scroll to top if path changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Switch>
      <Route
        exact
        path="/products/edit/:productId"
        component={AddProductPage}
      />{' '}
      <Route exact path="/products/:productId" component={ProductDetailsPage} />
      <Route exact path="/products" component={ProductsPage} />
      <Route exact path="/category/:categoryName" component={CategoriesPage} />
      <Route exact path="/users/" component={UsersPage} />
      <Route exact path="/orders/:orderId" component={OrderDetailsPage} />
      <Route exact path="/my-orders/:orderId" component={OrderDetailsPage} />
      <Route exact path="/my-orders" component={MyOrdersPage} />
      <Route exact path="/orders" component={OrdersPage} />
      <Route exact path="/cart" component={CartPage} />
      <Route exact path="/logout" component={LogoutPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/" component={ShopPage} />
      <Route path="/" component={NotFoundPage} />
    </Switch>
  );
};

export default AppRouter;
