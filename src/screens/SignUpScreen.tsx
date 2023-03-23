import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { z as zod } from 'zod';

import Button from '../components/Button';
import { signUpSchemaValidation } from '../utils/schemaValidation/auth';

type ValidationSchemaT = zod.infer<typeof signUpSchemaValidation>;

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchemaT>({
    resolver: zodResolver(signUpSchemaValidation),
  });

  const onSubmit: SubmitHandler<ValidationSchemaT> = (data) => {
    console.log(JSON.stringify(data, null, 2));
  };

  const signInWithGoogleHandler = () => {
    console.log('google login');
  };

  return (
    <section className="py-20">
      <h1 className="mt-6 text-center text-3xl font-bold">Sign Up</h1>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center px-6 py-12">
        <div className="mb-12 md:mb-6 md:w-[67%] lg:w-[50%]">
          <img src="/key.jpg" alt="key" className="w-full rounded-2xl" />
        </div>
        <div className="w-full md:w-[67%] lg:ml-20 lg:w-[40%]">
          <form className="flex w-full flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                className={`focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300  focus:outline-none ${
                  errors.name ? ' border border-red-500 bg-[#ffe6e6]' : 'border-gray-400 bg-white hover:border-gray-500'
                } `}
                type="text"
                id="name"
                {...register('name')}
                placeholder={`${errors.name ? '' : 'Name'}`}
              />
              {errors.name && <p className="mt-2 pl-1 text-xs text-red-500">{errors.name?.message}</p>}
            </div>
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
              {errors.email && <p className="mt-2 pl-1 text-xs text-red-500">{errors.email?.message}</p>}
            </div>
            <div>
              <div>
                <input
                  className={` focus:shadow-outline w-full appearance-none rounded border  p-3 leading-tight shadow transition duration-300 focus:outline-none ${
                    errors?.password
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  id="password"
                  type={`${showPassword ? 'text' : 'password'}`}
                  {...register('password')}
                  placeholder={`${errors.password ? '' : 'Password'}`}
                />
                <span
                  className="absolute"
                  style={{ marginLeft: '-2rem', marginTop: '1rem', zIndex: 2 }}
                  role="button"
                  onClick={() => setShowPassword(() => !showPassword)}
                  tabIndex={0}
                >
                  {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                </span>
              </div>
              {errors?.password && <p className="mt-2 pl-1 text-xs text-red-500">{errors.password?.message}</p>}
            </div>
            <div>
              <div>
                <input
                  className={`focus:shadow-outline  w-full appearance-none rounded border p-3 leading-tight  shadow  transition duration-300 focus:outline-none ${
                    errors.confirmPassword
                      ? ' border border-red-500 bg-[#ffe6e6]'
                      : 'border-gray-400 bg-white hover:border-gray-500'
                  } `}
                  id="c_password"
                  type={`${showConfirmPassword ? 'text' : 'password'}`}
                  {...register('confirmPassword')}
                  placeholder={`${errors.confirmPassword ? '' : 'Confirm Password'}`}
                />
                <span
                  className="absolute"
                  style={{ marginLeft: '-2rem', marginTop: '1rem', zIndex: 2 }}
                  role="button"
                  onClick={() => setConfirmPassword((prev) => !prev)}
                  tabIndex={0}
                >
                  {showConfirmPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                </span>
              </div>
              {errors?.confirmPassword ? (
                <p className="mt-2 pl-1 text-xs text-red-500">{errors?.confirmPassword?.message}</p>
              ) : null}
            </div>

            <div
              className="flex flex-row flex-wrap items-center justify-between space-y-2 whitespace-nowrap text-sm sm:space-y-0 sm:text-base"
              style={{ marginTop: '1rem' }}
            >
              <p>
                Have a account?
                <Link
                  to="/sign-in"
                  className="ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-700"
                >
                  Sign in
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-700 transition duration-200 ease-in-out hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <input type="checkbox" id="terms" {...register('terms')} className="cursor-pointer" />
              <label htmlFor="terms" className={`ml-2 text-sm sm:text-base `}>
                Accept Terms & Conditions
              </label>
              {errors?.terms ? <p className="mt-1 text-xs italic text-red-500">{errors.terms?.message ?? ''}</p> : null}
            </div>
            <Button>Sign Up</Button>
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
