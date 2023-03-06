import dynamoose from "dynamoose";

export const createModel = (name, schema) => {
  if (process.env.IS_OFFLINE) {
    dynamoose.aws.ddb.local("http://localhost:4566");
  }

 return dynamoose.model(name, schema);
}