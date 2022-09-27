/* eslint-disable react/no-children-prop */
import {
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
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaSistrix } from 'react-icons/fa';
import { db } from '../../firebase';
import Card from '../components/Card';

const Dashboard = () => {
  const [projects, setProjects] = useState<any>([]);

  // projectsを取得
  useEffect(() => {
    const getProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setProjects(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getProjects();
  }, []);
  console.log(projects);
  return (
    <Container maxW='1200px' pt={6}>
      <Flex>
        <InputGroup mr={2}>
          <InputLeftElement
            pointerEvents='none'
            children={<FaSistrix color='gray.300' />}
          />
          <Input type='text' placeholder='Search...' bgColor='white' />
        </InputGroup>
        <Link href='/new'>
          <a>
            <Button colorScheme='gray'>Add New</Button>
          </a>
        </Link>
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
        {projects.map(
          (project: {
            id: string;
            title: string;
            desc: string;
            createdAt: Timestamp;
          }) => (
            <Card key={project.id} project={project} />
          )
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
