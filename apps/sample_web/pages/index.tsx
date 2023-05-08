import Head from "next/head";
import { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../utils/contexts/AuthContext";
import { AnimatePresence, m } from "framer-motion";

const HomePageContainer = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: max(30vh, 200px) 0px;
    width: 100%;
    h1 {
        display: flex;
        column-gap: 1rem;
        font-size: 2rem;
        font-weight: 500;
        > span {
            font-weight: 600;
        }
    }
`;

export default function Home() {
    const {
        authenticatedUser: { authenticated, user },
    } = useContext(AuthContext);
    return (
        <>
            <Head>
                <title>Sample App</title>
                <meta name="description" content="Sample App Home" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <HomePageContainer>
                <AnimatePresence mode="wait">
                    {!authenticated ? (
                        <m.h1
                            key="not-loggedIn"
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                        >
                            Please Log In
                        </m.h1>
                    ) : (
                        <m.div
                            key="loggedIn"
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                        >
                            <h1>
                                Username:<span>{user.username}</span>
                            </h1>
                            <h1>
                                email: <span>{user.email}</span>
                            </h1>
                        </m.div>
                    )}
                </AnimatePresence>
            </HomePageContainer>
        </>
    );
}
