import * as z from "zod"

import {Button} from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signinValidation, signupValidation } from "@/lib/validation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesandMutation"

import { useUserContext } from "@/context/AuthContext"


const SigninForm = () => {

  const navigate=useNavigate()

  const {toast}=useToast();

  const {mutateAsync:signInAccount, isPending}=useSignInAccount();

  const {checkAuthUser, isLoading:isUserLoading}=useUserContext();


    async function onSubmit(values:z.infer<typeof signupValidation>) {

      const session=await signInAccount({
        email:values.email,
        password:values.password
      });

      if(!session){
        return toast({
          title: "Something went wrong",
        })
      }

      const isLoggedIn= await checkAuthUser();

      if(isLoggedIn){
        form.reset();
        navigate("/")
      }else{
        return toast({
          title: "Something went wrong",
        })
      }


      return session

    }
    
     const form =useForm<z.infer<typeof signupValidation>>({
        resolver:zodResolver(signinValidation),
        defaultValues: {
            email: "",
            password:""
        },
     })
  return (
    <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
                    <img src="/assests/images/logo.svg"/>
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
                    <p className="text-light-4 small-medium md:base-regular mt-2">To use Snapgram enter your details</p>

                
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="shad-button_primary" disabled={isUserLoading}>
                  {isUserLoading ? "Loading..." :"Submit"}
                </Button>

                <p className="text-center text-light-4">
                  Not a user
                  <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1"> Sign up</Link>
                </p>
            </form>
      </div>
    </Form>

  )
}

export default SigninForm
