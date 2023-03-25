import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

import { profileSchemaValidation } from '../utils/schemaValidation/auth';
import Button from '../components/Button';
import { auth, db, updateProfile } from '../config/firebase';

type ValidationSchemaT = zod.infer<typeof profileSchemaValidation>;

export default function ProfileScreen() {
  const [user, loading, error] = useAuthState(auth);
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
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
  }, [user]);

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

  return (
    <section className="py-20">
      {loading ? (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center  px-6 py-12">
          <p className="mt-8 w-full max-w-lg rounded  border bg-white p-6 text-center font-bold">
            Initializing User...
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center  px-6 py-12">
          <p className="mt-8 w-full max-w-lg rounded  border bg-white p-6 text-center font-bold">Error</p>
        </div>
      ) : null}
      {user ? (
        <>
          <h1 className="mt-6 text-center  text-2xl font-bold md:text-3xl">My Profile</h1>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12">
            <div className="w-full max-w-lg">
              <form className="flex w-full flex-col space-y-6" onSubmit={handleSubmit(updateProfileHandler)}>
                <div>
                  <input
                    disabled={!changeDetail}
                    className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300 ease-in-out focus:outline-none disabled:cursor-not-allowed
                 ${
                   changeDetail && errors.name
                     ? ' border border-red-500 bg-[#ffe6e6]'
                     : 'border-gray-400 bg-white hover:border-gray-500'
                 }
                 ${changeDetail && !errors.name ? 'border border-green-500 hover:border-green-500' : ''} `}
                    type="text"
                    id="name"
                    {...register('name')}
                    placeholder={`${errors.name ? '' : 'Name'}`}
                  />
                  {changeDetail && errors.name && (
                    <p className="mt-2 pl-1 text-xs text-red-500">{errors.name?.message}</p>
                  )}
                </div>
                <div>
                  <input
                    disabled
                    className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  ease-in-out focus:outline-none disabled:cursor-not-allowed
                 ${
                   errors.email
                     ? ' border border-red-500 bg-[#ffe6e6]'
                     : 'border-gray-400 bg-white hover:border-gray-500'
                 } `}
                    type="text"
                    id="email"
                    {...register('email')}
                    placeholder={`${errors.email ? '' : 'Email'}`}
                  />
                  {errors.email && <p className="mt-2 pl-1 text-xs text-red-500">{errors.email?.message}</p>}
                </div>

                <div
                  className="flex flex-row flex-wrap items-center justify-between space-y-2 whitespace-nowrap text-sm sm:space-y-0 sm:text-base"
                  style={{ marginTop: '1rem' }}
                >
                  <p className="flex items-center px-1">
                    Do you want to change your name?
                    <button
                      type="submit"
                      onClick={() => {
                        !errors.name && setChangeDetail((prevState) => !prevState);
                      }}
                      className="ml-1 cursor-pointer text-red-600 transition duration-200 ease-in-out hover:text-red-700"
                    >
                      {changeDetail ? 'Apply change' : 'Edit'}
                    </button>
                  </p>
                  <button
                    onClick={LogoutHandler}
                    className="cursor-pointer text-blue-600 transition duration-200 ease-in-out hover:text-blue-800"
                  >
                    Sign out
                  </button>
                </div>
                <Button isDisabled={!changeDetail}>Submit</Button>
              </form>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
