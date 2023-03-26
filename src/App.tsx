import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';

import Layout from './layouts';
import CreateListingScreen from './screens/CreateListingScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import OffersScreen from './screens/OffersScreen';
import ProfileScreen from './screens/ProfileScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>
          <Route path="/sign-up" element={<SignUpScreen />} />
          <Route path="/sign-in" element={<SignInScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/offers" element={<OffersScreen />} />
          <Route path="/create-listing" element={<CreateListingScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Layout>
    </Router>
  );
}

export default App;
