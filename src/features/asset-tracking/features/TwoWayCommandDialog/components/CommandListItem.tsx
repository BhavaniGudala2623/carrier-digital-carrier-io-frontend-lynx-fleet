import Grid from '@carrier-io/fds-react/Grid';

/**
 * helper function to create actionable commands list on the right side of the dialog.
 * @param children 3 child components: left, center, right.
 */
export function CommandListItem({
  children,
  hidden,
}: {
  children: (JSX.Element | boolean | null)[] | JSX.Element | boolean | null;
  hidden?: boolean;
}) {
  if (hidden) {
    return null;
  }

  // in case there is only one child.
  if (!Array.isArray(children)) {
    // eslint-disable-next-line no-param-reassign
    children = [children];
  }

  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 1, mb: 1 }}>
      <Grid item>{children[0]}</Grid>
      <Grid item>{children[1]}</Grid>
      {children[2] && <Grid item>{children[2]}</Grid>}
    </Grid>
  );
}
