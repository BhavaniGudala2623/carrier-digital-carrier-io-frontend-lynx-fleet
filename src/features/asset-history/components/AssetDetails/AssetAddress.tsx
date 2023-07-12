import { useTheme } from '@carrier-io/fds-react/styles';
import { FmdGoodOutlined } from '@mui/icons-material';

interface AssetAddressProps {
  address: string;
}

export const AssetAddress = ({ address }: AssetAddressProps) => {
  const theme = useTheme();

  return (
    <>
      <FmdGoodOutlined sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.text.secondary }} />
      {address}
    </>
  );
};
