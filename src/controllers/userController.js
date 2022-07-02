import { User } from '../models/user';
import { BadRequestError } from '../errors';
import {signJWT} from '../middlewares/require-auth';
import { Password } from '../utils/password';

export const signUpUser = async (req, res) => {
    const { email, password, role } = req.body;
  
    const existingUser = await User.findOne({ email });
    
 

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password, role});
    await user.save();

    const response = {
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        },
        accessToken: '',
    }

    // Generate JWT and add it to the response object
    const accessToken = signJWT(response.user);
    response.accessToken = accessToken;
    res.status(201).send(response);
  
  }

  export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    
    const response = {
        user: {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role
        },
        accessToken: '',
    }
    // Generate JWT
    const accessToken = signJWT(response.user);
    response.accessToken = accessToken;
    res.status(200).send(response);
  }