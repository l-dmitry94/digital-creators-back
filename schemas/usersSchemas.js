import Joi from "joi";

import { emailRegepxp } from "../constants/user-constants.js";

  export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegepxp).required(),
    value:Joi.string()
  });