'use client'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SignUpPage = () => {

  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const debounced = useDebounceCallback(setUsername,500)

  //zod implementation  for form validation
  type UserFormData = z.infer<typeof signUpSchema>;

  const form = useForm<UserFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username:'',
      password: '',
      email: ''
    },
  });

  useEffect(()=>{
    const checkUsernameUnique = async()=> {
      if (username){
        setIsCheckingUsername(true);
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`)
          console.log("response", response)
          setUsernameMessage(response.data?.message)
        } catch (error){
          const AxiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(AxiosError?.response?.data?.message ?? "An unknown error occurred")
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async (data: UserFormData) => {
    console.log(data)
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      toast({
        title: 'Sign up successful!',
        description: `Welcome ${data.username}, you can now log in`,
      })
      // router.push("/login");
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)

    } catch (error) {
      console.error("Failed to sign up user", error)
      const AxiosError = error as AxiosError<ApiResponse>
      let errorMessage = AxiosError?.response?.data?.message
      toast({
        title:"Signup failed",
        description: errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Your username" 
                      onChange={(e)=>{
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="w-2 h-2 mr-2 animate-spin"/>}
                  <p className={`text-xs ${usernameMessage === "Username is available" ? "text-green-500":"text-red-500"}`}>
                    {usernameMessage == "Username must be at least 5 characters long" ? "Username not available": usernameMessage}
                  </p>
                  <FormMessage/>
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
                    <Input 
                      {...field} 
                      placeholder="Your email"
                    />
                  </FormControl>
                  <FormMessage/>
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
                    <Input 
                      {...field} 
                      placeholder="Your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <div className="flex justify-center">
                      Loading...
                      <Loader2 className="h-4 w-4 animate-spin"/>
                    </div>
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>  
        </div>
      </div>
    </div>
  )
}

export default SignUpPage;