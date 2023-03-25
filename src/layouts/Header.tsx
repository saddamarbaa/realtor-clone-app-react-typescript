import { useLocation, useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';

import Logo from '../components/Logo';
import { auth } from '../config/firebase';

export default function Header() {
  const [user, loading, error] = useAuthState(auth);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const pathMathRoute = (route: string) => route == pathname;

  return (
    <div className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <header className="mx-auto flex max-w-6xl flex-col items-center justify-between space-y-4 p-4 sm:flex-row sm:space-y-0">
        <Logo />
        <ul className="flex flex-col items-center space-y-1 sm:flex-row sm:space-x-10 sm:space-y-0">
          <li
            className={`cursor-pointer  py-3 text-sm font-semibold  transition-all duration-300 hover:border-b-[3px]  hover:border-b-red-500  ${
              pathMathRoute('/') ? 'border-b-[3px] border-b-red-500 text-black' : 'text-gray-400'
            }`}
            onClick={() => navigate('/')}
          >
            Home
          </li>
          <li
            className={`cursor-pointer  py-3 text-sm font-semibold transition-all duration-300 hover:border-b-[3px]  hover:border-b-red-500 ${
              pathMathRoute('/offers') ? 'border-b-[3px] border-b-red-500 text-black' : 'text-gray-400'
            }`}
            onClick={() => navigate('/offers')}
          >
            Offers
          </li>
          <li
            className={`cursor-pointer   py-3 text-sm font-semibold transition-all duration-300 hover:border-b-[3px]  hover:border-b-red-500   ${
              pathMathRoute('/sign-in') || pathMathRoute('/profile')
                ? 'border-b-[3px] border-b-red-500 text-black'
                : 'text-gray-400'
            }`}
            onClick={() => navigate('/profile')}
          >
            {!loading && user ? 'Profile' : 'Sign In'}
          </li>
        </ul>
      </header>
    </div>
  );
}
