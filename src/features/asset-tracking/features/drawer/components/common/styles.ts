export const squareSx = {
  cursor: 'pointer',
  padding: 1,
  height: 82,
  backgroundColor: 'background.paper',
  userSelect: 'none',
  '&:hover': {
    boxShadow: 2,
  },
};

export const squareSelectedSx = {
  cursor: 'pointer',
  padding: 1,
  height: 82,
  userSelect: 'none',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'action.selected',
  },
};
