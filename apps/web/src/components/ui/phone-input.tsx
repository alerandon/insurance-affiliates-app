import * as React from "react";
import { cn } from "@/lib/utils";
import { PhoneInput as ReactInternationalPhoneInput, defaultCountries, parseCountry } from "react-international-phone";

export interface PhoneInputProps {
  value?: string;
  onChange?: (phone: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const countries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return ['ve'].includes(iso2);
});

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value = "", placeholder, disabled, ...props }, _ref) => {
    return (
      <div className={cn("w-full", className)}>
        <ReactInternationalPhoneInput
          defaultCountry="ve"
          value={value}
          onChange={onChange}
          countries={countries}
          inputProps={{
            placeholder: placeholder || "Ingresa tu número de teléfono",
            disabled,
            className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            ...props
          }}
          style={{
            "--react-international-phone-country-selector-background-color": "hsl(var(--background))",
            "--react-international-phone-country-selector-background-color-hover": "hsl(var(--accent))",
            "--react-international-phone-text-color": "hsl(var(--foreground))",
            "--react-international-phone-border-color": "hsl(var(--border))",
            "--react-international-phone-border-radius": "0.375rem",
            "--react-international-phone-height": "2.25rem"
          } as React.CSSProperties}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
