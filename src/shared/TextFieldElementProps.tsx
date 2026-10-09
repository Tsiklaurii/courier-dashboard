import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface TextFieldElementProps {
  name: string;
  label: string;
  type: "text" | "password" | "email" | "number";
  placeholder?: string;
  required?: boolean;
}

const TextFieldElement = ({ name, label, type, placeholder, required = false }: TextFieldElementProps) => {
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
            slotProps={{ htmlInput: { "aria-label": label } }}
            type={type}
            fullWidth
            margin="none"
            variant="outlined"
            error={!!error}
            helperText={error?.message as string}
          />
        );
      }}
    />
  );
};

export default TextFieldElement;
