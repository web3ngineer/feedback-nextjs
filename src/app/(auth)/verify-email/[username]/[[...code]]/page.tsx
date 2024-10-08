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
import { verifyCodeSchema } from "@/Schemas/verifySchema";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function VerifyAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const params = useParams<{ username: string; code: string[] }>();
  // console.log(params.code)

  type VerifyFormData = z.infer<typeof verifyCodeSchema>;

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: params.code ? params.code[0] : "",
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    // console.log(data)
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: `${response.data.message}`,
      });
      // router.push("/login");
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

  useEffect(() => {
    if (params.code) {
      const autoSubmit = async() => {
        setIsSubmitting(true);
        try {
          const response = await axios.post("/api/verify-code", {
            username: params.username,
            code: params.code[0],
          });
          toast({
            title: "Success",
            description: `${response.data.message}`,
          });
          // router.push("/login");
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
      autoSubmit();
    }
  },[params.username, params.code, router, toast]);

  return (
    <div className="flex justify-center items-center min-h-[720px] md:min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-4">
            Verify Your Email
          </h1>
          <p className="mb-4">
            Enter your verification code sent on your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Code" />
                  </FormControl>
                  <FormMessage className='text-xs'/>
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
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
