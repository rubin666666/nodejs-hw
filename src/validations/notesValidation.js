import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

import { TAGS } from '../constants/tags.js';

const noteId = Joi.string()
  .custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.message('noteId must be a valid MongoDB ObjectId');
    }

    return value;
  })
  .required();

const noteBody = {
  title: Joi.string().min(1),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS),
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow(''),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId,
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    ...noteBody,
    title: noteBody.title.required(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId,
  }),
  [Segments.BODY]: Joi.object(noteBody)
    .or('title', 'content', 'tag')
    .required(),
};
