import React from "react"
import { IconProps } from ".."

const IconXCircleSolid: React.FC<IconProps> = ({
  iconColorClassName,
  ...props
}) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM8.28 7.22C8.13783 7.08752 7.94978 7.0154 7.75548 7.01883C7.56118 7.02225 7.37579 7.10097 7.23838 7.23838C7.10097 7.37579 7.02225 7.56118 7.01883 7.75548C7.0154 7.94978 7.08752 8.13783 7.22 8.28L8.94 10L7.22 11.72C7.14631 11.7887 7.08721 11.8715 7.04622 11.9635C7.00523 12.0555 6.98319 12.1548 6.98141 12.2555C6.97963 12.3562 6.99816 12.4562 7.03588 12.5496C7.0736 12.643 7.12974 12.7278 7.20096 12.799C7.27218 12.8703 7.35701 12.9264 7.4504 12.9641C7.54379 13.0018 7.64382 13.0204 7.74452 13.0186C7.84523 13.0168 7.94454 12.9948 8.03654 12.9538C8.12854 12.9128 8.21134 12.8537 8.28 12.78L10 11.06L11.72 12.78C11.7887 12.8537 11.8715 12.9128 11.9635 12.9538C12.0555 12.9948 12.1548 13.0168 12.2555 13.0186C12.3562 13.0204 12.4562 13.0018 12.5496 12.9641C12.643 12.9264 12.7278 12.8703 12.799 12.799C12.8703 12.7278 12.9264 12.643 12.9641 12.5496C13.0018 12.4562 13.0204 12.3562 13.0186 12.2555C13.0168 12.1548 12.9948 12.0555 12.9538 11.9635C12.9128 11.8715 12.8537 11.7887 12.78 11.72L11.06 10L12.78 8.28C12.9125 8.13783 12.9846 7.94978 12.9812 7.75548C12.9777 7.56118 12.899 7.37579 12.7616 7.23838C12.6242 7.10097 12.4388 7.02225 12.2445 7.01883C12.0502 7.0154 11.8622 7.08752 11.72 7.22L10 8.94L8.28 7.22Z"
        className={
          iconColorClassName ||
          "tw-fill-medusa-icon-subtle dark:tw-fill-medusa-icon-subtle-dark"
        }
      />
    </svg>
  )
}

export default IconXCircleSolid
