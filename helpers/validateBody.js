import HttpError from "./HttpError.js";

const validateBody = (schema) => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                Status: "400 Bad Request",
                "Content-Type": "application/json",
                ResponseBody: error.message,
            });
        }
        next();
    };

    return func;
};

export default validateBody;
