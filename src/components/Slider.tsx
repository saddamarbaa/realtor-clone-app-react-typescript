import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Spinner from 'components/Spinner';
import { db } from 'config/firebase';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ListingT } from 'types/listing';

import 'swiper/css/bundle';

import 'leaflet/dist/leaflet.css';

export default function ListingScrmneen() {
  // Install Swiper components
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState<ListingT[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const listingRef = collection(db, 'listings');
    const listingQuery = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
    const unsubscribe = onSnapshot(listingQuery, (snapshot) => {
      const result: ListingT[] = [];
      snapshot.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        result.push(data as ListingT);
      });
      setListing(result);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!loading && listing.length === 0) {
    return (
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-center  px-6 py-12'>
        <p className='mt-8 w-full max-w-lg rounded  border bg-white p-6 text-center font-bold'>No Listing found</p>
      </div>
    );
  }

  return (
    <section className='flex w-full flex-col space-y-5'>
      <div className='relative w-full cursor-pointer'>
        {listing && listing.length && (
          <Swiper
            slidesPerView={1}
            navigation
            pagination={{ type: 'progressbar' }}
            effect='fade'
            modules={[EffectFade]}
            autoplay={{ delay: 3000 }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {listing?.map((data) => (
              <SwiperSlide key={data.id} onClick={() => navigate(`/category/${data.type}/${data.id}`)}>
                <div
                  className='relative h-[300px]  w-full overflow-hidden lg:h-[320px]'
                  style={{
                    background: `url(${data?.imgUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                />
                <div className='absolute top-0 flex h-full w-full  flex-col justify-between px-2 py-3'>
                  <p className='w-fit cursor-pointer rounded-tr-3xl bg-[#e64936] px-4 py-1 font-semibold text-[#f1faee] opacity-90 shadow-lg'>
                    {data.name}
                  </p>

                  <p className='w-fit cursor-pointer rounded-br-3xl bg-[#457b9d] px-4 py-2 font-semibold text-[#f1faee] opacity-90 shadow-lg'>
                    $
                    {`${data?.discountedPrice}` && data?.discountedPrice > 0
                      ? data?.discountedPrice
                      : `${data.regularPrice || 5}  / month`}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
