import { Box, MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface TextFieldElementProps {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

const TextFieldElement = ({ name, label, type = "text", placeholder, required = false, options }: TextFieldElementProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            placeholder={placeholder}
            select={!!options}
            slotProps={{
              htmlInput: { "aria-label": label },
              select: options ? {
                displayEmpty: true,
                inputProps: { "aria-label": label },
                renderValue: (value) => value
                  ? options.find((option) => option.value === value)?.label
                  : <Box component="span" sx={{ opacity: 0.42 }}>{placeholder}</Box>,
              } : undefined,
            }}
            type={type}
            fullWidth
            margin="none"
            variant="outlined"
            error={!!error}
            helperText={error?.message as string}
          >
            {options && <MenuItem value="" disabled>{placeholder}</MenuItem>}
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
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
