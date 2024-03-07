import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID } from 'appwrite';

export async function createAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );

        if (!newAccount) {
            throw new Error("Failed to create account");
        }

        const avatarUrl = avatars.getInitials(user.name);

        await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            username: user.username,
            email: newAccount.email,
            imageUrl: avatarUrl
        });

        return newAccount;
    } catch (e) {
        console.error("Error creating account:", e);
        throw e; // Re-throw the error to propagate it to the caller
    }
}

export async function saveUserToDB(user:{
    accountId: string,
    name: string,
    username: string,
    email: string,
    imageUrl: URL
}){
    try {
       const newUser=await databases.createDocument(
           appwriteConfig.databaseId,
           appwriteConfig.userCollectionId,
           ID.unique(),
           user,
       )
       
       return newUser
    } catch (e) {
        console.error("Error saving user to database:", e);
        throw e; // Re-throw the error to propagate it to the caller
    }
}
