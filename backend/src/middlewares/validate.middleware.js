const Joi = require("joi");

exports.validateEmployee = (req, res, next) => {
  const employeeSchema = Joi.object({
    name: Joi.string().min(3).max(25).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be less than 25 characters",
    }),
    department: Joi.string().required().max(25).messages({
      "string.empty": "Department is required",
      "string.max": "Department must be less than 25 characters",
    }),

    role: Joi.string().valid("Employee", "Admin").required().messages({
      "any.only": "Role must be either 'Employee' or 'Admin'",
      "string.empty": "Role is required",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
    password: Joi.string()
      .min(6)
      .max(16)
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).{6,}$"))
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must be at least 16 characters",
        "string.pattern":
          "Password must have one uppercase letter and a number",
      }),
  });

  const { error } = employeeSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ message: error.details[0].message }); // Return first error message
  }
  if (req.body.name) {
    req.body.name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
  }
  if (req.body.department) {
    req.body.department = req.body.department.charAt(0).toUpperCase() + req.body.department.slice(1);
  }

  next();
};
