import { Databases, Models } from "node-appwrite";

export type TUserTotalSpaceUsed = {
  databases: Databases;
  currentUser: Models.Document;
};
