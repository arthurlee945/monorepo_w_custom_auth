import { FC, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import { TRPCClientError } from "@trpc/client";
import { m } from "framer-motion";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

//----------------custom
import { trpc } from "../../../utils/trpc";
import { handleRecaptchaValidation } from "../../../utils/utilFunctions";
import TextInput from "../../shareable/FormParts/TextInput";
import SubmitButton from "../../shareable/FormParts/SubmitButton";
import FormLoadingState from "../../shareable/FormParts/FormLoadingState";
import SubmitMessage from "../../shareable/FormParts/SubmitMessage";
import GlobalFormError from "../../shareable/FormParts/GlobalFormError";

const ForgotPasswordFormConatiner = styled(m.div)`
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
  .forgotPassword-form {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }
`;

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
});

interface ForgotPasswordFormProps {
  handleFormSelection: (selectedForm: "signUp" | "login" | "forgotPassword") => void;
}

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ handleFormSelection }) => {
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation();
  const [formStates, setFormState] = useState({
    loading: false,
    submitted: false,
  });
  const [globalFormError, setGlobalFormError] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    setError,
    formState: { errors, isSubmitSuccessful, dirtyFields },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { executeRecaptcha } = useGoogleReCaptcha();
  const onSubmit = async (data: FieldValues) => {
    if (formStates.loading) return;
    setFormState((curr) => ({
      ...curr,
      loading: true,
    }));
    setGlobalFormError(undefined);
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
    //------------------send
    const { email } = data;
    try {
      await forgotPasswordMutation.mutateAsync(email);
      setFormState((curr) => ({
        ...curr,
        loading: false,
        submitted: true,
      }));
    } catch (err) {
      if (err instanceof TRPCClientError) {
        if (err.shape && err.shape.data.code === "BAD_REQUEST") {
          setError(
            "email",
            {
              type: "bad_request",
              message: err.shape.message,
            },
            { shouldFocus: true }
          );
        } else if (err.shape && err.shape.data.code === "INTERNAL_SERVER_ERROR") {
          setGlobalFormError(err.shape.message);
        } else {
          setGlobalFormError("Sorry Something Went Wrong");
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
    setFocus("email");
  }, [setFocus]);
  return (
    <ForgotPasswordFormConatiner key="forgotPassword-form" initial={{ x: 25, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <div className="log-information">
        <h1 className="log-title">Forgot Password</h1>
      </div>
      {globalFormError && (
        <GlobalFormError
          error={globalFormError}
          closeError={() => {
            setGlobalFormError(undefined);
          }}
        />
      )}
      {!formStates.submitted ? (
        <div className="form-container">
          <form id="forgotPassword-form" className="forgotPassword-form" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              id="email"
              label="Email"
              isDirty={!!dirtyFields.email}
              register={register}
              resetField={resetField}
              errors={errors.email}
            />
            <SubmitButton>Send Reset Email</SubmitButton>
          </form>
          {formStates.loading && <FormLoadingState />}
        </div>
      ) : !isSubmitSuccessful ? (
        <SubmitMessage />
      ) : (
        <SubmitMessage message="Password Reset Email Sent!<br/>Please Check Your Email." />
      )}
      <div className="other-action">
        <p className="paragraph-small">
          New to <span className="co-name">this app</span>?{" "}
          <button className="paragraph-small otherAction-button" type="button" onClick={handleFormSelection.bind(null, "signUp")}>
            Sign up
          </button>
        </p>
      </div>
    </ForgotPasswordFormConatiner>
  );
};

export default ForgotPasswordForm;
