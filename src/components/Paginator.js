import React from 'react';
import { Pagination } from 'react-bootstrap';

export default React.memo(function Paginator({
  activePage,
  data,
  perPage,
  onPageChangeCallback,
}) {
  const canGoPrev = activePage > 1;
  const lastPage = Math.ceil(data.length / perPage);
  const canGoNext = activePage < lastPage;

  const goFirstPage = () => {
    if (onPageChangeCallback) {
      onPageChangeCallback(1);
    }
  };

  const goPrevPage = () => {
    if (canGoPrev) {
      if (onPageChangeCallback) {
        onPageChangeCallback(activePage - 1);
      }
    }
  };

  const goNextPage = () => {
    if (canGoNext) {
      if (onPageChangeCallback) {
        onPageChangeCallback(activePage + 1);
      }
    }
  };

  const goLastPage = () => {
    if (onPageChangeCallback) {
      onPageChangeCallback(lastPage);
    }
  };

  return (
    <div>
      <Pagination>
        <Pagination.First onClick={goFirstPage} disabled={!canGoPrev} />
        <Pagination.Prev onClick={goPrevPage} disabled={!canGoPrev} />
        <Pagination.Item disabled>
          <b>{activePage}</b> of <b>{lastPage < 1 ? 1 : lastPage}</b>
        </Pagination.Item>
        <Pagination.Next onClick={goNextPage} disabled={!canGoNext} />
        <Pagination.Last onClick={goLastPage} disabled={!canGoNext} />
      </Pagination>
    </div>
  );
});
