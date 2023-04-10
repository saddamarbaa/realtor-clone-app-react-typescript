import { ReactNode } from 'react';
import { IconType } from 'react-icons';

type Props = {
  color?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
  buttonClassName?: string;
  type?: 'submit' | 'button' | 'reset';
  id?: string;
  preStyled?: string;
  Icon?: IconType;
  iconClass?: string;
};

export default function Button({
  color = 'blue',
  onClick,
  size = 'medium',
  children,
  isLoading = false,
  isDisabled = false,
  buttonClassName = 'text-white uppercase',
  type = 'submit',
  id,
  preStyled,
  Icon,
  iconClass = 'mr-2 rounded-full  bg-white  text-2xl',
}: Props) {
  const sizes = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-md',
    large: 'py-3 px-6 text-lg',
  };

  type Colors = {
    [key: string]: string;
  };

  const colors: Colors = {
    blue: 'bg-blue-500 hover:bg-blue-700 active:bg-blue-800',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
    slate: 'bg-slate-600 hover:bg-slate-700 active:bg-slate-800',
    white: 'bg-white',
  };

  // add disabled and loading states to button
  const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : '';
  const loadingClass = isLoading ? 'animate-pulse' : '';

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${
        preStyled ||
        'flex w-full items-center justify-center rounded shadow-md transition duration-150 ease-out hover:shadow-lg'
      }   ${!preStyled && sizes[size]} ${!preStyled && colors[color]} ${disabledClass} ${loadingClass} ${
        !preStyled && buttonClassName
      }`}
    >
      {/* show loading spinner if isLoading is true */}
      {Icon ? <Icon className={iconClass} /> : null}
      {children}
    </button>
  );
}
