import { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookies from 'js-cookie';
import AppContext from '../utils/AppContext';

export default function Header() {
  const {
    authUser, setAuthUser, isLoggedIn, setIsLoggedIn,
  } = useContext(AppContext);
  const router = useRouter();

  const logout = () => {
    Cookies.remove('authToken');
    setIsLoggedIn(false);
    setAuthUser(null);
    router.push('/login');
  };

  return (
    <div className="border">
      <div className="flex fixed z-50 bg-white w-full border items-center justify-between py-5 px-5">
        <div>
          <Link href="/">
            <span className="text-3xl">
              Book Ratings
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-5">
          {/* <Link href="/reviews"><span className="text-red-500 underline ml-5">Go to Reviews</span></Link> */}
          {isLoggedIn ? (
            <>
              <span onClick={logout} className="p-2 cursor-pointer border border-red-600">Logout</span>
              <Link href="/create"><span className="text-red-500 underline">Create Book</span></Link>
              <span className="p-2 w-10 h-10 block border rounded-full uppercase text-center">{authUser?.username?.split('')[0]}</span>
            </>
          )
            : (
              <>
                <Link href="/login"><span className="text-red-500 underline">Login</span></Link>
                <Link href="/login"><span className="text-red-500 underline">Create Book</span></Link>

              </>
            )}
        </div>
      </div>
    </div>
  );
}
