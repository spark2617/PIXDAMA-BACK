import { checkSchema } from 'express-validator';

export const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf[10])) return false;

    return true;
};

export const signUpSchema = checkSchema({
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isString: {
            errorMessage: 'Name must be a string',
        },
        trim: true,
        isLength: {
            options: { min: 2, max: 100 },
            errorMessage: 'Name must be between 2 and 100 characters long',
        },
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Must be a valid email address',
        },
        normalizeEmail: true,
        trim: true,
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long',
        },
        matches: {
            options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
            errorMessage:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        },
    },
    cpf: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'CPF is required',
        },
        custom: {
            options: (value) => {
                if (!validateCPF(value)) {
                    throw new Error('Invalid CPF');
                }
                return true;
            },
        },
        trim: true,
    },
    birthdate: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Birthdate is required',
        },
        isISO8601: {
            errorMessage: 'Birthdate must be a valid date in ISO 8601 format (YYYY-MM-DD)',
        },
    },
});

export const signInSchema = checkSchema({
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Must be a valid email address',
        },
        normalizeEmail: true,
        trim: true,
    },
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Password is required',
        },
    },
});