import { useContext } from 'react';
import Link from 'next/link';
import 'react-quill/dist/quill.bubble.css';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import AppContext from '../utils/AppContext';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Books({ books }) {
  const { authUser } = useContext(AppContext);
  const errorNotification = (error) => toast.error(error);

  // like a book
  const handleLikeBook = async (book, id) => {
    const likeButton = document.getElementById(id.toString() + id);
    const numberOfLikes = document.getElementById(id.toString() + id.toString() + id);
    const authToken = Cookies.get('authToken');

    try {
      // send request to api/books/:id/like
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/api/books/${book.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      // add like button css effect
      if (likeButton.classList.contains('liked')) {
        likeButton.classList.remove('liked');
        numberOfLikes.innerText = parseInt(numberOfLikes.innerText, 10) - 1;
      } else {
        likeButton.classList.add('liked');
        numberOfLikes.innerText = parseInt(numberOfLikes.innerText, 10) + 1;
      }
    } catch (error) {
      errorNotification(error.response?.data.error?.message);
    }
  };
  return (
    <div>
      <div className="mx-5">
        {books?.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div className="border relative rounded shadow my-5 p-5" key={book.id}>
                <h1 className="font-bold  text-blue-500 my-3">
                  {book?.attributes?.title}
                </h1>
                <span className=" bg-green-500 text-white p-1 rounded">{book?.attributes?.creator}</span>
                <div className="my-5">
                  <Link href={`/${book.id}`}>
                    <img src={book?.attributes?.imageUrl} alt="book cover" className="w-full h-52" />
                  </Link>
                </div>
                <ReactQuill
                  value={`${book?.attributes?.info?.toString().substring(0, 100)}...`}
                  readOnly
                  theme="bubble"
                  className="mb-12"
                />
                <div className="flex items-center bottom-0 left-0 absolute w-full p-2 justify-between">
                  <div className="flex flex-col">
                    <Link href={`/${book.id}`}><span className="underline text-blue-600">See Reviews</span></Link>
                    <div>
                      <i>{new Date(book?.attributes?.createdAt).toString().slice(0, 11)}</i>
                      {', '}
                      <i>{new Date(book?.attributes?.createdAt).toLocaleTimeString().slice(0, 11)}</i>
                    </div>
                  </div>
                  <div className="relative">
                    <div><span id={book.id.toString() + book.id} onClick={() => { handleLikeBook(book, book.id); }} className={`${book?.attributes?.likes?.includes(authUser?.username) ? ' liked ' : ' '} border heart-icon outline-none border-none block`} /></div>
                    <div className="absolute right-5 top-8">
                      <span id={book.id.toString() + book.id + book.id} className="">{book?.attributes?.likes?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="h-screen flex flex-col items-center justify-center text-red-500">No books at the moment</div>}
      </div>
    </div>
  );
}
