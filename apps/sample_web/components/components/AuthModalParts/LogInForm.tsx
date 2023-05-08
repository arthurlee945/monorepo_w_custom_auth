import { FC, useContext, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import { m } from "framer-motion";
//----------------custom
import { trpc } from "../../../utils/trpc";
import { AuthContext } from "../../../utils/contexts/AuthContext";
import TextInput from "../../shareable/FormParts/TextInput";
import SubmitButton from "../../shareable/FormParts/SubmitButton";
import SubmitMessage from "../../shareable/FormParts/SubmitMessage";
import GlobalFormError from "../../shareable/FormParts/GlobalFormError";
import FormLoadingState from "../../shareable/FormParts/FormLoadingState";
import { handleRecaptchaValidation } from "../../../utils/utilFunctions";

const LogInFormConatiner = styled(m.div)`
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
    .login-form {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
    }
`;

const logInSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().trim().min(1, "Password is required"),
});

interface LogInFormProps {
    closeModal: (status: "open" | "close") => void;
    handleFormSelection: (selectedForm: "signUp" | "login" | "forgotPassword") => void;
}

const LogInForm: FC<LogInFormProps> = ({ closeModal, handleFormSelection }) => {
    const { revalidateAuth } = useContext(AuthContext);
    const loginMutation = trpc.auth.login.useMutation();
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
        resolver: zodResolver(logInSchema),
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
        //---------------send
        const { username, password } = data;
        try {
            await loginMutation.mutateAsync({
                username,
                password,
            });
            revalidateAuth();
            closeModal("close");
        } catch (err) {
            if (err instanceof TRPCClientError) {
                if (err.shape && err.shape.data.code === "BAD_REQUEST") {
                    setError(
                        err.shape.message === "Username is Required" ? "username" : "password",
                        {
                            type: "missing-required-field",
                            message: err.shape.message,
                        },
                        { shouldFocus: true }
                    );
                } else if (err.shape && err.shape.data.code === "NOT_FOUND") {
                    setGlobalFormError(err.shape.message);
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
        <LogInFormConatiner key="login-form">
            <div className="log-information">
                <h1 className="log-title">Log In</h1>
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
                    <form id="login-form" className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        <TextInput
                            id="username"
                            label="Username"
                            isDirty={!!dirtyFields.username}
                            register={register}
                            resetField={resetField}
                            errors={errors.username}
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
                        <SubmitButton>Log In</SubmitButton>
                    </form>
                    {formStates.loading && <FormLoadingState />}
                </div>
            )}
            <div className="other-action">
                <p className="paragraph-small">
                    New to <span className="co-name">this app</span>?{" "}
                    <button
                        className="paragraph-small otherAction-button"
                        type="button"
                        onClick={() => {
                            if (formStates.loading) return;
                            handleFormSelection("signUp");
                        }}
                    >
                        Sign up
                    </button>
                </p>
                <button
                    className="paragraph-small otherAction-button"
                    type="button"
                    onClick={handleFormSelection.bind(null, "forgotPassword")}
                >
                    Forgot Password?
                </button>
            </div>
        </LogInFormConatiner>
    );
};

export default LogInForm;
