import { INewPost, INewUser, IUpdatePost } from '@/types'
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { createAccount, createPost, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserPosts, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { QUERY_KEYS } from '../react-query/queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
      mutationFn: (user: INewUser) => createAccount(user),
    });
  };
  
  export const useSignInAccount = () => {
    return useMutation({
      mutationFn: (user: { email: string; password: string }) =>
        signInAccount(user),
    });
  };

  export const useSignOutAccount = () => {
    return useMutation({
      mutationFn: signOutAccount
  });
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};


export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser=()=>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn:getCurrentUser
  })
}

export const useGetPostByID=(postId:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
    queryFn:()=>getPostById(postId),
    enabled: !!postId
  })
}

export const useUpdatePost=()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:(post:IUpdatePost)=>updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      })
    }
  })
}

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage?.documents[lastPage?.documents.length - 1]?.$id;
      return lastId ? parseInt(lastId, 10) : null;
    },
    initialPageParam: 0 // Add initialPageParam here
  })
};


export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  })
}

export const useDeletePost=()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:({postId,imageId}:{postId:string,imageId:string} )=>deletePost(postId,imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    }
  })
}

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserPosts=(userId:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USER_POSTS,userId],
    queryFn:()=>getUserPosts(userId), 
  })
}

