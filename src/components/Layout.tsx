import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Header from './Header';
import Loading from './Loading';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loadingState } from '../../store';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const loading = useRecoilValue(loadingState);
  return (
    <>
      {loading && <Loading />}
      {router.pathname !== '/login' && <Header />}
      <Flex
        flexDirection='column'
        bgColor='#fafafa'
        minH={'calc(100vh - 70px)'}
      >
        {children}
      </Flex>
    </>
  );
};

export default Layout;
