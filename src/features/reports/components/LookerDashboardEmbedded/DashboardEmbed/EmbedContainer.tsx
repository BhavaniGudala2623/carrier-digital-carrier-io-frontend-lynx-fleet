/**
 * src/components/looker/DashboardEmbed/EmbedContainer.tsx
 * A simple styled component wrapper
 */
import { styled } from '@mui/material/styles';

export const EmbedContainer = styled('div')<{
  height?: string | number;
  width?: string | number;
}>`
  width: ${(props) => (props.width ? props.width : '100%')};
  height: ${(props) => (props.height ? props.height : '100%')};
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;
