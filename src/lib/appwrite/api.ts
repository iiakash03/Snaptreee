import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
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
        console.log("Error creating account:", e);
        throw e; // Re-throw the error to propagate it to the caller
    }
}

export async function saveUserToDB(user:{
    accountId: string,
    name: string,
    username?: string,
    email: string,
    imageUrl: URL;
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
        console.log("Error saving user to database:", e);
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

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }

export async function getCurrentUser(){
    try{
        const currentAccount=await getAccount();
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

export async function signOutAccount(){
    try{
        const session=await account.deleteSession("current");
        return session
    }catch(e){
        console.log(e)
    }
}

export async function createPost(post:INewPost){
    try{
        const uploadedFile=await uploadFile(post.file[0]);
        if(!uploadedFile) throw Error;
        const fileUrl=await getFilePreview(uploadedFile.$id);

        if(!fileUrl){
            deleteFile(uploadedFile.$id)
            throw Error
        }

        const tags=post.tags?.replace(/,/g, ' ').split(',') || [];
        const newPost=await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator:post.userId,
                caption:post.caption,
                location:post.location,
                imageUrl:fileUrl.href,
                tags:tags,
                imageId:uploadedFile.$id
            }
        )

        if(!newPost){
            await deleteFile(uploadedFile.$id)
            throw Error;
        }
    }catch(e){
        console.log(e)
    }
}

export async function deleteFile(fileId:string){
    try{
        await storage.deleteFile(appwriteConfig.storageId, fileId)
    }catch(e){
        console.log(e)
    }
}

export async function uploadFile(file:File){
    const uploadedFile=await storage.createFile(
    appwriteConfig.storageId,
       ID.unique(),
       file
    )
    return uploadedFile
}

export async function getFilePreview(fileId:string){
    try{
        const fileUrl=storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            'top',
            100
        )
        return fileUrl
    }catch(e){
        console.log(e)
    }
}

export async function getRecentPosts(){
    const posts=await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"),Query.limit(20)]
    )

    if(!posts){
        throw Error
    }
    return posts
}

export async function likePost(postId:string, likesArray:string[]){
    try{
        const updatedPost=await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes:likesArray
            }
        )
        if(!updatedPost) throw Error
        return updatedPost
    }catch(e){
        console.log(e)
    }
    
}

export async function savePost(postId:string, userId:string){
    try{
        const updatedPost=await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user:userId,
                post:postId
            }
        )
        if(!updatedPost) throw Error
        return updatedPost
    }catch(e){
        console.log(e)
    }
    
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        console.log(savedRecordId);
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
      );
  
      if (!statusCode) throw Error;
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }

  export async function getPostById(postId:string){
    try{
        const post=await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return post
    }catch(e){
        console.log(e)
    }
  }

  export async function updatePost(post:IUpdatePost){
    const hasFileToUpdate=post.file.length>0
    try{
        
        let image={
            imageUrl:post.imageUrl,
            imageId:post.imageId
        }

        if(hasFileToUpdate){

            const uploadedFile=await uploadFile(post.file[0]);
            if(!uploadedFile) throw Error;
            const fileUrl=await getFilePreview(uploadedFile.$id);

            if(!fileUrl){
                deleteFile(uploadedFile.$id)
                throw Error
            }

            image={...image,imageUrl:fileUrl, imageId:uploadedFile.$id}
        }

        const tags=post.tags?.replace(/,/g, ' ').split(',') || [];
        const updatedPost=await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption:post.caption,
                location:post.location,
                imageUrl:image.imageUrl,
                tags:tags,
                imageId:image.imageId
            }
        )

        if(!updatedPost){
            await deleteFile(post.imageId)
            throw Error;
        }

        return updatedPost
    }catch(e){
        console.log(e)
    }
}

export async function deletePost(postId:string,imageId:string){

    if(!postId || !imageId) throw Error
    try{
        const deletePost=await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        if(!deletePost) throw Error
        const deleteImage=await storage.deleteFile(appwriteConfig.storageId, imageId)

        console.log(deleteImage)

        return {status:"Ok"}
    }catch(e){
        console.log(e)
    }

}

export async function getUserPosts(userId?: string) {
    if (!userId) return;
  
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: string[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  export async function searchPosts(searchTerm: string) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search("caption", searchTerm)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }



  export async function getUsers(limit?: number) {
    const queries: string[] = [Query.orderDesc("$createdAt")];
  
    if (limit) {
      queries.push(Query.limit(limit));
    }
  
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
      );
  
      if (!users) throw Error;
  
      return users;
    } catch (error) {
      console.log(error);
    }
  }