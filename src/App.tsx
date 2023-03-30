import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from 'components/PrivateRoute';
import Layout from 'layouts/indes';
import CreateListingScreen from 'screens/CreateListingScreen';
import ForgotPasswordScreen from 'screens/ForgotPasswordScreen';
import HomeScreen from 'screens/HomeScreen';
import NotFoundScreen from 'screens/NotFoundScreen';
import OffersScreen from 'screens/OffersScreen';
import ProfileScreen from 'screens/ProfileScreen';
import SignInScreen from 'screens/SignInScreen';
import SignUpScreen from 'screens/SignUpScreen';

import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<ProfileScreen />} />
          </Route>
          <Route path='/sign-up' element={<SignUpScreen />} />
          <Route path='/sign-in' element={<SignInScreen />} />
          <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
          <Route path='/offers' element={<OffersScreen />} />
          <Route path='/create-listing' element={<PrivateRoute />}>
            <Route path='/create-listing' element={<CreateListingScreen />} />
          </Route>
          <Route path='*' element={<NotFoundScreen />} />
        </Routes>

        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
      </Layout>
    </Router>
  );
}
