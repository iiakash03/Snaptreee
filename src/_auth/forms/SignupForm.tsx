import * as z from "zod"

import {Button} from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupValidation } from "@/lib/validation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { createAccount } from "@/lib/appwrite/api"


const SignupForm = () => {

  const isLoading = false

    async function onSubmit(values:z.infer<typeof signupValidation>) {
      const newUser=await createAccount(values)

      return newUser

    }
    
     const form =useForm<z.infer<typeof signupValidation>>({
        resolver:zodResolver(signupValidation),
        defaultValues: {
            username: "",
        }
     })
  return (
    <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
                    <img src="/assests/images/logo.svg"/>
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
                    <p className="text-light-4 small-medium md:base-regular mt-2">To use Snapgram enter your details</p>

                
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
                <Button type="submit" className="shad-button_primary" disabled={isLoading}>
                  {isLoading ? "Loading..." :"Submit"}
                </Button>

                <p className="text-center text-light-4">
                  Already have an account 
                  <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1"> Log in</Link>
                </p>
            </form>
      </div>
    </Form>

  )
}

export default SignupForm
