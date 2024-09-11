"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Correct way to access query params in app directory
import { useRouter } from "next/navigation"; // For navigating programmatically
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ApiResponse {
  success: boolean;
  message: string;
}

function VerifyAccountPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const username = searchParams.get("username");
  const otp = searchParams.get("otp");

  const verifyCode = useCallback( async () => {
    try {
      if (!username || !otp){
        return ;
      } // Ensure username and otp are available

      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username,
        code: otp,
      });
      setIsSubmitting(false);
      setMessage(response.data.message);

      if (response.data.success) {
        toast({
          title: "Success",
          description: `${response.data.message}`,
        });
        router.push("/sign-in");
      } else {
        toast({
          title: "Error",
          description: `${response.data.message}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to verify user", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage =
          axiosError.response?.data?.message ?? "An error occurred. Please try again.";
        toast({
          title: "Verification failed",
          description: errorMessage,
          variant: "destructive",
        });
        setMessage(errorMessage);
      } else {
        toast({
          title: "Verification failed",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
        setMessage("An unexpected error occurred.");
      }
      setIsSubmitting(false);
    }
  },[otp,router, username, toast])

  useEffect(() => {
    if (username && otp) {
      verifyCode();
    } else {
      router.push("/");
    }
  }, [username, otp, router, verifyCode]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-[580px] md:min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-md">
        <h1 className="text-3xl text-black font-bold mb-4">
          Verify Account
        </h1>
        {isSubmitting ? (
          <div className="flex text-gray-400">
            Verifying OTP... <Loader2 className="animate-spin" />
          </div>
        ) : (
          <p className=" text-gray-400">{message}</p>
        )}
      </div>
      {message && (
        <Link
          href={"/sign-in"}
          className="bg-white px-2 font-semibold py-1 text-xs rounded-lg"
        >
          Go to Login Page →
        </Link>
      )}
    </div>
  );
}

export default VerifyAccountPage;
