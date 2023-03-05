import { array, object, string } from "yup";
import { NOTE_ACTION_STATUS } from "../database/repository/note.repository";

export const createNoteSchema = object().shape({
  title: string().required(),
  content: string().required(),
  tags: array(),
});

export const updateNoteSchema = object().shape({
  title: string(),
  content: string(),
  tags: array(),
});


export const changeStatusSchema = object().shape({
  status: string().oneOf(Object.values(NOTE_ACTION_STATUS)).required()
});