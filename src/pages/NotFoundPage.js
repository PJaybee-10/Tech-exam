import React from 'react';
import FeaturePage from 'components/FeaturePage';
import { Helmet } from 'react-helmet-async';
import constants from '../constants';
import notFoundImg from '../assets/images/not_found.png';
import FeatureContents from '../components/FeatureContents';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>{constants.messages.PAGE_NOT_FOUND} - Chellow</title>
      </Helmet>
      <FeaturePage>
        <FeatureContents
          title={constants.messages.UH_OH}
          message={constants.messages.PAGE_CANNOT_BE_FOUND}
          actionButtonLink="/"
          callToAction={constants.messages.TRY_OTHER_CHOW}
          mascotImage={notFoundImg}
        />
      </FeaturePage>
    </>
  );
}
