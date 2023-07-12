import SvgIcon, { SvgIconProps } from '@carrier-io/fds-react/SvgIcon';

export const RestoreIcon = (props: SvgIconProps) => {
  const { fill } = props;

  return (
    <SvgIcon
      width="15"
      height="12"
      viewBox="0 0 15 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill={fill || 'black'}
        d="M8.6665 0C5.35317 0 2.6665 2.68667 2.6665 6H0.666504L3.25984 8.59333L3.3065 8.68667L5.99984 6H3.99984C3.99984 3.42 6.0865 1.33333 8.6665 1.33333C11.2465 1.33333 13.3332 3.42 13.3332 6C13.3332 8.58 11.2465 10.6667 8.6665 10.6667C7.37984 10.6667 6.21317 10.14 5.37317 9.29333L4.4265 10.24C5.51317 11.3267 7.0065 12 8.6665 12C11.9798 12 14.6665 9.31333 14.6665 6C14.6665 2.68667 11.9798 0 8.6665 0ZM7.99984 3.33333V6.66667L10.8532 8.36L11.3332 7.55333L8.99984 6.16667V3.33333H7.99984Z"
        fillOpacity="0.54"
      />
    </SvgIcon>
  );
};
