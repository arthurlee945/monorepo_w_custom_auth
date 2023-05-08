import { FC, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import { m } from "framer-motion";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

//----------------custom-------------------
import { trpc } from "../../../utils/trpc";
import { handleRecaptchaValidation } from "../../../utils/utilFunctions";
import TextInput from "../../shareable/FormParts/TextInput";
import SubmitButton from "../../shareable/FormParts/SubmitButton";
import CheckBoxInput from "../../shareable/FormParts/CheckBoxInput";
import SubmitMessage from "../../shareable/FormParts/SubmitMessage";
import GlobalFormError from "../../shareable/FormParts/GlobalFormError";
import FormLoadingState from "../../shareable/FormParts/FormLoadingState";

const SignUpFormConatiner = styled(m.div)`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  .log-information {
    .log-title {
      font-size: 1.4rem;
      font-weight: 600;
    }
  }
  .form-container {
    position: relative;
  }
  .signup-form {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }
`;

const signUpSchema = z
  .object({
    username: z.string().trim().min(1, "Username is required").max(100),
    email: z.string().trim().min(1, "Email is required").email("Invalid email"),
    password: z.string().trim().min(1, "Password is required").min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().trim().min(1, "Password confirmation is required"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

interface SignUpFormProps {
  closeModal: (status: "open" | "close") => void;
  handleFormSelection: (selectedForm: "signUp" | "login" | "forgotPassword") => void;
}

const SignUpForm: FC<SignUpFormProps> = ({ closeModal, handleFormSelection }) => {
  const [formStates, setFormState] = useState({
    loading: false,
    submitted: false,
  });
  const [globalFormError, setGlobalFormError] = useState<string | undefined>(undefined);
  const signUpMutation = trpc.auth.signup.useMutation();

  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    setError,
    formState: { errors, isSubmitSuccessful, dirtyFields },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: FieldValues) => {
    if (formStates.loading) return;
    setGlobalFormError(undefined);
    setFormState((curr) => ({
      ...curr,
      loading: true,
    }));

    const recaptchaResult = await handleRecaptchaValidation(executeRecaptcha);
    if (!recaptchaResult || recaptchaResult !== "successful") {
      setError("root.serverError", {
        type: "400",
      });
      setFormState((curr) => ({
        ...curr,
        loading: false,
        submitted: true,
      }));
      return;
    }

    //----- submit to db
    const { username, email, password } = data;
    try {
      const res = await signUpMutation.mutateAsync({
        username,
        email,
        password,
      });
      console.log(res, "this is res");
      closeModal("close");
    } catch (err) {
      if (err instanceof TRPCClientError) {
        if (err.shape && err.shape.data.code === "BAD_REQUEST") {
          setError(
            err.shape?.message === "Username already exists" ? "username" : "email",
            {
              type: "data-duplicate",
              message: err.shape?.message,
            },
            { shouldFocus: true }
          );
        } else {
          setGlobalFormError("Something went wrong");
        }
      } else {
        setError("root.serverError", {
          type: "400",
        });
      }
      setFormState((curr) => ({
        ...curr,
        loading: false,
        submitted: !(err instanceof TRPCClientError),
      }));
    }
  };

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  return (
    <SignUpFormConatiner key="signup-form" initial={{ x: 25, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <div className="log-information">
        <h1 className="log-title">Sign Up</h1>
      </div>
      {globalFormError && (
        <GlobalFormError
          error={globalFormError}
          closeError={() => {
            setGlobalFormError(undefined);
          }}
        />
      )}
      {formStates.submitted && !isSubmitSuccessful ? (
        <SubmitMessage />
      ) : (
        <div className="form-container">
          <form id="signup-form" className="signup-form" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              id="username"
              label="Username"
              isDirty={!!dirtyFields.username}
              register={register}
              resetField={resetField}
              errors={errors.username}
            />
            <TextInput
              id="email"
              label="Email"
              isDirty={!!dirtyFields.email}
              register={register}
              resetField={resetField}
              errors={errors.email}
            />
            <TextInput
              id="password"
              label="Password"
              type="password"
              isDirty={!!dirtyFields.password}
              register={register}
              resetField={resetField}
              errors={errors.password}
            />
            <TextInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              isDirty={!!dirtyFields.confirmPassword}
              register={register}
              resetField={resetField}
              errors={errors.confirmPassword}
            />
            <CheckBoxInput id="terms" register={register} resetField={resetField} errors={errors.terms} />
            <SubmitButton>Sign Up</SubmitButton>
          </form>
          {formStates.loading && <FormLoadingState />}
        </div>
      )}
      <div className="other-action">
        <p className="paragraph-small">
          Already a resolver?{" "}
          <button
            className="paragraph-small otherAction-button"
            type="button"
            onClick={() => {
              !formStates.loading && handleFormSelection("login");
            }}
          >
            Log In
          </button>
        </p>
      </div>
    </SignUpFormConatiner>
  );
};

export default SignUpForm;
