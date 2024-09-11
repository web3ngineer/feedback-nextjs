'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifyEmailSchema } from '@/Schemas/verifySchema';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function ForgetPassword() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const {toast} = useToast()

  const params = useParams<{username:string}>()

  type VerifyFormData = z.infer<typeof verifyEmailSchema>;

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email:'',
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    // console.log(data)
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/forget-password', {
        email: data.email,
      })
      console.log(response.data)
      toast({
        title: 'Success',
        description: `${response.data.message}`,
      })
      router.push(`/forget-password/${response.data.user.username}`);
      setIsSubmitting(false)

    } catch (error) {
      console.error("Failed to verify user", error)
      const AxiosError = error as AxiosError<ApiResponse>
      let errorMessage = AxiosError?.response?.data?.message ?? "An error occured. Please try again."
      toast({
        title:"Failed to Send Otp",
        description: errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[580px] md:min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-4">
          Forget Password
        </h1>
        <p>Enter your email which is registered on</p>
        <p>Lukka Chhuppi</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registered Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="example@gmail.com"
                  />
                </FormControl>
                <FormMessage className='text-xs'/>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full flex justify-center">
            {
              isSubmitting ? (
                <div className="flex gap-1">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                  </div>
                  {'loading...'}
                </div>
              ) : ('Send Otp')
            }
          </Button>
        </form>
      </Form>
    </div>
  </div>
  )
}

export default ForgetPassword;