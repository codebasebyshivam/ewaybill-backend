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
      company: data.company, // Include company in the payload
      financial_year:data.FY
    };

    return jwt.sign(payload, process.env.SECRET_KEY, {
      issuer: 'Kats Infotech PVT LTD',
      expiresIn: data.rememberMe ? '7d' : '24h', // Use 7 days if rememberMe is true, otherwise 1 hour
    });
  } catch (err) {
    console.error('Token generation failed:', err);
   throw new Error(`Token generation failed: ${err?.message}`);
  }
};

export default generateToken;
