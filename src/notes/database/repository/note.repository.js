import { ulid } from "ulid";
import { Note } from "../models/note.model";

export const NOTE_STATUSES = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  PINNED: "pinned",
  DELETED: "deleted",
};

export const NOTE_ACTION_STATUS = {
  pin: NOTE_STATUSES.PINNED,
  archive: NOTE_STATUSES.ARCHIVED,
};

const DEFAULT_STATUS = NOTE_STATUSES.ACTIVE;

const getNotes = async (userId, status, lastKey) => {
  const lastKeyData = lastKey ? JSON.parse(atob(lastKey)) : null;

  const { count } = await Note.query({ userId, status }).count().exec();
  const query = Note.query({ userId, status }).limit(12).sort("descending");

  const notes = lastKeyData
    ? await query.startAt(lastKeyData).exec()
    : await query.exec();

  return {
    total: count,
    records: notes.toJSON(),
    lastKey: notes.lastKey ? btoa(JSON.stringify(notes.lastKey)) : null,
  };
};

const getNote = async (userId, noteId) => {
  const note = await Note.get({ userId, noteId });

  return note;
};

const createNote = async (userId, createData) => {
  createData["userId"] = userId;
  createData["noteId"] = ulid();
  createData["status"] = DEFAULT_STATUS;

  const note = await Note.create(createData);

  return note;
};

const deleteNote = async (userId, noteId) => {
  return markAsDeleted(userId, noteId);
};

const changeStatus = async (userId, noteId, status) => {
  return Note.update({ userId, noteId, status });
};

const updateNote = async (userId, noteId, updateData) => {
  return Note.update({ userId, noteId, ...updateData });
};

const markAsDeleted = async (userId, noteId) => {
  const status = NOTE_STATUSES.DELETED;
  const deletedAt = new Date().toISOString();

  return Note.update({ userId, noteId, status, deletedAt });
};

export default {
  getNote,
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  changeStatus,
};
