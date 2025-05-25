"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import {
    useEffect
} from "react"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    cn
} from "@/lib/utils"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    format
} from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Calendar
} from "@/components/ui/calendar"
import {
    Calendar as CalendarIcon,
    Loader,
} from "lucide-react"
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMemory } from "@/actions/create-memory";

const formSchema = z.object({
    content: z.string().min(1),
    date: z.coerce.date(),
    location: z.string().min(1)
});

export default function NewMemoryDialog({
    open,
    onOpenChange,
    refetch
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch?: () => void;
}) {
    const { mutate, isPending } = useMutation({
        mutationFn: createMemory,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
            date: new Date(),
            location: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values, {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
                refetch?.();
                toast.success("Memory created successfully!");
            },
            onError: () => {
                toast.error(`Failed to create memory`);
            }
        })
    }

    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Memory</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Memory Content</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Memory explanation"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Detailed explanation of memory</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Memory Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Memory Location"

                                            type="text"
                                            {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={isPending} className="w-full" type="submit">
                            {isPending ? <Loader /> : "Create Memory"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}