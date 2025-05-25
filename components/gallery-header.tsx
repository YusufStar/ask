"use client"

import { User } from "@prisma/client";
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";
import { format } from "date-fns";
import { AvatarStack } from "./ui/avatar-stack";
import { Button } from "./ui/button";
import { Share2Icon, Trash, Upload } from "lucide-react";

export function GalleryHeader({
    users,
    content,
    date,
    location,
}: {
    users: User[];
    content: string;
    date: Date;
    location: string | null;
}) {
    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col flex-1">
                        <CardTitle>{location} - {format(date, "MMMM dd, yyyy")}</CardTitle>
                        <CardDescription>{content}</CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Actions */}
                        <Button size="icon" variant="destructive">
                            <Trash className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary">
                            <Share2Icon className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline">
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-col items-end flex-1">
                        <AvatarStack avatars={users.map(user => ({
                            name: `${user.firstName} ${user.lastName}`,
                            url: user.avatar || undefined
                        }))} size="md" id="header-gallery-avatar-stack" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
