import { Api } from "sst/constructs";
import { Function } from "sst/constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

import { DynamoTable } from "./table";

export function API({ stack }) {
  const tables = DynamoTable(stack);
  const environment = process.env.NODE_ENV || "dev";

  const environmentVariables = {
    APP_ENV: environment, 
    NOTES_TABLE_NAME: tables.noteTable.tableName,
    APP_DOMAIN: StringParameter.valueForStringParameter(
      stack,
      `/space-notes/${environment}/app_domain`
    ).toString(), 
    SUPABASE_URL: "https://kjosizddxhvvsajpuoxl.supabase.co",
    SUPABASE_JWT_SECRET: StringParameter.valueForStringParameter(
      stack,
      `supabase_jwt_key`
    ).toString(),
    SUPABASE_KEY: StringParameter.valueForStringParameter(
      stack,
      `supabase_key`
    ).toString(),
    SUPABASE_SECRET_KEY: StringParameter.valueForStringParameter(
      stack,
      `supabase_secret_key`
    ).toString(),
  };

  const api = new Api(stack, "api", {
    cors: true,
    authorizers: {
      verifyToken: {
        type: "lambda",
        function: new Function(stack, "Authorizer", {
          handler: "src/auth/authorizers/auth-authorizer.handler",
          environment: environmentVariables
        }),
        resultsCacheTtl: "30 seconds",
        responseTypes: ["simple"],
        identitySource: ["$request.header.Authorization"],
      },
    },
    defaults: {
      function: {
        memorySize: "1024 MB",
        environment: environmentVariables
      },
    },
    routes: {
      // Notes routes.
      "GET    /notes": {
        function: "src/notes/handlers/get-notes.handler",
        authorizer: "verifyToken",
      },
      "POST   /notes": {
        function: "src/notes/handlers/create-note.handler",
        authorizer: "verifyToken",
      },
      "GET    /notes/{id}": {
        function: "src/notes/handlers/get-note.handler",
        authorizer: "verifyToken",
      },
      "PUT    /notes/{id}": {
        function: "src/notes/handlers/update-note.handler",
        authorizer: "verifyToken",
      },
      "DELETE /notes/{id}": {
        function: "src/notes/handlers/delete-note.handler",
        authorizer: "verifyToken",
      },
      "PATCH /notes/{id}/status": {
        function: "src/notes/handlers/change-note-status.handler",
        authorizer: "verifyToken",
      },

      // Authentication routes.
      "POST   /auth/register": {
        function: "src/auth/handlers/register.handler",
      },
      "POST   /auth/login": {
        function: "src/auth/handlers/login.handler",
      },
      "POST   /auth/forgot-password": {
        function: "src/auth/handlers/forgot-password.handler",
      },
      "POST   /auth/reset-password": {
        function: "src/auth/handlers/reset-password.handler",
      },
    },
  });

  api.attachPermissions(["dynamodb"]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
