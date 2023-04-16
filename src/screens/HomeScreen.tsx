import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from 'components/ListingItem';
import Slider from 'components/Slider';
import Spinner from 'components/Spinner';
import { db } from 'config/firebase';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { ListingT } from 'types/listing';

export default function HomeScreen() {
  // State for offers listings
  const [offersListing, setOffersListing] = useState<ListingT[]>([]);
  // State for limit of offers listings
  const [offersLimit, setOffersLimit] = useState(10);
  // State for rentals listings
  const [rentalsListing, setRentalsListing] = useState<ListingT[]>([]);
  // State for limit of rentals listings
  const [rentalsLimit, setRentalsLimit] = useState(10);
  // State for sale listings
  const [salesListing, setSalesListing] = useState<ListingT[]>([]);
  // State for limit of sale listings
  const [salesLimit, setSalesLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Fetch offers listings
  useEffect(() => {
    const fetchOffersListing = async () => {
      try {
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
        });
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error(error);
      }
    };

    fetchOffersListing();
  }, [offersLimit]);

  // Fetch sales listings
  useEffect(() => {
    const fetchSalesListing = async () => {
      try {
        const saleListingRef = collection(db, 'listings');
        const saleListingQuery = query(
          saleListingRef,
          where('type', '==', 'sale'),
          orderBy('timestamp', 'desc'),
          limit(salesLimit),
        );
        const unsubscribe = onSnapshot(saleListingQuery, (snapshot) => {
          const result: ListingT[] = [];
          snapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              ...doc.data(),
            };
            result.push(data as ListingT);
          });
          setSalesListing(result);
        });
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error(error);
      }
    };

    fetchSalesListing();
  }, [salesLimit]);

  // Fetch rentals listings
  useEffect(() => {
    const fetchRentalsListing = async () => {
      try {
        const listingRef = collection(db, 'listings');
        const listingQuery = query(
          listingRef,
          where('type', '==', 'rent'),
          orderBy('timestamp', 'desc'),
          limit(rentalsLimit),
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
          setRentalsListing(result);
        });
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error(error);
      }
    };

    fetchRentalsListing();
  }, [rentalsLimit]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='flex w-full flex-1 flex-col'>
      <Slider />
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Offers */}
        {offersListing.length ? (
          <>
            <h2 className='px-6 text-2xl font-semibold'>Recent Offers</h2>
            <Link to='/offers'>
              <p className='px-6 text-sm text-blue-600 transition duration-150 ease-in-out hover:text-blue-800'>
                Show more offers
              </p>
            </Link>
            <ul className='mx-auto my-4 grid max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {offersListing?.map((listing) => (
                <div key={listing.id}>
                  <ListingItem id={listing.id} data={listing} key={listing.id} />
                </div>
              ))}
            </ul>
          </>
        ) : null}

        {/* For Sale Listings */}
        {salesListing.length ? (
          <>
            <h2 className='px-5 text-2xl font-semibold'>Places for sale</h2>
            <Link to='/category/sale'>
              <p className='px-5 text-sm text-blue-600 transition duration-150 ease-in-out hover:text-blue-800'>
                Show more Places Sale
              </p>
            </Link>
            <ul className='mx-auto my-6 grid max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {salesListing?.map((listing) => (
                <div key={listing.id}>
                  <ListingItem id={listing.id} data={listing} key={listing.id} />
                </div>
              ))}
            </ul>
          </>
        ) : null}

        {/* For Rent Listings */}
        {rentalsListing.length ? (
          <>
            <h2 className='px-5 text-2xl font-semibold'>Places for rent</h2>
            <Link to='/category/rent'>
              <p className='px-5 text-sm text-blue-600 transition duration-150 ease-in-out hover:text-blue-800'>
                Show more places rent
              </p>
            </Link>
            <ul className='mx-auto my-6 grid max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {rentalsListing?.map((listing) => (
                <div key={listing.id}>
                  <ListingItem id={listing.id} data={listing} key={listing.id} />
                </div>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
