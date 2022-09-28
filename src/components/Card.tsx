import { Box, Flex, GridItem, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

import { FaSchool, FaExternalLinkAlt, FaQrcode, FaEdit } from "react-icons/fa";
import QrModal from "./QrModal";

type Props = {
  project: {
    id: string;
    title: string;
    desc: string;
    schedule: string;
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
    <GridItem borderRadius={6} bg="white" boxShadow="base" p={6}>
      <Flex flexDirection="column" justifyContent="space-between" h="100%">
        <Box>
          <Flex alignItems="center" gap={3}>
            <FaSchool size="30px" />
            <Box>
              <Text fontSize="base" fontWeight="bold">
                {project?.title}
              </Text>
              <Text fontSize="xs">採寸日 {project?.schedule}</Text>
            </Box>
          </Flex>
          <Box mt={2} fontSize="xs">
            {project?.desc}
          </Box>
        </Box>
        <Flex justifyContent="space-around" alignItems="center" mt={12}>
          <Link href={project.id}>
            <a>
              <FaExternalLinkAlt />
            </a>
          </Link>
          <QrModal projectId={project?.id} />
          <Link href={`/projects/${project.id}`}>
            <a>
              <FaEdit size="19px" />
            </a>
          </Link>
        </Flex>
      </Flex>
    </GridItem>
  );
};

export default Card;
