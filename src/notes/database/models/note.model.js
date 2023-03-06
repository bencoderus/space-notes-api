import dynamoose from "dynamoose";
import { createModel } from "../../../common/database/dynamodb.client";

const TABLE_NAME = process.env.NOTES_TABLE_NAME || "";

if (process.env.IS_OFFLINE) {
  dynamoose.aws.ddb.local("http://localhost:4566");
}

const schema = new dynamoose.Schema(
  {
    userId: {
      type: String,
      hashKey: true,
    },
    noteId: {
      type: String,
      rangeKey: true,
    },
    status: {
      type: String,
      index: {
        name: "noteStatus",
        type: "global",
      },
    },
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

export const Note = createModel(TABLE_NAME, schema)
