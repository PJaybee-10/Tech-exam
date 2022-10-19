import React from 'react';

export default React.memo(function PaginatedRows({
  children,
  activePage = 1,
  perPage = 10,
}) {
  const startItem = (activePage - 1) * perPage;
  const endItem = (activePage - 1) * perPage + perPage;
  const activeChildren = children.slice(startItem, endItem);
  return <>{activeChildren}</>;
});
