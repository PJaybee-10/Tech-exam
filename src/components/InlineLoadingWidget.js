import React from 'react';
import LoadingOverlay from 'react-loading-overlay';

export default function InlineLoadingWidget() {
  return (
    <LoadingOverlay
      active={true}
      spinner
      styles={{
        overlay: (base) => ({
          ...base,
          background: 'rgba(0, 0, 0, 0)',
        }),
        spinner: (base) => ({
          ...base,

          '& svg circle': {
            stroke: 'rgba(255, 0, 0, 0.5)',
          },
        }),
      }}
    >
      <div className="col col-12 p-5">&nbsp; &nbsp;</div>
    </LoadingOverlay>
  );
}
