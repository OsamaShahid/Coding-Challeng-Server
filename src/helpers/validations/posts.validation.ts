import Joi from 'joi';

const getPost = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const postsValidation = {
  getPost,
};

export default postsValidation;
