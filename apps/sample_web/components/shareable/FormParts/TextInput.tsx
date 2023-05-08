import { FC, SyntheticEvent } from "react";
import styled, { css } from "styled-components";
import { UseFormRegister, FieldValues, UseFormResetField, FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { colors } from "global-constants";
import FormErrorMessage from "./FormErrorMessage";

const TextInputContainer = styled.div<{ $colorScheme: "light" | "dark"; $isDirty: boolean; $error: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .input-container {
    position: relative;
    width: 100%;
    &:hover {
      .form-label {
        font-size: 0.8rem;
        top: 0;
      }
    }
    .form-label {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: ${colors.lightGrey};
      font-weight: 500;
      transition: top 300ms, color 300ms, font-size 300ms;
      background-color: ${({ $colorScheme }) => ($colorScheme === "dark" ? colors.white : colors.black)};
    }

    .form-input {
      width: 100%;
      background-color: transparent;
      border: 1px solid ${colors.lightGrey};
      padding: 10px 15px;
      border-radius: 5px;
      color: ${({ $colorScheme }) => ($colorScheme === "dark" ? colors.black : colors.white)};
      transition: border-color 300ms;
      &::selection {
        background-color: ${({ $colorScheme }) => ($colorScheme === "dark" ? colors.black : colors.white)};
        color: ${({ $colorScheme }) => ($colorScheme === "dark" ? colors.white : colors.black)};
      }
      &:focus {
        outline: 0px;
        & + .form-label {
          top: 0px;
          font-size: 0.8rem;
        }
      }
    }
    ${({ $isDirty, $colorScheme }) =>
      $isDirty &&
      css`
        .form-label {
          top: 0;
          font-size: 0.8rem;
          color: ${$colorScheme === "dark" ? colors.darkGrey : colors.white};
        }
        .form-input {
          border-color: ${$colorScheme === "dark" ? colors.darkGrey : colors.white};
        }
      `}
    ${({ $error, $colorScheme }) =>
      $error &&
      css`
        .form-label {
          color: ${$colorScheme === "dark" ? colors.amber : colors.lightAmber};
        }
        .form-input {
          border-color: ${$colorScheme === "dark" ? colors.amber : colors.lightAmber};
        }
      `}
  }
`;

interface InputFieldProps {
  id: string;
  label: string;
  errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  isDirty: boolean;
  type?: "text" | "password" | "email";
  register: UseFormRegister<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  colorScheme?: "light" | "dark";
}

const TextInput: FC<InputFieldProps> = ({ id, isDirty, label, errors, type = "text", colorScheme = "dark", register, resetField }) => {
  const handleReset = (e: SyntheticEvent) => {
    if ((e.target as HTMLInputElement).value !== "") return;
    resetField(id, { defaultValue: "", keepDirty: false });
  };
  return (
    <TextInputContainer $colorScheme={colorScheme} $isDirty={isDirty} $error={!!errors}>
      <div className="input-container">
        <input
          id={id}
          className="paragraph form-input"
          type={type}
          {...register(id, {
            onChange: handleReset,
          })}
        />
        <label className="paragraph form-label" htmlFor={id}>
          {label}
        </label>
      </div>
      <FormErrorMessage errors={errors} />
    </TextInputContainer>
  );
};

export default TextInput;
