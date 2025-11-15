import { body } from 'express-validator';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const registerValidator = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(passwordRegex)
    .withMessage('Password must include letters and numbers'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

