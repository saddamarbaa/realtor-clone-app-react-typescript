import React from 'react';
import { motion } from 'framer-motion';

import Footer from './Footer';
import Header from './Header';

type Props = {
  children: React.ReactNode;
};

const headerVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { duration: 0.5 } },
};

const footerVariants = {
  hidden: { y: 100 },
  visible: { y: 0, transition: { duration: 0.5 } },
};

export default function Layout({ children }: Props) {
  return (
    <div className='flex min-h-screen flex-col'>
      <motion.header variants={headerVariants} initial='hidden' animate='visible'>
        <Header />
      </motion.header>
      <motion.main
        className='flex flex-1 flex-col'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <motion.footer variants={footerVariants} initial='hidden' animate='visible'>
        <Footer />
      </motion.footer>
    </div>
  );
}
