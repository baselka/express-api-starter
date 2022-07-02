import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import { NotAuthorizedError } from '../errors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const privKey = fs.readFileSync(path.join(__dirname,'../jwt-pk/private.pem'));
const pubKey = fs.readFileSync(path.join(__dirname,'../jwt-pk/public.pem'));

export const signJWT = (
  user
) => {
  if (!user) {
    throw new Error('user is not defined');
  }
  
  try {
    const token = jwt.sign(
      user,
      privKey,
      { 
        algorithm: 'RS256',
        expiresIn: '10m' 
      }
    );
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

export const requireAuth = (
  req,
  res,
  next
) => {
  if (!req.headers.authorization) {
    throw new NotAuthorizedError();
  }
  
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(
      token,
      pubKey,
      { algorithms: ['RS256'] }
    );
    req.currentUser = {id: payload.id, email: payload.email};
    next();
  } catch (err) {
    throw new NotAuthorizedError();
  }
};
