"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { setupAccount } from "@/actions/setup-account";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SetupPage() {
    const router = useRouter()

    const { mutate } = useMutation({
        mutationFn: setupAccount,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }
            router.push("/")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    useEffect(() => {
        mutate()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card>
                <CardContent className="flex items-center justify-center flex-col text-center">
                    <div className="w-full flex justify-between">
                        <Heart fill="currentColor" className="h-6 w-6 text-red-500 animate-pulse" />
                        <Loader className="animate-spin h-6 w-6 text-red-300" />
                        <Heart fill="currentColor" className="h-6 w-6 text-red-500 animate-pulse" />
                    </div>
                    <p className="mt-4 text-red-200">Please wait while we set up your account...</p>
                </CardContent>
            </Card>
        </div>
    );
}