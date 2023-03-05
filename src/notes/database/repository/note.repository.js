import { dynamoDb } from "../../../common/database/dynamodb.client";
import { ulid } from "ulid";

const TABLE_NAME = process.env.NOTES_TABLE_NAME || "";

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

/**
 * Build the update expression, attribute and values for DynamoDB.
 * 
 * @param {Record<string, any>} updateData 
 * @returns {{updateExpression: string, attributeNames: any, attributeValues: any}}
 */
const buildUpdateExpression = (updateData) => {
  let updateExpression = "";
  let attributeNames = {}
  let attributeValues = {}

  Object.keys(updateData).forEach((key, index) => {
    const value = updateData[key];
    
    updateExpression+= index === 0 ? `set #${key} = :${key}` : `, #${key} = :${key}`;
    attributeNames[`#${key}`] = key
    attributeValues[`:${key}`] = value
  });

  return {
    updateExpression,
    attributeNames,
    attributeValues
  }
};

const getNotes = async (userId, status) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "noteStatus",
    KeyConditionExpression: `#userId = :userId and #status = :status`,
    ExpressionAttributeNames: {
      "#userId": "userId",
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
      ":status": status,
    },
  };

  const { Items } = await dynamoDb.query(params).promise();

  return Items;
};

const getNote = async (userId, noteId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
      noteId,
    },
  };

  const record = await dynamoDb.get(params).promise();

  return record?.Item;
};

const createNote = async (userId, createData) => {
  createData["userId"] = userId;
  createData["noteId"] = ulid();
  createData["status"] = DEFAULT_STATUS;
  createData["createdAt"] = new Date().toISOString();

  const params = {
    TableName: TABLE_NAME,
    Item: createData,
  };

  await dynamoDb.put(params).promise();

  return createData;
};

const pinNote = async (noteId, userId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      noteId,
      userId,
    },
    UpdateExpression: "set status = :n",
    ExpressionAttributeValues: {
      ":n": "pinned",
    },
    ReturnValues: "UPDATED_NEW",
  };

  return dynamoDb.update(params).promise();
};

const archiveNote = async (noteId, userId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      noteId,
      userId,
    },
    UpdateExpression: "set status = :n",
    ExpressionAttributeValues: {
      ":n": "archived",
    },
    ReturnValues: "UPDATED_NEW",
  };

  return await dynamoDb.update(params).promise();
};

const deleteNote = async (userId, noteId) => {
  return markAsDeleted(userId, noteId);
};

const changeStatus = async (userId, noteId, status) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
      noteId,
    },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ReturnValues: "UPDATED_NEW",
  };

  return dynamoDb.update(params).promise();
};

const updateNote = async (userId, noteId, updateData) => {
  const {updateExpression, attributeNames, attributeValues} = buildUpdateExpression(updateData);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
      noteId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: attributeValues,
    ExpressionAttributeNames: attributeNames,
    ReturnValues: "UPDATED_NEW",
  };

  return dynamoDb.update(params).promise();
};

const markAsDeleted = async (userId, noteId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
      noteId,
    },
    UpdateExpression: "set #status = :status, #deletedAt = :deletedAt",
    ExpressionAttributeValues: {
      ":status": NOTE_STATUSES.DELETED,
      ":deletedAt": new Date().toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
      "#deletedAt": "deletedAt",
    },
    ReturnValues: "UPDATED_NEW",
  };

  return dynamoDb.update(params).promise();
};

export default {
  getNote,
  getNotes,
  createNote,
  deleteNote,
  pinNote,
  updateNote,
  archiveNote,
  changeStatus,
};
