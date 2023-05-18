import express, { Request, Response } from 'express';
import { isAuth } from '../utils';
import Image, { IImage } from '../models/imageModel';
import multer from 'multer';
import path from 'path';
import User from '../models/userModel';

const imageRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, 'uploads');
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

imageRouter.post(
    '/upload',
    isAuth,
    upload.single('image'),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
        const { filename } = req.file;
        const { token } = req.body;
        
        const user = await User.findOne({ token });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        const newImage: IImage = {
          name: req.body.name,
          desc: req.body.desc,
          img: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
          userId: user._id,
        };
        
        const createdImage = await Image.create(newImage);
  
        return res.json(createdImage);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    }
  );
  

imageRouter.get('/images/:userId', isAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    
    const images = await Image.find({ userId });

    return res.json({ images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default imageRouter;
