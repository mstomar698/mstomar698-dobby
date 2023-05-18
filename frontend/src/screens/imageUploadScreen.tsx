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

  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState('');

  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    loadingUpload: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageName(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', image as File);
      formData.append('imageName', imageName);
      dispatch({ type: 'UPLOAD_REQUEST' });
      console.log(loadingUpload);
      const { data } = await Axios.post(
        'http://localhost:5000/user/image',
        formData,
        {
          headers: { authorization: `${userInfo!.token}` },
        }
      );
      console.log(data);
      dispatch({
        type: 'UPLOAD_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Image Uploaded successfully');
      console.log(data)
    //   navigate(`/user/image/${userInfo!.email}`);
    } catch (err: any) {
      dispatch({
        type: 'UPLOAD_FAIL',
      });
      toast.error(getError(err));
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
        <form
          onSubmit={submitHandler}
          className="gap-6 flex flex-col flex-wrap justify-center items-center border"
        >
          <div className="flex flex-row items-center gap-4 max-sm:flex-col justify-center my-4 ">
            <label htmlFor="imageName" className="block font-medium mb-1">
              Image Name
            </label>
            <input
              type="text"
              id="imageName"
              value={imageName}
              onChange={handleNameChange}
              className="border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-row items-center gap-4 max-sm:flex-col justify-center my-4">
            <label htmlFor="image" className="block font-medium mb-1">
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="flex flex-row items-center gap-4 max-sm:flex-col justify-center my-4 border p-4 text-2xl rounded-lg shadow-md shadow-black"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadScreen;
