import { API } from "./stacks/app";

export default {
  config(_input) {
    return {
      name: "space-note-api",
      stage: process.env.NODE_ENV || "dev",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} 