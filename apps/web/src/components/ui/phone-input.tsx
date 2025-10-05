"use client";

import { Input, type InputProps } from "@/components/ui";
import { cn } from "@/lib/utils";
import React from "react";
import {
  CountrySelector,
  usePhoneInput,
} from "react-international-phone";

export const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  Omit<InputProps, "onChange"> & {
    value: string;
    onChange: (phone: string) => void;
  }
>(({ className, value, onChange, ...props }, ref) => {
  const [isTouched, setIsTouched] = React.useState(false);
  const { inputValue, handlePhoneValueChange, country, isValid } = usePhoneInput({
    defaultCountry: "ve",
    value,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="w-[80px]">
        <CountrySelector
          selectedCountry={country}
          onSelect={() => {}} // No-op
          renderButtonWrapper={({
            children,
            rootProps,
          }: {
            children: React.ReactNode;
            rootProps: React.HTMLAttributes<HTMLDivElement>;
          }) => (
            <div
              {...rootProps}
              className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {children}
            </div>
          )}
        />
      </div>
      <Input
        ref={ref}
        className={cn("w-full", !isValid && isTouched && "border-destructive")}
        value={inputValue}
        onChange={handlePhoneValueChange}
        onBlur={() => setIsTouched(true)}
        {...props}
      />
    </div>
  );
});
PhoneInput.displayName = "PhoneInput";
