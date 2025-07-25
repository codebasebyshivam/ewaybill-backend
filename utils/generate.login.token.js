import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';


const generateToken = (data) => {
  try {
    const payload = {
      user: data.username,
      gst: data.gst,
      cmp_year: data.db_name,
      isAdmin: data.isAdmin,
    };

    return jwt.sign(payload, process.env.SECRET_KEY, {
      issuer: 'Kats Infotech PVT LTD',
      expiresIn: '24h',
    });
  } catch (err) {
    console.error('Token generation failed:', err);
   throw new Error(`Token generation failed: ${err?.message}`);
  }
};

export default generateToken;
