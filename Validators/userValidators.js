"use strict";
const Joi = require("joi");

const validateOpt = {
	abortEarly: false,
	stripUnknown: true, 
	errors: {
		escapeHtml: true,
	}
};
const registerOwnerSchema = Joi.object({
    username:Joi.string()
        .min(3)
        .max(15)
        .token()
        .lowercase()
        .required(),

    password:Joi.string()
        .min(6)
        .required(),

    passwordConfirm:Joi.any()
        .valid(Joi.ref('password'))
        .required(),

    email:Joi.string()
        .email({ tlds: { allow: false } }),

    firstName:Joi.string()
        .required(),
        
    lastName:Joi.string()
        .required(),

    companyName:Joi.string()
        .required(),

    companyAddr:Joi.string()
        .required(),
});

const registerEmployeeSchema = Joi.object({
    username:Joi.string()
        .min(3)
        .max(15)
        .token()
        .lowercase()
        .required(),

    password:Joi.string()
        .min(6)
        .required(),

    passwordConfirm:Joi.any()
        .valid(Joi.ref('password'))
        .required(),

    email:Joi.string()
        .email({ tlds: { allow: false } }),

    firstName:Joi.string()
        .required(),
        
    lastName:Joi.string()
        .required(),
    
    location:Joi.string()
        .required(),
});

const loginSchema = Joi.object({
    username:Joi.string()
        .min(3)
        .max(15)
        .token()
        .lowercase()
        .required(),

    password:Joi.string()
        .min(6)
        .required()
});

function loginValidator(req, res, next) {
    const {value, error} = loginSchema.validate(req.body, validateOpt);
    
    if(error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({"errors":errorMessages});//Bad Request
    }

    req.body = value;
    next();
}

function registerOwnerValidator(req, res, next) {
    const {value, error} = registerOwnerSchema.validate(req.body, validateOpt);
    console.log(req.body);
    
    if(error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({"errors":errorMessages});//Bad Request
    }

    req.body = value;
    next();
}

function registerEmployeeValidator(req, res, next) {
    const {value, error} = registerEmployeeSchema.validate(req.body, validateOpt);
    console.log(req.body);
    
    if(error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({"errors":errorMessages});//Bad Request
    }

    req.body = value;
    next();
}

module.exports = {
    registerOwnerValidator,
    registerEmployeeValidator,
    loginValidator
}