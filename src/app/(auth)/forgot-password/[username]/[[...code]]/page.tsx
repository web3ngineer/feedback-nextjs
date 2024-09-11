"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changePasswordSchema } from "@/Schemas/changePasswordSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";

function VerifyPasswordCode() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  type Params = {
    username:string,
    code:string [],
  }

  const { username, code } = useParams<Params>();
  // console.log(code)
  // console.log(typeof(code[0]));

  type VerifyFormData = z.infer<typeof changePasswordSchema>;

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      code: code ? code[0] : "",
      password1: "",
      password2: "",
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    // console.log(data)
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/change-password", {
        username: username,
        code: data.code,
        password1: data.password1,
        password2: data.password2,
      });

      console.log(data)

      toast({
        title: "Success",
        description: `${response.data.message}`,
      });
      setIsSubmitting(false);
      router.replace(`/sign-in`);
    } catch (error) {
      console.error("Failed to verify user", error);
      const AxiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        AxiosError?.response?.data?.message ??
        "An error occured. Please try again.";
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[580px] md:min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Change Password
          </h1>
          <p className="mb-4">
            Enter your verification code sent on your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!code && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Password" type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Confirm Password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center"
            >
              {isSubmitting ? (
                <div className="flex gap-1">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  {"loading..."}
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyPasswordCode;
