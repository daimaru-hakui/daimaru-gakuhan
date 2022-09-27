import { Box, Flex, GridItem, Text } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

import { FaSchool, FaExternalLinkAlt, FaQrcode, FaEdit } from 'react-icons/fa';
import QrModal from './QrModal';

type Props = {
  project: {
    id: string;
    title: string;
    desc: string;
    createdAt: Timestamp;
  };
};

const Card: NextPage<Props> = ({ project }) => {
  const dateFunc = (d: Date) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };
  return (
    <GridItem borderRadius={6} bg='white' boxShadow='base' p={6}>
      <Flex flexDirection='column' justifyContent='space-between' h='100%'>
        <Box>
          <Flex alignItems='center' gap={3}>
            <FaSchool size='30px' />
            <Box fontSize='base'>
              <Text fontWeight='bold'>{project?.title}</Text>
              <Text fontSize='xs'>
                作成日:{dateFunc(project.createdAt.toDate())}
              </Text>
            </Box>
          </Flex>
          <Box mt={2} fontSize='xs'>
            {project?.desc}
          </Box>
        </Box>
        <Flex justifyContent='space-around' alignItems='center' mt={12}>
          <Link href={project.id}>
            <a>
              <FaExternalLinkAlt />
            </a>
          </Link>
          <QrModal projectId={project?.id} />
          <Link href={`/projects/${project.id}`}>
            <a>
              <FaEdit size='19px' />
            </a>
          </Link>
        </Flex>
      </Flex>
    </GridItem>
  );
};

export default Card;
