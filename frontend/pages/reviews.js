import { useContext, useEffect } from 'react';
import { ReviewForm } from 'strapi-ratings-client';
import axios from 'axios';
import AppContext from '../utils/AppContext';

export default function Reviews() {
  const { user } = useContext(AppContext);
  const getBooks = async () => {
    const res = await axios('http://localhost:1337/api/books/');
  };
  useEffect(() => {
    getBooks();
  }, []);
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-1/2">
        <h1 className="my-5 text-3xl font-bold">Enter Review</h1>
        My name is
        {' '}
        {user}
        <ReviewForm />
      </div>
    </div>

  );
}
