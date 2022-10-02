import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRecoilState } from 'recoil';
import { currentUserAuth } from '../../store';
import { useRouter } from 'next/router';

const Header = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAuth);
  const router = useRouter();

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser('');
        console.log('loguot');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {currentUser && (
        <Container maxW='1200'>
          <Flex
            as='header'
            alignItems='center'
            justifyContent='space-between'
            w='100%'
            h='60px'
            position='sticky'
            top={0}
            zIndex={100}
          >
            <Link href='/dashboard'>
              <a>
                <Text fontWeight='bold'>学販採寸アプリ</Text>
              </a>
            </Link>

            <Box>
              <Button size='sm' variant='ghost' onClick={signOutUser}>
                ログアウト
              </Button>
            </Box>
          </Flex>
          <Flex>
            <Link href='/dashboard'>
              <a>
                <Text
                  fontSize='xs'
                  colorScheme='gray'
                  py={3}
                  borderBottom='2px'
                  borderBottomColor={
                    location.pathname === '/dashboard' ? 'black' : '#ff2e2e00'
                  }
                  _hover={{ opacity: 0.8 }}
                >
                  ダッシュボード
                </Text>
              </a>
            </Link>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default Header;
