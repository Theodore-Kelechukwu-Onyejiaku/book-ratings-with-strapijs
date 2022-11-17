import { useContext } from 'react';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.bubble.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import GetRatings from '../utils/getRatings';
import AppContext from '../utils/AppContext';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function SingleBook({ book, reviews }) {
  const router = useRouter();
  const { authUser } = useContext(AppContext);
  const successNotification = () => toast.success('Book deleted successfully!');
  const errorNotification = (error) => toast.error(error);
  const handleDelete = async () => {
    const shouldDelete = window.confirm('Are you sure you want to delete this book?');
    const authToken = Cookies.get('authToken');
    if (shouldDelete) {
      try {
        const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/books/${book.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        successNotification();
        router.push('/');
      } catch (error) {
        errorNotification(error.response.data.error.message);
      }
    }
  };
  return (
    <div className="mx-5">
      <div className="my-5" key={book.id}>
        <div className="flex items-center">
          <span className="font-bold text-2xl">
            {book?.attributes?.title}
            {' '}
            {' -'}
          </span>
          <GetRatings value={reviews.averageScore} />
          (
          {reviews.reviewsCount}
          {' '}
          reviews)
          {(book?.attributes?.creator === authUser?.username || authUser?.isAdmin)
            && (
              <>
                <Link href={`/edit-book?book=${book.id}`}><button type="button" className="ml-5 p-1 rounded bg-green-500 text-white w-14 shadow">Edit</button></Link>
                <button type="button" onClick={handleDelete}><button type="button" className="ml-5 p-1 rounded bg-red-500 text-white w-14 shadow">delete</button></button>
              </>
            )}
        </div>
        <div>
          <i>{new Date(book?.attributes?.createdAt).toString().slice(0, 11)}</i>
          {', '}
          <i>{new Date(book?.attributes?.createdAt).toLocaleTimeString().slice(0, 11)}</i>
        </div>
        <div className="flex md:flex-row  flex-col md:space-x-5 my-5 p-10">
          <div className="md:basis-1/2">
            <img src={book?.attributes?.imageUrl} alt="book cover" className="w-full h-80 object-center" />
          </div>
          <div className="basis-1/2">
            <span className="font-bold text-3xl">Book info</span>
            <ReactQuill
              value={book?.attributes?.info}
              readOnly
              theme="bubble"
            />
          </div>
        </div>

      </div>
      <div className="">
        <h2 className="text- text-xl font-bold">Reviews</h2>
        {reviews?.reviews?.length ? reviews.reviews.map((review) => (
          <div key={review.id} className="my-3 border p-5">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-blue-600">{review?.author?.username}</span>
              <GetRatings value={review.score} />
            </div>
            <p>
              {review?.comment ? (
                <ReactQuill
                  value={review.comment}
                  readOnly
                  theme="bubble"
                />
              ) : <span className="italic font-thing">No comment</span>}
            </p>
          </div>
        ))
          : <div>No reviews at the moment</div>}
      </div>
    </div>
  );
}
