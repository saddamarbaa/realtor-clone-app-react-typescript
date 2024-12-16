/* eslint-disable react/no-array-index-key */
import ShimmerCard from './ShimmerCard';
import Spinner from './Spinner';

export default function ShimmerList() {
  const loadingItems = Array(10).fill(null);

  return (
    <div className='flex w-full flex-1 flex-col'>
      <Spinner />
      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <ul className='mx-auto my-6 grid w-full max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {loadingItems.map((item, index) => (
            <ShimmerCard key={`${index} index`} />
          ))}
        </ul>
      </div>
    </div>
  );
}
