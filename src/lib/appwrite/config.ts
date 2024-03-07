import {Client, Account, Databases, Storage, Avatars} from 'appwrite'

export const appwriteConfig = {
    project: import.meta.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    url: import.meta.env.NEXT_PUBLIC_APPWRITE_URL,
    databaseId: import.meta.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    postCollectionId: import.meta.env.NEXT_PUBLIC_APPWRITE_POST_COLLECTION_ID,
    savesCollectionId: import.meta.env.NEXT_PUBLIC_APPWRITE_SAVES_COLLECTION_ID
}


export const client=new Client();

client.setProject('65e56b85113ff5b2a535');
client.setEndpoint('https://cloud.appwrite.io/v1');
export const account=new Account(client);
export const databases=new Databases(client);
export const storage=new Storage(client);
export const avatars=new Avatars(client);