import { TFunction } from 'i18next';

import { Details } from './Details';
import { Contract } from './Contract';
import { Preferences } from './Preferences';
import { FeaturesStep } from './FeaturesStep';
import { Review } from './Review';

export const getSteps = (isCarrierAdmin: boolean) => (t: TFunction) =>
  isCarrierAdmin
    ? [
        t('company.management.details'),
        t('company.management.contract'),
        t('company.management.preferences'),
        t('company.management.features'),
        t('company.management.review'),
      ]
    : [
        t('company.management.details'),
        t('company.management.preferences'),
        t('company.management.features'),
        t('company.management.review'),
      ];

export const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return <Details />;
    case 1:
      return <Preferences />;
    case 2:
      return <FeaturesStep />;
    default:
      return <Review />;
  }
};

export const getStepContentForCarrierAdmin =
  (edit = false) =>
  (step: number) => {
    switch (step) {
      case 0:
        return <Details />;
      case 1:
        return <Contract editMode={edit} />;
      case 2:
        return <Preferences />;
      case 3:
        return <FeaturesStep />;
      default:
        return <Review />;
    }
  };
