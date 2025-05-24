"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "./ui/label";
import { toast } from "sonner";
import { CopyButton } from "./copy-button";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { joinRelationship } from "@/actions/join-relationship";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader } from "lucide-react";

export function CreateRelationship({
    yourCode,
}: {
    yourCode: string | null;
}) {
    const router = useRouter();
    const [code, setCode] = useState<string>("");
    const handleCopy = () => {
        if (yourCode) {
            navigator.clipboard.writeText(yourCode)
                .then(() => {
                    toast.success("Relationship code copied to clipboard!");
                })
                .catch((error) => {
                    console.error("Failed to copy relationship code:", error);
                    toast.error("Failed to copy relationship code.");
                });
        } else {
            toast.error("No relationship code available to copy.");
        }
    };

    const { mutate, isPending } = useMutation({
        mutationFn: joinRelationship,
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Successfully joined the relationship!");
                router.refresh();
            } else {
                toast.error(data.message || "Failed to join the relationship. Please check the code and try again.");
            }
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleJoin = () => {
        if (code.length < 6) {
            toast.error("Please enter a valid relationship code.");
            return;
        }

        mutate(code);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>
                        Create a New Relationship
                    </CardTitle>
                    <CardDescription>
                        To create a new relationship, please enter the details below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <Label>
                            Your Relationship Code
                        </Label>
                        <div className="flex items-center space-x-2">
                            <InputOTP maxLength={6} value={yourCode ?? ""} disabled readOnly>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>

                            <CopyButton onCopy={handleCopy} />
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Join another relationship */}
                    <div className="flex flex-col space-y-4">
                        <Label>
                            Join Relationship
                        </Label>
                        <div className="flex items-center space-x-2">
                            <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>

                            <Button disabled={isPending || code.length < 6} onClick={handleJoin} size="icon" variant="outline">
                                <span className="sr-only">Join</span>
                                {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}