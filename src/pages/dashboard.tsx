/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Container,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FaSistrix } from "react-icons/fa";
import Card from "../components/Card";
import { useRecoilState } from "recoil";
import { projectsState } from "../../store";

type Project = {
  id: string;
  title: string;
  desc: string;
  schedule: "";
  createdAt: Timestamp;
};

const Dashboard = () => {
  const [projects, setProjects] = useRecoilState<any>(projectsState);
  // const [projects, setProjects] = useState<any>([]);

  // projectsを取得
  useEffect(() => {
    const getProjects = async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
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

  console.log("projects", projects);
  return (
    <Container maxW="1200px" pt={6}>
      <Flex>
        <InputGroup mr={2}>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSistrix color="gray.300" />}
          />
          <Input type="text" placeholder="Search..." bgColor="white" />
        </InputGroup>
        <Link href="/new">
          <a>
            <Button colorScheme="facebook">新しい採寸を追加</Button>
          </a>
        </Link>
      </Flex>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={6}
        mt={6}
      >
        {projects.map((project: Project) => (
          <Card key={project.id} project={project} />
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
