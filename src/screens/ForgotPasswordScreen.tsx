import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { z as zod } from 'zod';

import Button from '../components/Button';
import { forgotPasswordSchemaValidation } from '../utils/schemaValidation/auth';

type ValidationSchemaT = zod.infer<typeof forgotPasswordSchemaValidation>;

export default function ForgotPasswordScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchemaT>({
    resolver: zodResolver(forgotPasswordSchemaValidation),
  });

  const onSubmit: SubmitHandler<ValidationSchemaT> = (data) => {
    console.log(JSON.stringify(data, null, 2));
  };

  const signInWithGoogleHandler = () => {
    console.log('google login');
  };

  return (
    <section className="py-20">
      <h1 className="mt-6 text-center text-3xl font-bold">Forgot Password</h1>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12">
        <div className="mb-12 md:mb-6 md:w-[67%] lg:w-[50%]">
          <img src="/key.jpg" alt="key" className="w-full rounded-2xl" />
        </div>
        <div className="w-full md:w-[67%] lg:ml-20 lg:w-[40%]">
          <form className="flex w-full flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                  errors.email
                    ? ' border border-red-500 bg-[#ffe6e6]'
                    : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                type="text"
                id="email"
                {...register('email')}
                placeholder={`${errors.email ? '' : 'Email'}`}
              />
              {errors?.email ? <p className="mt-2 pl-1 text-xs text-red-500">{errors?.email?.message || ''}</p> : null}
            </div>
            <div
              className="flex flex-row flex-wrap items-center justify-between space-y-2 whitespace-nowrap text-sm sm:space-y-0 sm:text-base"
              style={{ marginTop: '1rem' }}
            >
              <p>
                Don't have a account?
                <Link
                  to="/sign-up"
                  className="ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-700"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link to="/sign-in" className="text-blue-700 transition duration-200 ease-in-out hover:text-blue-800">
                  Sign in instead?
                </Link>
              </p>
            </div>
            <Button> Rest Password</Button>
          </form>
          <div className="mt-5 flex w-full flex-col space-y-4">
            <div>
              <p className="flex items-center text-center font-semibold before:mr-4  before:flex-1 before:border-t before:border-gray-400 after:ml-4  after:flex-1 after:border-t after:border-gray-400">
                OR
              </p>
            </div>
            <Button color="red" Icon={FcGoogle} onClick={signInWithGoogleHandler}>
              Sign with Google
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
