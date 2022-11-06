import { Box, Button, Flex, GridItem, Text, Tooltip } from '@chakra-ui/react';
import { deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  FaSchool,
  FaExternalLinkAlt,
  FaEdit,
  FaTrashAlt,
} from 'react-icons/fa';
import { db } from '../../firebase';
import QrModal from './QrModal';

type Props = {
  project: {
    id: string;
    title: string;
    desc: string;
    schedule: string;
    release: boolean;
    createdAt: Timestamp;
  };
};

const Card: NextPage<Props> = ({ project }) => {
  const router = useRouter();
  const [release, setRelease] = useState();

  // projectを削除
  const deleteProject = async () => {
    let result = window.confirm('削除して宜しいでしょうか');
    if (!result) return;
    result = window.confirm('本当に削除して宜しいでしょうか');
    if (!result) return;
    result = window.confirm(
      'これで最後です。\nすべてのデータが削除されますが宜しいでしょうか'
    );
    if (!result) return;
    await deleteDoc(doc(db, 'projects', `${project.id}`));
  };

  const updateProject = async (boolean: boolean) => {
    const docRef = doc(db, 'projects', `${project.id}`);
    await updateDoc(docRef, {
      release: boolean,
    });
  };

  return (
    <GridItem borderRadius={6} bg='white' boxShadow='base' p={6}>
      <Flex flexDirection='column' justifyContent='space-between' h='100%'>
        <Box>
          <Flex justifyContent='space-between'>
            <Flex alignItems='center' gap={3}>
              <FaSchool size='30px' />
              <Box>
                <Link href={`/schools/${project.id}/`}>
                  <a>
                    <Text fontSize='base' fontWeight='bold'>
                      {project?.title}
                    </Text>
                  </a>
                </Link>
                <Text fontSize='xs'>採寸日 {project?.schedule}</Text>
              </Box>
            </Flex>
            {project?.release ? (
              <Button
                size='xs'
                onClick={() => updateProject(false)}
                colorScheme='facebook'
              >
                公開
              </Button>
            ) : (
              <Button size='xs' onClick={() => updateProject(true)}>
                非公開
              </Button>
            )}
          </Flex>
          <Box mt={2} fontSize='xs'>
            {project?.desc}
          </Box>
        </Box>
        <Flex justifyContent='space-around' alignItems='center' mt={4}>
          <a
            href={`/register/${project.id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Box>
              <FaExternalLinkAlt />
            </Box>
          </a>

          <Box>
            <QrModal projectId={`/register/${project.id}`} />
          </Box>

          <Link href={`/projects/${project.id}`}>
            <a>
              <Box>
                <FaEdit size='19px' />
              </Box>
            </a>
          </Link>

          <Box>
            <FaTrashAlt cursor='pointer' onClick={deleteProject} />
          </Box>
        </Flex>
      </Flex>
    </GridItem>
  );
};

export default Card;
