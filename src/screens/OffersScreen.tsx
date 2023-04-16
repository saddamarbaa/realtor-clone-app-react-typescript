import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ListingItem from 'components/ListingItem';
import Spinner from 'components/Spinner';
import { db } from 'config/firebase';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ListingT } from 'types/listing';
import { AnimationSettings } from 'utils/schemaValidation/animation';

export default function OffersScreen() {
  const [offersListing, setOffersListing] = useState<ListingT[]>([]);
  const [offersLimit, setOffersLimit] = useState(30);
  const [loading, setLoading] = useState(false);

  // Fetch offers listings
  useEffect(() => {
    const fetchOffersListing = async () => {
      try {
        setLoading(true);
        const listingRef = collection(db, 'listings');
        const listingQuery = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(offersLimit),
        );
        const unsubscribe = onSnapshot(listingQuery, (snapshot) => {
          const result: ListingT[] = [];
          snapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              ...doc.data(),
            };
            result.push(data as ListingT);
          });
          setOffersListing(result);
          setLoading(false);
        });
        return () => {
          unsubscribe();
        };
      } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error('Fetch Listing fail');
      }
    };

    fetchOffersListing();
  }, [offersLimit]);

  if (loading) {
    return <Spinner />;
  }

  if (!loading && offersListing.length === 0) {
    return (
      <motion.section
        className='mx-auto flex h-full w-full max-w-6xl flex-1 flex-wrap items-center justify-center px-6 py-12'
        {...AnimationSettings}
      >
        <div className='w-full max-w-2xl cursor-pointer overflow-hidden rounded-lg bg-white p-10 shadow transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-100 hover:shadow-md'>
          <p className='text-center font-bold'>No offers found</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section className='py-20' {...AnimationSettings}>
      <h1 className='mt-6 text-center text-3xl font-bold'>Offers</h1>
      {/* Offers */}
      {offersListing.length ? (
        <ul className='mx-auto my-4 grid max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {offersListing?.map((listing) => (
            <div key={listing.id}>
              <ListingItem id={listing.id} data={listing} key={listing.id} />
            </div>
          ))}
        </ul>
      ) : null}
    </motion.section>
  );
}
