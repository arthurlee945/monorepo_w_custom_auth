import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { z } from "zod";

//-------------------custom
import { trpc } from "../utils/trpc";
import { handleRecaptchaValidation } from "../utils/utilFunctions";
import GlobalFormError from "../components/shareable/FormParts/GlobalFormError";
import TextInput from "../components/shareable/FormParts/TextInput";
import SubmitButton from "../components/shareable/FormParts/SubmitButton";
import FormLoadingState from "../components/shareable/FormParts/FormLoadingState";
import SubmitMessage from "../components/shareable/FormParts/SubmitMessage";
import { TRPCClientError } from "@trpc/client";

const ResetPasswordContainer = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: max(30vh, 200px) 0px;
    width: 100%;
    .resetPassword-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 20px;
        > h1 {
            font-size: 2.2rem;
        }
    }
    .form-container {
        position: relative;
    }
    .resetPassword-form {
        display: flex;
        flex-direction: column;
        row-gap: 25px;
        min-width: 300px;
    }
`;

const resetPasswordSchema = z
    .object({
        newPassword: z.string().trim().min(1, "Password is required").min(8, "Password must have more than 8 characters"),
        confirmNewPassword: z.string().trim().min(1, "Password confirmation is required"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
    });

export default function ResetPassword() {
    const router = useRouter();
    const token = router.query.token;
    const [formStates, setFormState] = useState({
        loading: false,
        submitted: false,
    });
    const [globalFormError, setGlobalFormError] = useState<string | undefined>(undefined);
    const resetPasswordMutation = trpc.auth.resetPassword.useMutation();
    const {
        register,
        handleSubmit,
        resetField,
        setFocus,
        setError,
        formState: { errors, isSubmitSuccessful, dirtyFields },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const { executeRecaptcha } = useGoogleReCaptcha();

    const onSubmit = async (data: FieldValues) => {
        console.log("hi?");
        if (!token || formStates.loading) return;
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
        //-------------------send
        const { newPassword } = data;
        try {
            await resetPasswordMutation.mutateAsync({ token: token.toString(), newPassword });
            console.log("hi?");
            router.push("/");
        } catch (err) {
            setGlobalFormError(err instanceof TRPCClientError ? err.shape.message : "Sorry Something Went Wrong!");
            setFormState((curr) => ({
                ...curr,
                loading: false,
                submitted: !(err instanceof TRPCClientError),
            }));
        }
    };
    const onError = (err: any) => {
        console.log(err);
    };
    useEffect(() => {
        setFocus("password");
    }, [setFocus]);
    return (
        <>
            <Head>
                <title>this app - reset password</title>
                <meta name="description" content="this app reset password page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ResetPasswordContainer>
                <div className="resetPassword-container">
                    <h1>{token ? "Reset Password" : "Token is Required"}</h1>
                    {token && (
                        <>
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
                                    <form id="resetPassword-form" className="resetPassword-form" onSubmit={handleSubmit(onSubmit, onError)}>
                                        <TextInput
                                            id="newPassword"
                                            label="New Password"
                                            isDirty={!!dirtyFields.newPassword}
                                            register={register}
                                            resetField={resetField}
                                            errors={errors.newPassword}
                                            type="password"
                                            colorScheme="light"
                                        />
                                        <TextInput
                                            id="confirmNewPassword"
                                            label="Confirm New Password"
                                            isDirty={!!dirtyFields.confirmNewPassword}
                                            register={register}
                                            resetField={resetField}
                                            errors={errors.confirmNewPassword}
                                            type="password"
                                            colorScheme="light"
                                        />
                                        <SubmitButton colorScheme="light">Reset Password</SubmitButton>
                                    </form>
                                    {formStates.loading && <FormLoadingState colorScheme="light" />}
                                </div>
                            ) : !isSubmitSuccessful ? (
                                <SubmitMessage />
                            ) : (
                                <SubmitMessage message="Password Reset Email Sent!<br/>Please Check Your Email." />
                            )}
                        </>
                    )}
                </div>
            </ResetPasswordContainer>
        </>
    );
}
