"use client"

import { z } from "zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import * as UI from "@/components/ui"
import { Alert, AlertDescription } from "@/components/ui/alert"
import useRegisterAffiliate from "@/hooks/useRegisterAffiliate";
import { toast } from "sonner";
import { GENDER_VALUES } from "@myguardcare-affiliates-types"
import React from "react"

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  phoneNumber: z.string()
    .min(1, { message: "Phone number is required." })
    .regex(/^\+?[1-9]\d{11,14}$/, {
      message: "Please enter a valid phone number in international format (e.g., +1234567890).",
    }),
  dni: z.string().min(1, {
    message: "DNI is required.",
  }),
  gender: z.enum(GENDER_VALUES),
  birthDate: z.date({
    message: "Birth date is required.",
  }),
});
interface RegisterFormProps {
  tableRefetch: () => void;
}

function RegisterForm({ tableRefetch }: RegisterFormProps) {
  const { register, loading, error, validationErrors } = useRegisterAffiliate();

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

  React.useEffect(() => {
    if (validationErrors && validationErrors.length > 0) {
      validationErrors.forEach((validationError) => {
        const fieldName = validationError.field as keyof z.infer<typeof formSchema>;
        if (fieldName in form.getValues()) {
          form.setError(fieldName, {
            type: "server",
            message: validationError.message,
          });
        }
      });
    }
  }, [validationErrors, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await register(values);
      toast.success("Affiliate registered successfully!");
      form.reset();
      tableRefetch();
    } catch {
      toast.error("Failed to register affiliate.");
    }
  }

  return (
    <>
      <UI.Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8 md:mt-10 lg:mt-12"
        >
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      />
                    </UI.PopoverContent>
                  </UI.Popover>
                  <UI.FormMessage />
                </UI.FormItem>
              )}
            />
          </div>
          <div className="flex justify-center lg:justify-end">
            <UI.Button className="w-full sm:w-1/3 lg:w-auto" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </UI.Button>
          </div>
        </form>
      </UI.Form>
    </>
  );
}

export default RegisterForm
