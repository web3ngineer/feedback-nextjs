"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // Correct way to access query params in app directory
import { useRouter } from "next/navigation"; // For navigating programmatically
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function VerifyAccountPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams(); // Replaces useQuery
  const { toast } = useToast();

  const username = searchParams.get("username");
  const otp = searchParams.get("otp");

  const verifyCode = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/verify-code", {
        username,
        code: otp,
      });
      setIsSubmitting(false);
      setMessage(response.data.message);

      if (response.data.success && response.status === 200) {
        router.push("/sign-in");
      }

      if (response.data.success) {
        toast({
          title: "Success",
          description: `${response.data.message}`,
        });
      } else {
        toast({
          title: "Error",
          description: `${response.data.message}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to verify user", error);
      const AxiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        AxiosError?.response?.data?.message ??
        "An error occurred. Please try again.";
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
      setMessage(errorMessage);
    }
  };

  useEffect(() => {
    if (username && otp) {
      verifyCode();
    } else {
      router.push("/");
    }
  }, [username, otp, router]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg">
          <h1 className="text-2xl text-purple-800 font-bold mb-4">Verify Account</h1>
          {isSubmitting ? (
            <div className="flex text-gray-400">
              Verifying Otp... <Loader2 className="animate-spin" />
            </div>
          ) : (
            <p className="text-2xl text-gray-400">{message}</p>
          )}
        </div>
        {message && (
          <Link
            href={"/"}
            className={"bg-white px-2 font-semibold py-1 text-xs rounded-lg"}
          >
            goto Home Page →
          </Link>
        )}
      </div>
    </Suspense>
  );
}

export default VerifyAccountPage;
