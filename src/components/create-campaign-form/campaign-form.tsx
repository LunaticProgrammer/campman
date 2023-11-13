import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { v4 as uuid } from 'uuid'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Campaign, cn } from "@/lib/utils"
import { BookOpenText, CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const CampaignForm = (
    {
        campId = "",
        isWatchOnly = false,
        setIsToggled
    }
) => {
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign>({ campname: "", description: "", launchDate: undefined, id: undefined })
    const navigate = useNavigate()
    const FormSchema = z.object({
        campname: z.string().min(2, {
            message: "Campaign name must be at least 2 characters.",
        }),
        description: z.string().min(20, {
            message: "Campaign description must be at least 20 characters.",
        }),
        launchDate: z.date(),
        id: z.string().optional()
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            campname: selectedCampaign.campname,
            description: selectedCampaign.description,
            launchDate: selectedCampaign.launchDate
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        data.id = uuid()
        localStorage.setItem("items", JSON.stringify([...JSON.parse(String(localStorage.getItem("items") || "[]")), data]))
        navigate('/')
        setIsToggled(false)

    }

    useEffect(() => {
        if (campId) {
            for (const camp of JSON.parse(String(localStorage.getItem('items')) || "[]")) {
                console.log(camp.id == campId)
                if (camp.id == campId) {
                    setSelectedCampaign({ ...camp })
                    break
                }
            }
        }
    }, [isWatchOnly])

    return <>
        {
            selectedCampaign.id ?
                <Card className="w-fit md:1/3">
                    <CardHeader>
                        <CardTitle className="mb-2 text-center">{selectedCampaign.campname}</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent className="mt-6 space-y-10 justify-center">
                        <div className="flex gap-2 text-center text-md text-slate-400">{selectedCampaign.description}</div>
                        <div className="flex gap-2 text-md text-gray-600"><CalendarIcon /> {new Date(selectedCampaign.launchDate).toLocaleString()}</div>
                    </CardContent>
                </Card > : <Card className="w-fit md:1/3">
                    <CardHeader>
                        <CardTitle className="mb-2 text-center">Add a campaign</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent className="mt-6">
                        <Form {...form}>
                            <form onSubmit={(f) => {
                                f.preventDefault()
                                form.trigger()
                                try {
                                    FormSchema.parse(form.getValues())
                                    onSubmit(form.getValues())

                                } catch (e) {
                                }
                                // onSubmit(form.getValues())
                            }} className="space-y-6">
                                <FormField
                                    disabled={Boolean(isWatchOnly)}
                                    control={form.control}
                                    name="campname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input type="text" maxLength={20} placeholder="Product Line.." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    disabled={Boolean(isWatchOnly)}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="This campaign is about..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    disabled={Boolean(isWatchOnly)}
                                    name="launchDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Launching Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal",
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
                                                        className="flex"
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date: Date) =>
                                                            date < new Date()
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                On this date your campaign will be launched to public.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div hidden={Boolean(isWatchOnly)}>

                                    <hr />
                                    <div className="flex mt-2 justify-center">

                                        <Button type="submit">Create Campaign</Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card >
        }

    </>
}

export { CampaignForm }