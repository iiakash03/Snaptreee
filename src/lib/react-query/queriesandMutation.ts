import { INewUser } from '@/types'
import {
    useQuery, 
    useMutation, 
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createAccount } from '../appwrite/api'

export const useCreateUserAccount=()=>{
    return useMutation({
        mutationfn:(user:INewUser)=>{createAccount(user)}
    })
}

export const useSignInAccount=()=>{
    return useMutation({
        mutationfn:(user:INewUser)=>{createAccount(user)}
    })
}