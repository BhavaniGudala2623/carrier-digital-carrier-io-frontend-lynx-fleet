import { styled } from '@mui/material';

export const StepContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '480px',
});

export const StepReviewContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '70%',
});

export const ReviewRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(3.5),
  paddingBottom: 1,
  fontSize: 15,
}));

export const ReviewValuesColumn = styled('div')({
  flexGrow: 0,
  maxWidth: '50%',
  flexBasis: '50%',
  flexDirection: 'column',
});
