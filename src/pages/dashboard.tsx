/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { FaSistrix } from 'react-icons/fa';
import Card from '../components/Card';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUserAuth, projectsState } from '../../store';
import { useRouter } from 'next/router';

type Project = {
  id: string;
  title: string;
  desc: string;
  schedule: '';
  release: boolean;
  createdAt: Timestamp;
};

const Dashboard = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserAuth);
  const [projects, setProjects] = useRecoilState<any>(projectsState);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // projectsを取得
  useEffect(() => {
    const getProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setProjects(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    };
    getProjects();
  }, [setProjects]);

  return (
    <Container maxW='1200px' mb={6}>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent='space-between'
      >
        <Box pt={6}>
          <InputGroup mr={2}>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSistrix color='gray.300' />}
            />
            <Input
              type='text'
              placeholder='Search...'
              bgColor='white'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Box py={6}>
          <Link href='/new'>
            <a>
              <Button colorScheme='facebook'>新しい採寸を追加</Button>
            </a>
          </Link>
        </Box>
      </Flex>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap={6}
        mt={6}
      >
        {projects
          .filter((project: { title: string }) =>
            project?.title.includes(searchValue)
          )
          .map((project: Project) => (
            <Card key={project.id} project={project} />
          ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
