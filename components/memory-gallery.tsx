"use client"

import { getMyShipMemories } from "@/actions/getMyRelationship";
import { Memories } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart, Loader } from "lucide-react";
import { Label } from "./ui/label";
import NewMemoryDialog from "./new-memory-dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { AvatarStack } from "./ui/avatar-stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function MemoryGallery({
    firstMemories,
    users
}: {
    firstMemories: Memories[];
    users: {
        id: string;
        clerkId: string;
        email: string;
        avatar: string | null;
        firstName: string;
        lastName: string;
    }[];
}) {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const { data, isPlaceholderData, refetch } = useQuery({
        queryKey: ['memories'],
        queryFn: getMyShipMemories,
        placeholderData: firstMemories,
        staleTime: 0
    });

    return (
        <div className="flex flex-col min-h-screen p-4">
            <NewMemoryDialog
                open={open}
                onOpenChange={setOpen}
                refetch={refetch}
            />

            {/* Display ship partners */}
            <div className="w-full flex items-center justify-between border border-destructive p-4 rounded-md shadow-lg shadow-destructive/20 mb-4">
                <div key={users[0].id} className="flex items-center gap-2">
                    <Avatar>
                        <AvatarFallback>
                            {users[0].firstName.charAt(0)}{users[0].lastName.charAt(0)}
                        </AvatarFallback>
                        <AvatarImage src={users[0].avatar || undefined} alt={`${users[0].firstName} ${users[0].lastName}`} />
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{users[0].firstName} {users[0].lastName}</span>
                        <span className="text-xs text-gray-500">{users[0].email}</span>
                    </div>
                </div>

                <Heart className="text-red-500 size-10" />

                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarFallback>
                            {users[1].firstName.charAt(0)}{users[1].lastName.charAt(0)}
                        </AvatarFallback>
                        <AvatarImage src={users[1].avatar || undefined} alt={`${users[1].firstName} ${users[1].lastName}`} />
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{users[1].firstName} {users[1].lastName}</span>
                        <span className="text-xs text-gray-500">{users[1].email}</span>
                    </div>
                </div>
            </div>

            {
                isPlaceholderData
                    ? <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                        <Loader className="animate-spin" />
                    </div>
                    : (data && data.length > 0)
                        ? <div className="w-full h-auto flex flex-col gap-4">
                            <Label className="text-lg font-semibold">
                                Your Memories
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {data.map((memory) => (
                                    <Card key={memory.id} onClick={() => router.push(`/${memory.id}`)} className="hover:bg-card/70 transition-colors cursor-pointer">
                                        <CardHeader>
                                            <CardTitle>
                                                {format(new Date(memory.date), "MMMM dd, yyyy")} - {memory.location}
                                            </CardTitle>
                                            <CardDescription className="truncate">
                                                {memory.content}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex items-center justify-between">
                                            <AvatarStack
                                                id={`memory-${memory.id}`}
                                                size="md"
                                                avatars={users.map(user => ({
                                                    url: user.avatar || undefined,
                                                    name: `${user.firstName} ${user.lastName}`,
                                                }))}
                                            />

                                            <span className="text-xs text-gray-500 mt-1">
                                                {memory.images.length} images
                                            </span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        : <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center flex-col gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground/70" fill="currentColor" version="1.1" width="100px" height="100px" viewBox="0 0 53.938 53.938">
                                <g>
                                    <g>
                                        <g>
                                            <path d="M26.969,53.938c-14.871,0-26.968-12.1-26.968-26.97C0.001,12.098,12.098,0,26.969,0s26.968,12.099,26.968,26.969     C53.937,41.839,41.84,53.938,26.969,53.938z M26.969,3.945c-12.695,0-23.022,10.329-23.022,23.023     c0,12.693,10.327,23.021,23.022,23.021c12.694,0,23.021-10.328,23.021-23.021C49.989,14.274,39.663,3.945,26.969,3.945z" />
                                        </g>
                                        <g>
                                            <path d="M15.217,40.079c-0.492,0-0.983-0.181-1.367-0.55c-0.786-0.754-0.813-2.002-0.058-2.787     c3.611-3.766,8.471-5.84,13.687-5.84c4.629,0,9.084,1.687,12.549,4.748c0.816,0.722,0.894,1.968,0.172,2.783     c-0.724,0.819-1.969,0.896-2.787,0.174c-2.741-2.424-6.27-3.758-9.934-3.758c-4.129,0-7.979,1.644-10.838,4.621     C16.253,39.876,15.735,40.079,15.217,40.079z" />
                                        </g>
                                        <g>
                                            <g>
                                                <circle cx="20.872" cy="24.363" r="2.604" />
                                            </g>
                                            <g>
                                                <circle cx="33.067" cy="24.363" r="2.604" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            <span className="text-muted-foreground">No memories found.</span>
                            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                                Add Memory
                            </Button>
                        </div>
            }
        </div>
    );
}