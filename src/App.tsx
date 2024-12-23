import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from 'layouts/index';

import AnimatedRoutes from './AnimationLayout';

import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
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
