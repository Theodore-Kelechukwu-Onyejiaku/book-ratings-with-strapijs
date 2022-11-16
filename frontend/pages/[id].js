import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaRegStar, FaStar } from 'react-icons/fa';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import SingleBookAndReview from '../components/SingleBookAndReview';
import { reviewer_formats, reviewer_modules } from '../utils/editor';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BookReviews({ reviews, book, error }) {
  if (error) {
    return <div className="h-screen flex flex-col items-center justify-center text-red-500">{error}</div>;
  }
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [stars, setStars] = useState([{ id: 1, checked: false }, { id: 2, checked: false },
    { id: 3, checked: false }, { id: 4, checked: false }, { id: 5, checked: false }]);

  const successNotification = () => toast.success('Review added successfuly!');
  const errorNotification = (error) => toast.error(error);

  const handleCheck = (id) => {
    setRating(id);
    setStars((prev) => prev.map(
      (star) => {
        if (star.id <= id) {
          return { ...star, checked: true };
        }
        return { ...star, checked: false };
      },
    ));
  };

  const addReview = async () => {
    const authToken = Cookies.get('authToken');
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/api/ratings/reviews/${book.id}`,
        { comment, score: rating },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      router.push(router.asPath);
      successNotification();
      setComment('');
      setRating(0);
    } catch (error) {
      if (error.response.data.error.message.includes('Missing or invalid credentials')) {
        return errorNotification('Please login');
      }
      errorNotification(error.response.data.error.message);
    }
  };

  return (
    <div>
      <SingleBookAndReview book={book} reviews={reviews} />
      {/* Rating */}
      <div className=" my-10">
        <div className="mx-5">
          <span className="font-bold">Add a Review</span>
          <div className="flex flex-col my-5">
            <label htmlFor="comment">Comment</label>
            <ReactQuill id="editor" formats={reviewer_formats} modules={reviewer_modules} theme="snow" value={comment} onChange={setComment} className="w-full h-96 pb-10 my-3" />
          </div>

          <div className="my-3">
            <label>Rate</label>
            <div className="flex items-center my-3">
              {stars.map((star) => (star.checked
                ? <FaStar key={star.id} onClick={() => { handleCheck(star.id); }} className="cursor-pointer text-2xl" />
                : <FaRegStar key={star.id} onClick={() => { handleCheck(star.id); }} className="cursor-pointer text-2xl" />))}
            </div>
          </div>

          <button type="button" onClick={addReview} className="border p-2 rounded">Sumbit Review</button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const { id } = context.query;
    const { data: book } = await axios(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/books/${id}`);
    const { data: reviews } = await axios(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/ratings/reviews/${id}`);
    return {
      props: { reviews, book: book.data, error: null },
    };
  } catch (error) {
    if (error.message === 'connect ECONNREFUSED 127.0.0.1:1337') {
      return {
        props: { reviews: null, book: null, error: 'Connection error' },
      };
    }
    if (error.response.status === 404) {
      return {
        props: { reviews: null, book: null, error: 'Book not found' },
      };
    }
    return {
      props: { reviews: null, book: null, error: error.response.data.error.message },
    };
  }
}
