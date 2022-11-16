import { useState, useContext, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { BiImageAdd } from 'react-icons/bi';
import dynamic from 'next/dynamic';
import { isImage, validateSize } from '../utils/fileValidation';

import AppContext from '../utils/AppContext';
import { author_formats, author_modules } from '../utils/editor';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const successNotification = (message) => toast.success(message);
const errorNotification = (error) => toast.error(error);

export default function CreateBook() {
  const { isLoggedIn } = useContext(AppContext);
  const [info, setInfo] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createBook = async () => {
    const authToken = Cookies.get('authToken');
    if (info === '') {
      errorNotification('Please enter book info');
      return;
    }
    if (!title) {
      errorNotification('Please enter book title');
      return;
    }
    if (!image) {
      errorNotification('Please select book image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('info', info);
      formData.append('title', title);
      formData.append('image', image);
      setIsLoading(true);
      const { data } = await axios.post(
        '/api/create-book',
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      setIsLoading(false);
      successNotification('Book added successfully!');
      router.push('/');
    } catch (error) {
      setIsLoading(false);
      errorNotification('Some error occured');
    }
  };
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const fileTypeResult = isImage(file.name);
    if (!fileTypeResult) {
      errorNotification('This is not an image');
      return;
    }
    const fileLarge = validateSize(file);
    if (fileLarge) {
      errorNotification('File size should 5MB or less');
      return;
    }
    setImageName(file.name);
    setImage(file);
  };

  return (
    <div>
      {isLoading ? <div className="h-screen flex flex-col justify-center items-center">Please wait while we upload data....</div>
        : (
          <div>
            <div className="mx-5">
              <h1 className="text-3xl font-bold">Create a book for review</h1>
            </div>
            <div className="mx-5">
              <div className="flex flex-col my-5">
                <label htmlFor="title" className="font-bold">Enter Book Title</label>
                <input name="title" value={title} onChange={(e) => { setTitle(e.target.value); }} type="text" className="my-3 border p-2" placeholder="Enter Book Title" />
              </div>
              <div className="my-5 border p-5 flex flex-col items-center justify-center">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <span>Select Book Cover</span>
                  <span className="text-red-300">(5MB Max)</span>
                  <BiImageAdd className="text-5xl" />
                  <input onChange={handleImageSelect} className="hidden" name="bookCover" type="file" />
                  <span>{imageName}</span>
                </label>
              </div>
              <div className="my-20 md:my-10">
                <label className="font-bold">Enter Book Info</label>
                <ReactQuill id="editor" formats={author_formats} modules={author_modules} theme="snow" value={info} onChange={setInfo} className="w-full h-96 pb-10 my-3" />
              </div>
              <button type="button" onClick={createBook} className="border border-black p-2 rounded font-bold">Create Book</button>
            </div>
          </div>
        )}
    </div>
  );
}
