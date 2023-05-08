import { FC, ReactNode } from "react";
import styled from "styled-components";
import { LazyMotion, domAnimation, AnimatePresence, m } from "framer-motion";
//---------------------components
import Header from "./Header";
import Footer from "./Footer";
interface LayoutProps {
    children: ReactNode;
}

const Main = styled(m.main)`
    max-width: 1440px;
    margin: 0px auto;
`;

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <AnimatePresence initial={false} mode="wait">
                <Main>{children}</Main>
            </AnimatePresence>
            <Footer />
        </>
    );
};

export default Layout;
