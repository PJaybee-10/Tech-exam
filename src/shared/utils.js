import { format as formatDateL } from 'date-fns';

export const countCartItems = (cart) => {
  const total = cart.reduce((prev, current) => {
    return prev + current.quantity;
  }, 0);
  return total;
};

export const sumCartItems = (cart) => {
  const total = cart.reduce((prev, current) => {
    return prev + current.quantity * current.price;
  }, 0);
  return total;
};

export const formatDate = formatDateL;
