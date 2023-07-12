import CircularProgress from '@carrier-io/fds-react/CircularProgress';

export const LoadingOverlay = () => (
  <div
    className="ag-overlay-loading-center"
    style={{
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
    }}
  >
    <CircularProgress />
  </div>
);
