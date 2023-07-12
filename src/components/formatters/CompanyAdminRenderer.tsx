import Box from '@carrier-io/fds-react/Box';
import { ContactInfo } from '@carrier-io/lynx-fleet-types';

interface CompanyAdminRendererProps {
  contactInfo: ContactInfo;
}

export const CompanyAdminRenderer = ({
  contactInfo: { name, lastName, email },
}: CompanyAdminRendererProps) => (
  <Box textAlign="end">
    {[name, lastName].filter(Boolean).join(' ')}
    <br />
    {email}
  </Box>
);
