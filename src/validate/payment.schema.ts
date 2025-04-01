import { checkSchema } from "express-validator";

export const createCashinSchema = checkSchema({
    amount: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Amount is required",
        },
        isFloat: {
            options: { gt: 0 },
            errorMessage: "The value must be an integer"
        }

    }
})

enum PixType {
    CPF = 'CPF',
    CNPJ = 'CNPJ',
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    RANDOM = 'RANDOM'
}

export const createCashOutSchema = checkSchema({
    amount: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Amount is required",
        },
        isFloat: {
            options: { gt: 0 },
            errorMessage: "The value must be an integer"
        }

    },
    pix_type: {
        in: ["body"],
        notEmpty: {
            errorMessage: "pix_type is required",
        },
        isIn: {
            options: [Object.values(PixType)],
            errorMessage: `pix_type must be one of the following: ${Object.values(PixType).join(", ")}`,
        }
    },
    pix_key: {
        in: ["body"],
        notEmpty: {
            errorMessage: "pix_key is required",
        },
    }
})