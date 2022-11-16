import '../styles/globals.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AppContext from '../utils/AppContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const STRAPI = 'http://127.0.0.1:1337';

  const userAuthentication = async () => {
    try {
      const authToken = Cookies.get('authToken');
      if (authToken) {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAuthUser(data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setAuthUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    userAuthentication();
  }, []);

  return (
    <AppContext.Provider value={{
      authUser, isLoggedIn, setAuthUser, setIsLoggedIn,
    }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;
