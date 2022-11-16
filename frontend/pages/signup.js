import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import AppContext from '../utils/AppContext';

export default function Signup() {
  const { setAuthUser, setIsLoggedIn } = useContext(AppContext);
  const router = useRouter();
  const [regDetails, setRegDetails] = useState({
    username: '', email: '', password: '', admin: false,
  });
  const [regErrorMessages, setRegErrorMessages] = useState({ email: '', password: '' });
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const successNotification = () => toast.success('Signup is successful!');
  const errorNotification = (error) => toast.error(error);

  const handleRegFormInput = (e) => {
    setRegError('');
    setRegErrorMessages((prev) => ({ ...prev, [e.target.name]: '' }));
    setRegDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegex)) {
      return true;
    }
    return false;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (regDetails.username === '' && regDetails.username.length < 5) {
      setRegErrorMessages((prev) => ({ ...prev, username: 'Please enter a username with 5 characters long' }));
      return;
    }

    if (!(validateEmail(regDetails.email))) {
      setRegErrorMessages((prev) => ({ ...prev, email: 'Please enter correct email address' }));
      return;
    }
    if (regDetails.password === '') {
      setRegErrorMessages((prev) => ({ ...prev, password: 'Please enter password' }));
      return;
    }
    setRegLoading(true);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/auth/local/register`, regDetails);
      successNotification();
      setIsLoggedIn(true);
      setAuthUser(data.user);
      setRegLoading(false);

      const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1hr
      Cookies.set('authToken', data.jwt, { expires: expirationTime });
      Cookies.set('user', data.user.username, { expires: expirationTime });
      router.push('/');
    } catch (error) {
      setRegError(error.response.data.error.message);
      setRegLoading(false);
      errorNotification(error.response.data.error.message);
    }
  };

  // REGISTER
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="shadow-md md:shadow-none w-full border md:w-96">
        <div className="flex items-center justify-between mb-3">
          <p className=" text-lg font-bold text-white dark:text-white bg-black w-full p-5">Signup to Book Ratings App</p>
        </div>
        <div className="p-5">
          <form onSubmit={handleSignupSubmit} method="POST">
            {regError && <p className="text-red-400 text-lg text-center border border-red-400 my-2 p-1">{regError}</p>}
            <div>
              <label htmlFor="username" className="text-gray-400">Username</label>
              <input onChange={handleRegFormInput} type="text" className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded" name="username" />
              {regErrorMessages.username && <p className="text-red-400">{regErrorMessages.username}</p>}
            </div>
            <div>
              <label htmlFor="identifier" className="text-gray-400">Email</label>
              <input onChange={handleRegFormInput} type="text" className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded" name="email" />
              {regErrorMessages.email && <p className="text-red-400">{regErrorMessages.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="text-gray-400">Password</label>
              <input onChange={handleRegFormInput} type="password" className="text-gray-400 w-full border border-gray-400 p-1 my-3 rounded" name="password" />
              {regErrorMessages.password && <p className="text-red-400">{regErrorMessages.password}</p>}
            </div>
            <button type="submit" className="bg-black text-white p-2 my-3 rounded shadow">{regLoading ? 'registering user...' : 'Signup'}</button>
          </form>
          <p className="text-black">
            Have an account?
            <Link href="/login"><span className="underline text-black cursor-pointer border border-dashed border-black p-1">Login</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
