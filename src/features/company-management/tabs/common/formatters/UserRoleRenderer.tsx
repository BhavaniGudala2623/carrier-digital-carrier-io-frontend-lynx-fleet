export const UserRoleRenderer = ({ value }: { value: string }) => {
  const formattedRole =
    value
      ?.split('_')
      .map((role) => role.charAt(0) + role.slice(1).toLowerCase())
      .join(' ') ?? '';

  return <span>{formattedRole}</span>;
};
