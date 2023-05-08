import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import MainLink from "../components/shareable/MainLInk";

//-------------------custom
import { trpc } from "../utils/trpc";
const VerificationContainer = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: max(30vh, 200px) 0px;
    width: 100%;
    .verification-info-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 25px;
        > h1 {
            font-size: 2.2rem;
        }
    }
`;
export default function VerifyEmail() {
    const [verificationState, setVerificationState] = useState<{ message: string | undefined; verified: boolean }>({
        message: undefined,
        verified: false,
    });
    const emailMutation = trpc.auth.emailVerify.useMutation();
    const router = useRouter();
    useEffect(() => {
        const token = router.query.token;
        if (!token || verificationState.verified) return;
        emailMutation.mutate(token.toString(), {
            onError: (err) => {
                setVerificationState((curr) => ({
                    ...curr,
                    message: err.shape?.message || "Something Went Wrong",
                    verified: true,
                }));
            },
        });
        setVerificationState((curr) => ({
            ...curr,
            verified: true,
        }));
    }, [router, emailMutation, verificationState]);
    return (
        <>
            <Head>
                <title>this app - Verify Email</title>
                <meta name="description" content="this app email verification page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <VerificationContainer>
                <div className="verification-info-box">
                    <h1>
                        {!verificationState.verified || emailMutation.isLoading
                            ? "Verifying..."
                            : emailMutation.isSuccess
                            ? "Thank you for verifying your email!"
                            : verificationState.message}
                    </h1>
                    <MainLink href="/">Go to home</MainLink>
                </div>
            </VerificationContainer>
        </>
    );
}
