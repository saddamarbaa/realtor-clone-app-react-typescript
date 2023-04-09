import { motion } from 'framer-motion';
import { AnimationSettings } from 'utils/schemaValidation/animation';

export default function OffersScreen() {
  return (
    <motion.section className='py-20' {...AnimationSettings}>
      <h1 className='mt-6 text-center text-3xl font-bold'>OffersScreen</h1>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12'>OffersScreen</div>
    </motion.section>
  );
}
