import Container from '@carrier-io/fds-react/Container';

import { Loader } from '../Loader';

import { CarrierLogoIcon } from '@/icons';

import './styles.scss';

export const SplashScreen = () => (
  <Container className="SplashScreenContainer">
    <CarrierLogoIcon className="CarrierIcon" />
    <Loader className="LoaderSplash" />
  </Container>
);
