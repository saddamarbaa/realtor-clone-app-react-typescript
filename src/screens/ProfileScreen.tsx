import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FcHome } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from 'components/Button';
import ListingItem from 'components/ListingItem';
import { auth, db, updateProfile } from 'config/firebase';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ListingT } from 'types/listing';
import { profileSchemaValidation } from 'utils/index';
import { AnimationSettings } from 'utils/schemaValidation/animation';
import { z as zod } from 'zod';

type ValidationSchemaT = zod.infer<typeof profileSchemaValidation>;

const listingsVariants = {
  initial: { scale: 0.96, y: 30, opacity: 0 },
  enter: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.48, 0.15, 0.25, 0.96] },
  },
  exit: {
    scale: 0.6,
    y: 100,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.48, 0.15, 0.25, 0.96] },
  },
};

export default function ProfileScreen() {
  const [user, loading, error] = useAuthState(auth);
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState<ListingT[]>([]);

  const navigate = useNavigate();

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ValidationSchemaT>({
    resolver: zodResolver(profileSchemaValidation),
  });

  // console.log(user?.displayName, loading, error);

  useEffect(() => {
    if (user && user.email) {
      reset({
        name: user?.displayName || '',
        email: user.email,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, 'listings');
      const q = query(listingRef, where('userRef', '==', user?.uid), orderBy('timestamp', 'desc'));
      const querySnap = await getDocs(q);
      const listingsData = querySnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setListings(listingsData as ListingT[]);
    };
    if (user?.uid) {
      fetchUserListings();
    }
  }, [user?.uid]);

  const updateProfileHandler: SubmitHandler<ValidationSchemaT> = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    try {
      if (user && user.displayName !== data.name) {
        updateProfile(user, {
          displayName: data.name,
        });

        // update name in the firestore
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          name: data.name,
        });

        toast.success('Profile details updated');
      }
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      const errorCode = firebaseError?.code;
      const errorMessage = firebaseError?.message;
      toast.error(errorMessage || 'Something went wrong with the registration');
    }
  };

  const LogoutHandler = () => {
    auth.signOut();
    navigate('/');
  };

  const onDeleteHandler = async (id: string) => {
    const shouldDelete = window.confirm('Are you sure to delete?');
    if (!shouldDelete) return;

    try {
      await deleteDoc(doc(db, 'listings', id));
      setListings(listings.filter((list) => list.id !== id));
      toast.success('Successfully removed listing');
    } catch (error) {
      console.error('Failed to remove listing', error);
      toast.error('Failed to remove listing');
    }
  };
  const onEditHandler = (id: string) => {
    navigate(`/edit-listing/${id}`);
  };

  return (
    <motion.section className='py-20 pt-8' {...AnimationSettings}>
      {loading ? (
        <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-center  px-6 py-12'>
          <p className='mt-8 w-full max-w-lg rounded  border bg-white p-6 text-center font-bold'>
            Initializing User...
          </p>
        </div>
      ) : null}

      {error ? (
        <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-center  px-6 py-12'>
          <p className='mt-8 w-full max-w-lg rounded  border bg-white p-6 text-center font-bold'>Error</p>
        </div>
      ) : null}
      {user ? (
        <>
          <h1 className='mt-6 text-center  text-2xl font-bold md:text-3xl'>My Profile</h1>
          <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12'>
            <div className='flex w-full max-w-lg flex-col space-y-4'>
              <form className='flex w-full flex-col space-y-6' onSubmit={handleSubmit(updateProfileHandler)}>
                <div>
                  <input
                    disabled={!changeDetail}
                    className={`w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300 ease-in-out focus:outline-none disabled:cursor-not-allowed
                 ${
                   changeDetail && errors.name
                     ? ' border border-red-500 bg-[#ffe6e6]'
                     : 'border-gray-400 bg-white hover:border-gray-500'
                 }
                 ${changeDetail && !errors.name ? 'border border-green-500 hover:border-green-500' : ''} `}
                    type='text'
                    id='name'
                    {...register('name')}
                    placeholder={`${errors.name ? '' : 'Name'}`}
                  />
                  {changeDetail && errors.name && (
                    <p className='mt-2 pl-1 text-xs text-red-500'>{errors.name?.message}</p>
                  )}
                </div>
                <div>
                  <input
                    disabled
                    className={`w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  ease-in-out focus:outline-none disabled:cursor-not-allowed
                 ${
                   errors.email
                     ? ' border border-red-500 bg-[#ffe6e6]'
                     : 'border-gray-400 bg-white hover:border-gray-500'
                 } `}
                    type='text'
                    id='email'
                    {...register('email')}
                    placeholder={`${errors.email ? '' : 'Email'}`}
                  />
                  {errors.email && <p className='mt-2 pl-1 text-xs text-red-500'>{errors.email?.message}</p>}
                </div>

                <div
                  className='flex flex-row flex-wrap items-center justify-between space-y-2 whitespace-nowrap text-sm sm:space-y-0 sm:text-base'
                  style={{ marginTop: '1rem' }}
                >
                  <p className='flex items-center px-1'>
                    Do you want to change your name?
                    <button
                      type='submit'
                      onClick={() => {
                        !errors.name && setChangeDetail((prevState) => !prevState);
                      }}
                      className='ml-1 cursor-pointer text-red-600 transition duration-200 ease-in-out hover:text-red-700'
                    >
                      {changeDetail ? 'Apply change' : 'Edit'}
                    </button>
                  </p>
                  <button
                    onClick={LogoutHandler}
                    className='cursor-pointer text-blue-600 transition duration-200 ease-in-out hover:text-blue-800'
                  >
                    Sign out
                  </button>
                </div>
              </form>
              <Link to='/create-listing'>
                <Button Icon={FcHome}>Sell or rent your home</Button>
              </Link>
            </div>
          </div>
          {listings.length ? (
            <>
              <h2 className='text-center text-2xl font-semibold'>My Listing</h2>
              <ul className='mx-auto my-6 grid max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {listings?.map((list) => (
                  <motion.div variants={listingsVariants} key={list.id}>
                    <ListingItem
                      id={list.id}
                      data={list}
                      key={list.id}
                      onDelete={onDeleteHandler}
                      onEdit={onEditHandler}
                    />
                  </motion.div>
                ))}
              </ul>
            </>
          ) : null}
        </>
      ) : null}
    </motion.section>
  );
}
