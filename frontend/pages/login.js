import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import AppContext from '../utils/AppContext';

export default function Login() {
  const { setAuthUser, setIsLoggedIn } = useContext(AppContext);
  const router = useRouter();
  const [loginDetails, setLoginDetails] = useState({ identifier: '', password: '' });
  const [loginErrorMessages, setLoginErrorMessages] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const successNotification = () => toast.success('Signup is successful!');
  const errorNotification = (error) => toast.error(error);

  const handleRegFormInput = (e) => {
    setLoginError('');
    setLoginErrorMessages((prev) => ({ ...prev, [e.target.name]: '' }));
    setLoginDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegex)) {
      return true;
    }
    return false;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!(validateEmail(loginDetails.identifier))) {
      setLoginErrorMessages((prev) => ({ ...prev, identifier: 'Please enter correct email address' }));
      return;
    }
    if (loginDetails.password === '') {
      setLoginErrorMessages((prev) => ({ ...prev, password: 'Please enter password' }));
      return;
    }
    setLoginLoading(true);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/auth/local`, loginDetails);
      successNotification();
      setIsLoggedIn(true);
      setAuthUser(data.user);
      setLoginLoading(false);

      const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1hr
      Cookies.set('authToken', data.jwt, { expires: expirationTime });
      Cookies.set('user', data.user.username, { expires: expirationTime });
      router.push('/');
    } catch (error) {
      if (error.message === 'Network Error') {
        errorNotification(error.message);
        return;
      }
      setLoginError(error.response.data.error.message);
      errorNotification(error.response.data.error.message);
      setLoginLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="shadow-md md:shadow-none w-full border md:w-96">
        <div className="flex items-center justify-between mb-3">
          <p className=" text-lg font-bold text-white dark:text-white bg-black w-full p-5">Login to Book Ratings App</p>
        </div>
        <div className="p-5">
          <form onSubmit={handleLoginSubmit} method="POST">
            {loginError && <p className="text-red-400 text-lg text-center border border-red-400 my-2 p-1">{loginError}</p>}

            <div>
              <label htmlFor="identifier" className="text-gray-400">Email</label>
              <input onChange={handleRegFormInput} type="text" className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded" name="identifier" />
              {loginErrorMessages.identifier && <p className="text-red-400">{loginErrorMessages.identifier}</p>}
            </div>
            <div>
              <label htmlFor="password" className="text-gray-400">Password</label>
              <input onChange={handleRegFormInput} type="password" className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded" name="password" />
              {loginErrorMessages.password && <p className="text-red-400">{loginErrorMessages.password}</p>}
            </div>
            <button type="submit" className="bg-black text-white p-2 my-3 rounded shadow">{loginLoading ? 'Logging in user...' : 'Login'}</button>
          </form>
          <p className="">
            Have an account?
            <Link href="/signup"><span className="ml-3 p-1 border-2 border-dashed">Signup</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
