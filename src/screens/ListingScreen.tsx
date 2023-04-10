import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaBath, FaBed, FaChair, FaMapMarker, FaParking, FaShare } from 'react-icons/fa';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Button from 'components/Button';
import Contact from 'components/Contact';
import Spinner from 'components/Spinner';
import { auth, db } from 'config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ListingT } from 'types/listing';

// import Swiper and modules styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import styles bundle
import 'swiper/css/bundle';

import 'leaflet/dist/leaflet.css';

export default function ListingScreen() {
  // Install Swiper components
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const navigate = useNavigate();
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState<ListingT | null>(null);
  const [isContact, setIsContact] = useState(false);
  const params = useParams();
  const { listingID } = useParams<{ listingID: string }>();
  const [user, error] = useAuthState(auth);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, 'listings', listingID as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { ...docSnap.data() };
        setListing(data as ListingT);
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist');
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <section className='flex w-full flex-col space-y-5'>
      <div className='w-full'>
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
          {listing?.imgUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className='relative h-[300px]  w-full overflow-hidden lg:h-[320px]'
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div>
        <div
          className='fixed right-[3%] top-[13%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-gray-400 bg-white'
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
        >
          <FaShare className='text-lg text-slate-500' />
        </div>
        {shareLinkCopied && (
          <p className='fixed right-[5%] top-[23%] z-10 rounded-md border-2 border-gray-400 bg-white p-2 font-semibold'>
            Link Copied
          </p>
        )}
      </div>

      <motion.div
        className='mx-auto flex w-full max-w-6xl cursor-pointer flex-col space-y-6 rounded-lg border  bg-white p-4 py-8 shadow-lg md:flex-row lg:space-x-5 lg:space-y-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className='flex w-full flex-col space-y-5 md:max-w-lg'
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className='text-xl font-bold text-blue-900 lg:text-2xl'>
            {`${listing?.name}  -   $`} {listing?.offer ? listing.discountedPrice : listing?.regularPrice}
            {listing?.type === 'rent' ? '' : ' / month'}
          </p>
          <p className='flex items-center  font-bold'>
            <FaMapMarker className='mr-3 text-green-700' />
            {listing?.address}
          </p>

          <div className='flex items-center  space-x-5'>
            <Button color='red' buttonClassName='text-white font-bold'>
              {' '}
              {listing?.type === 'rent' ? 'Rent' : 'Sale'}
            </Button>
            <Button color='green' buttonClassName='text-white font-bold'>
              {listing?.offer ? `${listing.regularPrice - listing.discountedPrice} discount` : 'No discount'}
            </Button>
          </div>
          <p>
            <span className=' font-semibold'> Description </span>
            <span className='ml-2'> {listing?.description}</span>
          </p>

          <div className='flex w-full items-center justify-between space-x-2'>
            {listing?.bedRoom && (
              <div className='flex items-center space-x-2'>
                <FaBed className='text-lg' />
                <p className='font-bold'>
                  {listing?.bedRoom > 1 ? `${listing?.bedRoom} Bed Rooms` : `${listing?.bedRoom} Bed Room`}
                </p>
              </div>
            )}

            {listing?.bathRoom && (
              <div className='flex items-center space-x-1'>
                <FaBath className='text-lg' />
                <p className='font-bold'>
                  {listing.bathRoom > 1 ? `${listing.bathRoom} Bath Rooms` : `${listing.bathRoom} Bath Room`}
                </p>
              </div>
            )}

            <div className='flex items-center space-x-1'>
              <FaParking className='text-lg' />
              <p className='font-bold'>{listing?.parking ? 'Parking' : 'Not Parking'}</p>
            </div>

            <div className='hidden items-center space-x-1 md:flex'>
              <FaChair className='text-lg' />
              <p className='font-bold'>{listing?.furnished ? 'furnished' : 'Not furnished'}</p>
            </div>
          </div>

          {!isContact && listing && listing.userRef !== user?.uid ? (
            <div className='mt-8 w-full font-bold'>
              <Button
                buttonClassName='text-white uppercase font-bold'
                onClick={() => {
                  setIsContact(true);
                }}
              >
                Contact Landlord
              </Button>
            </div>
          ) : null}
          {isContact ? <Contact listing={listing} /> : null}
        </motion.div>

        <motion.div
          className='z-30   w-full overflow-hidden'
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <MapContainer
            center={[-8.3405, 115.092]}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', minHeight: '350px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={[-8.3405, 115.092]}>
              <Popup>
                <p>{listing?.address}</p>
              </Popup>
            </Marker>
          </MapContainer>
        </motion.div>
      </motion.div>
    </section>
  );
}
