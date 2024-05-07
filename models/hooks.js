export const handleServerError = (error, data, next) => {
    const { name, code, errors } = error;
    error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
    next();
};

export const setUpdateSettings = function (next) {
    (this.options.new = true), (this.options.runValidators = true);
    next();
};
