import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID, Query } from 'appwrite';

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

        const avatarUrl = avatars.getInitials();

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

export async function signInAccount(user:{email:string;password:string}){

    try{
        const session =await account.createEmailSession(user.email, user.password);

        return session

    }catch(e){
        console.log(e)
    }

}

export async function getCurrentUser(){
    try{
        const currentAccount=await account.get();

        if(!currentAccount) throw Error;

        const currentUser=await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId",currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    }catch(e){
        console.log(e)
    }
}