import { Box, Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface TextFieldElementProps {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  pattern?: { value: RegExp; message: string };
  options?: { value: string; label: string; disabled?: boolean }[];
}

const TextFieldElement = ({ name, label, type = "text", placeholder, required = false, minLength, pattern, options }: TextFieldElementProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        required: required ? `${label} is required` : false,
        minLength: minLength ? { value: minLength, message: `${label} must be at least ${minLength} characters` } : undefined,
        pattern,
      }}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            value={field.value ?? ""}
            placeholder={placeholder}
            select={!!options}
            slotProps={{
              input: type === "password" ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      type="button"
                      size="small"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ minWidth: 0, textTransform: "none" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputAdornment>
                ),
              } : undefined,
              htmlInput: { "aria-label": label },
              select: options ? {
                displayEmpty: true,
                open: selectOpen,
                onOpen: () => setSelectOpen(true),
                onClose: () => setSelectOpen(false),
                SelectDisplayProps: {
                  onMouseDown: (event) => {
                    event.preventDefault();
                    event.currentTarget.focus();
                  },
                  onClick: () => setSelectOpen(true),
                },
                inputProps: { "aria-label": label },
                renderValue: (value) => value
                  ? options.find((option) => option.value === value)?.label
                  : <Box component="span" sx={{ opacity: 0.42 }}>{placeholder}</Box>,
              } : undefined,
            }}
            type={type === "password" && showPassword ? "text" : type}
            fullWidth
            margin="none"
            variant="outlined"
            error={!!error}
            helperText={error?.message as string}
          >
            {options && <MenuItem value="" disabled>{placeholder}</MenuItem>}
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    />
  );
};

export default TextFieldElement;
