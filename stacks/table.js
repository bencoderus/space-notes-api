import { Table } from "sst/constructs";

export function DynamoTable(stack) {
  const noteTable = new Table(stack, "notes", {
    fields: {
      userId: "string",
      noteId: "string",
      status: "string"
    },
    primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
    globalIndexes: {
        noteStatus: { partitionKey: "status", sortKey: "noteId" },
      },
    
  });

  return {
    noteTable
  }
}
