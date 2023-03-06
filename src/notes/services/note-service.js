import { HttpError } from "../../common/errors/http.error";
import noteRepository, {
  NOTE_STATUSES,
} from "../database/repository/note.repository";

export const getNotes = async (userId, status) => {
  const notes = await noteRepository.getNotes(userId, status);

  return notes;
};

export const getNote = async (userId, noteId) => {
  const note = await noteRepository.getNote(userId, noteId);

  if (!note) {
    throw new HttpError("Note was not found", 404);
  }

  return note;
};

export const createNote = async (userId, createData) => {
  return noteRepository.createNote(userId, createData);
};

export const deleteNote = async (userId, noteId) => {
  const note = await getNote(userId, noteId);

  if (note.status === NOTE_STATUSES.DELETED) {
    throw new HttpError("Note is already deleted.", 400);
  }

  return noteRepository.deleteNote(userId, noteId);
};

export const updateNote = async (userId, noteId, updateData) => {
  const isEmpty = (updateData) => Object.keys(updateData).length === 0;

  if (isEmpty(updateData)) {
    throw new HttpError("Please specify the field(s) you want update.", 400);
  }

  const note = await getNote(userId, noteId);
  const updated = {
    ...note,
    ...updateData,
  };

  await noteRepository.updateNote(userId, noteId, updateData);

  return updated;
};

export const changeStatus = async (userId, noteId, status) => {
  const note = await getNote(userId, noteId);

  if (note.status === NOTE_STATUSES.DELETED) {
    throw new HttpError(
      "You can not change the status of a deleted note.",
      400
    );
  }

  const updated = {
    ...note,
    status,
  };

  await noteRepository.changeStatus(userId, noteId, status);

  return updated;
};
