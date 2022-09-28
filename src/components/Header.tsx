import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRecoilState } from 'recoil';
import { currentUserAuth } from '../../store';

const Header = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAuth);

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
        <Flex
          as='header'
          alignItems='center'
          justifyContent='space-between'
          p={3}
          w='100%'
          h='70px'
          position='sticky'
          top={0}
          backgroundColor='facebook.500'
          zIndex={100}
        >
          <Link href='/dashboard'>
            <a>
              <Text color='white' fontWeight='bold'>
                DAIMARU HAKUI
              </Text>
            </a>
          </Link>

          <Box>
            <Button
              size='sm'
              colorScheme='facebook'
              mr={3}
              onClick={signOutUser}
            >
              ログアウト
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Header;
