import nc from 'next-connect';
import multer from 'multer';
import DatauriParser from 'datauri/parser';
import axios from 'axios';
import path from 'path';
import cloudinary from '../../utils/cloudinary';

const handler = nc({
  onError: (err, req, res, next) => {
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
})
// uploading two files
  .use(multer().single('image'))
  .post(async (req, res) => {
    const parser = new DatauriParser();
    const { authToken } = req.cookies;
    const image = req.file;
    try {
      const base64Image = await parser.format(path.extname(image.originalname).toString(), image.buffer);
      const uploadedImgRes = await cloudinary.uploader.upload(base64Image.content, 'ratings', { resource_type: 'image' });
      const imageUrl = uploadedImgRes.url;
      const imageId = uploadedImgRes.public_id;

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/api/books`,
        {
          data: {
            info: req.body.info,
            title: req.body.title,
            imageUrl,
            imageId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

// disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
