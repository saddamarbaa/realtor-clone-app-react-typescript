import React from 'react'
import { IconType } from 'react-icons'

type Props = {
	color?: string
	onClick?: () => void
	size?: 'small' | 'medium' | 'large'
	isLoading?: boolean
	isDisabled?: boolean
	Icon?: IconType
	iconClass?: string
	children: ReactNode
}

export default function Button({
	color = 'blue',
	onClick,
	size = 'medium',
	children,
	isLoading = false,
	isDisabled = false,
	iconClass = 'mr-2 rounded-full  bg-white  text-2xl',
	Icon,
}: Props) {
	const sizes = {
		small: 'py-1 px-2 text-sm',
		medium: 'py-2 px-4 text-md',
		large: 'py-3 px-6 text-lg',
	}

	const colors = {
		blue: 'bg-blue-500 hover:bg-blue-700 active:bg-blue-800',
		red: 'bg-red-500 hover:bg-red-700',
		green: 'bg-green-500 hover:bg-green-700 active:bg-green-800',
	}

	// add disabled and loading states to button
	const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : ''
	const loadingClass = isLoading ? 'animate-pulse' : ''

	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			className={`flex items-center justify-center rounded uppercase text-white shadow-md transition duration-150 ease-out hover:shadow-lg  ${sizes[size]} ${colors[color]} ${disabledClass} ${loadingClass}`}>
			{/* show loading spinner if isLoading is true */}
			{Icon ? <Icon className={iconClass} /> : null}
			{children}
		</button>
	)
}
