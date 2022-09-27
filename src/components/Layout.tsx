import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Header from './Header';
import Loading from './Loading';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../store';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useRecoilState(loadingState);
  return (
    <>
      {loading && <Loading />}
      {router.pathname !== '/login' && <Header />}
      <Box bgColor='#fafafa' h={'calc(100vh - 70px)'}>
        {children}
      </Box>
    </>
  );
};

export default Layout;
