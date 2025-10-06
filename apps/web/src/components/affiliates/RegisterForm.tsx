"use client"

import { z } from "zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import * as UI from "@/components/ui"
import useRegisterAffiliate from "@/hooks/useRegisterAffiliate";
import { Toaster, toast } from "sonner";
import { GENDER_VALUES } from "@/types/affiliates.type"

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Phone number is required.",
  }),
  dni: z.string().min(1, {
    message: "DNI is required.",
  }),
  gender: z.enum(GENDER_VALUES),
  birthDate: z.date({
    message: "Birth date is required.",
  }),
});

function RegisterForm() {
  const { register, loading } = useRegisterAffiliate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dni: "",
      gender: "M",
      birthDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await register(values);
      toast.success("Affiliate registered successfully!");
      form.reset();
    } catch {
      toast.error("Failed to register affiliate.");
    }
  }

  return (
    <>
      <Toaster />
      <UI.Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="my-8 space-y-8"
        >
          <div className="grid grid-cols-3 gap-6">
            <UI.FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <UI.FormItem>
                  <UI.FormLabel>First Name</UI.FormLabel>
                  <UI.FormControl>
                    <UI.Input placeholder="Francisco" {...field} />
                  </UI.FormControl>
                  <UI.FormMessage />
                </UI.FormItem>
              )}
            />
            <UI.FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <UI.FormItem>
                  <UI.FormLabel>Last Name</UI.FormLabel>
                  <UI.FormControl>
                    <UI.Input placeholder="Lopez" {...field} />
                  </UI.FormControl>
                  <UI.FormMessage />
                </UI.FormItem>
              )}
            />
            <UI.FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <UI.FormItem>
                  <UI.FormLabel>Phone Number</UI.FormLabel>
                  <UI.FormControl>
                    <UI.PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Ingresa tu número de teléfono"
                    />
                  </UI.FormControl>
                  <UI.FormMessage />
                </UI.FormItem>
              )}
            />
            <UI.FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <UI.FormItem>
                  <UI.FormLabel>DNI</UI.FormLabel>
                  <UI.FormControl>
                    <UI.Input placeholder="12345678" {...field} />
                  </UI.FormControl>
                  <UI.FormMessage />
                </UI.FormItem>
              )}
            />
            <UI.FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <UI.FormItem>
                  <UI.FormLabel>Gender</UI.FormLabel>
                  <UI.FormControl>
                    <UI.Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <UI.SelectTrigger className="!w-full">
                        <UI.SelectValue placeholder="Select gender" />
                      </UI.SelectTrigger>
                      <UI.SelectContent>
                        <UI.SelectItem value="M">Male</UI.SelectItem>
                        <UI.SelectItem value="F">Female</UI.SelectItem>
                      </UI.SelectContent>
                    </UI.Select>
                  </UI.FormControl>
                  <UI.FormMessage />
                </UI.FormItem>
              )}
            />
            <UI.FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <UI.FormItem className="flex flex-col">
                  <UI.FormLabel>Date of birth</UI.FormLabel>
                  <UI.Popover>
                    <UI.PopoverTrigger asChild>
                      <UI.FormControl>
                        <UI.Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </UI.Button>
                      </UI.FormControl>
                    </UI.PopoverTrigger>
                    <UI.PopoverContent className="w-auto p-0" align="start">
                      <UI.Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </UI.PopoverContent>
                  </UI.Popover>
                  <UI.FormMessage />
                </UI.FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <UI.Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </UI.Button>
          </div>
        </form>
      </UI.Form>
    </>
  );
}

export default RegisterForm
