import { useLocation, useNavigate } from 'react-router'

import Logo from '../components/logo'

export default function Header() {
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const pathMathRoute = (route: string) => route === pathname

	return (
		<div className="sticky top-0 z-50 border-b bg-white shadow-sm">
			<header className="mx-auto flex max-w-6xl flex-col items-center justify-between space-y-4 p-4 sm:flex-row sm:space-y-0">
				<Logo />
				<ul className="flex flex-col items-center space-y-1 sm:flex-row sm:space-x-10 sm:space-y-0">
					<li
						className={`cursor-pointer border-b-[3px] border-b-transparent py-3 text-sm font-semibold text-gray-400 transition-all duration-300 hover:border-b-red-500   ${
							pathMathRoute('/') && 'border-b-red-500 text-black'
						}`}
						onClick={() => navigate('/')}>
						Home
					</li>
					<li
						className={`cursor-pointer border-b-[3px] border-b-transparent py-3 text-sm font-semibold text-gray-400  transition-all duration-300 hover:border-b-red-500   ${
							pathMathRoute('/offers') && 'border-b-red-500 text-black'
						}`}
						onClick={() => navigate('/offers')}>
						Offers
					</li>
					<li
						className={`cursor-pointer border-b-[3px] border-b-transparent py-3 text-sm font-semibold text-gray-400 transition-all duration-300 hover:border-b-red-500   ${
							pathMathRoute('/sign-in') && 'border-b-red-500 text-black'
						}`}
						onClick={() => navigate('/sign-in')}>
						Log in
					</li>
					<li
						className={`cursor-pointer border-b-[3px] border-b-transparent py-3 text-sm font-semibold text-gray-400 transition-all duration-300 hover:border-b-red-500  ${
							pathMathRoute('/sign-up') && 'border-b-red-500 text-black'
						}`}
						onClick={() => navigate('/sign-up')}>
						Sign up
					</li>
				</ul>
			</header>
		</div>
	)
}
