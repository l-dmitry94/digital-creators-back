import User from '../models/User.js';

const findUser = filter => User.findOne(filter);

const signup = data => User.create(data);

export default {
    findUser,
    signup,
};
