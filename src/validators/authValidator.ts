import { body } from 'express-validator';

const login = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const authValidator = { login };
export default authValidator;
