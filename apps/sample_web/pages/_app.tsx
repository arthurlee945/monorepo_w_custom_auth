import "styles/font-face.css";
import type { AppType } from "next/app";
//--------------components
import { trpc } from "../utils/trpc";
import Layout from "../components/layout/Layout";
import ContextContainer from "../utils/contexts/ContextContainer";

const App: AppType = ({ Component, pageProps }) => {
    return (
        <ContextContainer>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ContextContainer>
    );
};

export default trpc.withTRPC(App);
