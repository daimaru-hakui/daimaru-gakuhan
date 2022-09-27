import { Box, Container, Input } from '@chakra-ui/react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import InputModal from '../../components/InputModal';

type projectIdType = {
  title: string;
  desc: string;
  createdAt: Timestamp;
};

const ProjectId = () => {
  const router = useRouter();
  const [project, setProject] = useState<any>({});

  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, 'projects', `${router.query.id}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw 'プロジェクトがありません。';
      }
      setProject(docSnap.data());
    };
    getProject();
  }, [router.query.id]);

  return (
    <Container maxW='800px' pt={6}>
      <Box>{project?.title}</Box>
      {[0, 1, 2, 3, 4, 5].map((arr, index) => (
        <Box key={arr} mt={6}>
          <InputModal index={index} />
        </Box>
      ))}
    </Container>
  );
};

export default ProjectId;
