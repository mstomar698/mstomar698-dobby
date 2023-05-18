import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../store';

interface Image {
  imageUrl: string;
  imageName: string;
}


const ImageGalleryScreen: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { id: userId } = params;
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await Axios.get(`/image/${userId}`);
        setImages(data.images);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, [userId]);
  useEffect(() => {
    if (!userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div>
      <h1>Image Gallery</h1>
      <div>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.imageUrl} alt={image.imageName} />
            <p>{image.imageName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryScreen;
