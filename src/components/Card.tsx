import { Box, Flex, GridItem, Text } from "@chakra-ui/react";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import {
  FaSchool,
  FaExternalLinkAlt,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { db } from "../../firebase";
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
  const router = useRouter();

  const deleteProject = async () => {
    const result = window.confirm("削除して宜しいでしょうか");
    if (!result) return;
    await deleteDoc(doc(db, "projects", `${project.id}`));
  };

  return (
    <GridItem borderRadius={6} bg="white" boxShadow="base" p={6}>
      <Flex flexDirection="column" justifyContent="space-between" h="100%">
        <Box>
          <Flex alignItems="center" gap={3}>
            <FaSchool size="30px" />
            <Box>
              <Link href={`/schools/${project.id}/`}>
                <a>
                  <Text fontSize="base" fontWeight="bold">
                    {project?.title}
                  </Text>
                </a>
              </Link>
              <Text fontSize="xs">採寸日 {project?.schedule}</Text>
            </Box>
          </Flex>
          <Box mt={2} fontSize="xs">
            {project?.desc}
          </Box>
        </Box>
        <Flex justifyContent="space-around" alignItems="center" mt={12}>
          <a href={project.id} target="_blank" rel="noopener noreferrer">
            <FaExternalLinkAlt />
          </a>

          <QrModal projectId={project?.id} />
          <Link href={`/projects/${project.id}`}>
            <a>
              <FaEdit size="19px" />
            </a>
          </Link>
          <FaTrashAlt cursor="pointer" onClick={deleteProject} />
        </Flex>
      </Flex>
    </GridItem>
  );
};

export default Card;
