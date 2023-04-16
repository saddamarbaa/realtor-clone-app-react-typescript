import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Button from 'components/Button';
import ListingItem from 'components/ListingItem';
import Spinner from 'components/Spinner';
import { db } from 'config/firebase';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { ListingT } from 'types/listing';

export default function CategoryScreen() {
  const [listings, setListings] = useState<ListingT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastFetchedListing, setLastFetchListing] = useState<any>(null);
  const params = useParams<{ categoryName: string }>();

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(listingRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(15));
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1] || null;
        setLastFetchListing(lastVisible);
        const listings: ListingT[] = [];
        querySnap.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          listings.push(data as ListingT);
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listing');
      }
    }

    fetchListings();
  }, [params.categoryName]);

  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(4),
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1] || null;
      setLastFetchListing(lastVisible);
      const listings: ListingT[] = [];
      querySnap.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        listings.push(data as ListingT);
      });
      setListings((prevState) => [...(prevState ?? []), ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listing');
    }
  }

  if (loading) {
    return <Spinner />;
  }

  if (!loading && listings && listings?.length === 0) {
    return (
      <div className='mx-auto flex h-full w-full max-w-6xl flex-1 flex-wrap items-center justify-center px-6 py-12'>
        <div className='w-full max-w-2xl cursor-pointer overflow-hidden rounded-lg bg-white p-10 shadow transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-100 hover:shadow-md'>
          <p className='text-center font-bold'>
            There are no current {params.categoryName === 'rent' ? 'places for rent' : 'places for sale'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-1 flex-col'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {listings && listings.length > 0 ? (
          <>
            <h1 className='my-6 text-center text-3xl font-bold'>
              {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
            </h1>
            <ul className='mx-auto my-6 grid max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {listings?.map((listing) => (
                <div key={listing.id}>
                  <ListingItem id={listing.id} data={listing} key={listing.id} />
                </div>
              ))}
            </ul>
          </>
        ) : null}

        {lastFetchedListing && (
          <div className='flex items-center justify-center'>
            <div>
              <Button color='white' buttonClassName='text-black' type='button' onClick={() => onFetchMoreListings()}>
                Load more
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
