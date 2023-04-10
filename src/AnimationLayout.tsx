import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute';
import { AnimatePresence } from 'framer-motion';
import CreateListingScreen from 'screens/CreateListingScreen';
import EditListingScreen from 'screens/EditListingScreen';
import ForgotPasswordScreen from 'screens/ForgotPasswordScreen';
import HomeScreen from 'screens/HomeScreen';
import NotFoundScreen from 'screens/NotFoundScreen';
import OffersScreen from 'screens/OffersScreen';
import ProfileScreen from 'screens/ProfileScreen';
import SignInScreen from 'screens/SignInScreen';
import SignUpScreen from 'screens/SignUpScreen';

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes key={location.pathname} location={location}>
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
        <Route path='/edit-listing' element={<PrivateRoute />}>
          <Route path='/edit-listing/:listingID' element={<EditListingScreen />} />
        </Route>
        <Route path='*' element={<NotFoundScreen />} />
      </Routes>
    </AnimatePresence>
  );
}
