import createHttpError from 'http-errors';

import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page, perPage, tag, search } = req.query;
  const pageNumber = Number(page) || 1;
  const perPageNumber = Number(perPage) || 10;
  const skip = (pageNumber - 1) * perPageNumber;
  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter).skip(skip).limit(perPageNumber),
  ]);
  const totalPages = Math.ceil(totalNotes / perPageNumber);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);

  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
