import {Client, Account, Databases, Storage, Avatars} from 'appwrite'

export const appwriteConfig = {
    project: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID
}


export const client=new Client();

client.setProject(appwriteConfig.project);
client.setEndpoint(appwriteConfig.url);
export const account=new Account(client);
export const databases=new Databases(client);
export const storage=new Storage(client);
export const avatars=new Avatars(client);

