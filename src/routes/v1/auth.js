import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validate-request';
import { loginUser, signUpUser } from '../../controllers/userController';
import { requireAuth } from '../../middlewares/require-auth';
import { Config } from '../../config';

const router = express.Router();
const {API_PREFIX, API_VERSION} = Config

const route = `${API_PREFIX}/${API_VERSION}/auth`

router.get(`${API_PREFIX}/${API_VERSION}`, (req, res) => {
  res.json({ message: `This is the ${Config.ENV} Gurulytics  ${route}`});
});

router.post(
    `${route}/signup`,
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ], 
  validateRequest, signUpUser);

router.post(
    `${route}/login`,
    [
      body('email')
        .isEmail()
        .withMessage('Email must be valid'),
      body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    ],
    validateRequest, loginUser);
    
// endpoint to get the current user and verify the token
router.get(`${route}/current-user`, requireAuth, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  });

export { router as AuthRouter };
