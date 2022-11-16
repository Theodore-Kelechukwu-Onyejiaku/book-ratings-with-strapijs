import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { author_formats, author_modules } from '../utils/editor';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditBook({ book, error }) {
  const router = useRouter();
  const successNotification = () => toast.success('Book updated successfully!');
  const errorNotification = (error) => toast.error(error);

  const [info, setInfo] = useState(book?.attributes?.info);
  const [title, setTitle] = useState(book?.attributes?.title);
  const updateBook = async () => {
    const authToken = Cookies.get('authToken');
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/api/books/${book.id}`,
        { data: { info, title } },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      successNotification();
      router.push(`/${book.id}`);
    } catch (error) {
      errorNotification(error.response.data.error.message);
    }
  };
  return (
    <div>
      {error ? <div className="h-screen flex flex-col justify-center items-center text-red-500">{error}</div> : (
        <div className="mx-5">
          <h1 className="text-3xl font-bold">Edit this book</h1>

          <div className="my-5 flex flex-col">
            <label className="font-bold">Edit book title</label>
            <input className="border my-3" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          </div>

          <div className="my-5">
            <label className="font-bold">Edit Book Info</label>
            <ReactQuill className="w-full h-96 pb-10 my-3" onChange={setInfo} formats={author_formats} modules={author_modules} theme="snow" value={info} />
          </div>
          <button type="button" onClick={updateBook} className="shadow p-2 rounded bg-green-500 text-white font-bold">Update Book</button>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const bookId = query.book;
  try {
    const { data: book } = await axios(`${process.env.NEXT_PUBLIC_STRAPI_API}/api/books/${bookId}`);
    return {
      props: { book: book.data, error: null },
    };
  } catch (error) {
    if (error.message === 'connect ECONNREFUSED 127.0.0.1:1337') {
      return {
        props: { book: null, error: 'Connection Error' },
      };
    }
    return {
      props: { book: null, error: error.response.data.error.message },
    };
  }
}
