import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map((item) => item.message);
    return next(new ApiError(400, "Validation failed", details));
  }

  req.body = value;
  next();
};

