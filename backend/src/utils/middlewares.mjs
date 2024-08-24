
import jwt from "jsonwebtoken";
import { User } from "../services/user.service.mjs";
export const generateProjection = (req, res, next) => {
  const { mask } = req.query;
  const projection = { '_id': 0 };

  if (mask) {
    const fieldsToInclude = mask.split('|');
    fieldsToInclude.forEach((field) => {
      projection[field] = 1;
    });
  }

  req.projection = projection;
  next();
}

export const generatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  const defaultPage = 1;
  const defaultLimit = 20; // You can change the default limit as needed


  const parsedPage = parseInt(page, 10) || defaultPage;
  const parsedLimit = parseInt(limit, 10) || defaultLimit;

  req.pagination = {
    page: parsedPage,
    limit: parsedLimit,
  };

  next();
};

export function errorHandler(err, req, res, next) {
  console.log("Middleware Error Hadnling");
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  console.log(errMsg)
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  })
}


export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = await verifyToken(token);

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const verifyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});