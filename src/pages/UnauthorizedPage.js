import React from 'react';
import FeaturePage from 'components/FeaturePage';
import { Helmet } from 'react-helmet-async';
import constants from '../constants';
import FeatureContents from '../components/FeatureContents';
import kitchenStaff from '../assets/images/staff_only.png';

export default function UnauthorizedPage({
  title,
  message,
  callToAction,
  actionButtonLink,
}) {
  return (
    <>
      <Helmet>
        <title>{constants.messages.UNAUTHORIZED} - Chellow</title>
      </Helmet>
      <FeaturePage>
        <FeatureContents
          title={title ? title : constants.messages.STAFF_ONLY}
          message={message ? message : constants.messages.LOGIN_FIRST}
          actionButtonLink={actionButtonLink ? actionButtonLink : '/'}
          callToAction={
            callToAction ? callToAction : constants.messages.TRY_OTHER_CHOW
          }
          mascotImage={kitchenStaff}
        />
      </FeaturePage>
    </>
  );
}
