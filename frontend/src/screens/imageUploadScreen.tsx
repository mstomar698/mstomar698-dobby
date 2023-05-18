import React, { useContext, useReducer, useState, useEffect } from 'react';
import { Store } from '../store';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

interface State {
  loadingUpload: boolean;
}

type Action =
  | { type: 'UPLOAD_REQUEST' }
  | { type: 'UPLOAD_SUCCESS' }
  | { type: 'UPLOAD_FAIL' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false };
    default:
      return state;
  }
};

const ImageUploadScreen: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    loadingUpload: false,
  });
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);

      const response = await Axios.post(
        'http://localhost:5000/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `${userInfo!.token}`,
          },
        }
      );

      console.log(response.data);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div className="min-h-screen bg-gray-600 flex flex-col justify-center items-center sm:px-16 px-6 sm:py-16 py-10">
      <div className="border w-full h-full">
        <h1 className="text-3xl text-center py-3">Image Upload Screen</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className="border border-gray-300 px-2 py-1 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="desc" className="block mb-1">
              Description:
            </label>
            <input
              type="text"
              id="desc"
              value={desc}
              onChange={handleDescChange}
              className="border border-gray-300 px-2 py-1 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="image" className="block mb-1">
              Image:
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="border border-gray-300 px-2 py-1 rounded"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadScreen;
