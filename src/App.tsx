import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from 'react-router-dom'

import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import HomeScreen from './screens/HomeScreen'
import NotFoundScreen from './screens/NotFoundScreen'
import OffersScreen from './screens/OffersScreen'
import ProfileScreen from './screens/ProfileScreen'
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomeScreen />} />
				<Route path="/profile" element={<ProfileScreen />} />
				<Route path="/sign-up" element={<SignUpScreen />} />
				<Route path="/sign-in" element={<SignInScreen />} />
				<Route path="/forgot-password" element={<ForgotPasswordScreen />} />
				<Route path="/offers" element={<OffersScreen />} />
				<Route path="*" element={<NotFoundScreen />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
