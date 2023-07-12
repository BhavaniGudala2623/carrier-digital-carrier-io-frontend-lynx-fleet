import Link from '@carrier-io/fds-react/Link';
import { useLocation, useNavigate } from 'react-router-dom';

import { BreadcrumbType } from './types';

export const BreadcrumbsLink = ({ item, isLastItem }: { item: BreadcrumbType; isLastItem: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (item.path !== location.pathname) {
      navigate(item.path);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      color="primary.contrastText"
      sx={{
        cursor: isLastItem ? 'default' : 'pointer',
        opacity: isLastItem ? 1 : 0.6,
      }}
      underline="none"
      variant="body1"
      onClick={handleClick}
    >
      {item.title}
    </Link>
  );
};
