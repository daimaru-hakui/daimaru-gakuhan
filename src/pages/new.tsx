import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentUserState, loadingState } from "../../store";

const New = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingState);
  const [inputData, setInputData] = useState({
    title: "",
    desc: "",
    schedule: "",
    gender: 1,
  });

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputData({ ...inputData, [name]: value });
  };

  const addTitle = async () => {
    const projectsRef = collection(db, "projects");
    try {
      setLoading(true);
      const docRef = await addDoc(projectsRef, {
        title: inputData.title,
        desc: inputData.desc,
        schedule: inputData.schedule,
        gender: 1,
        createdAt: serverTimestamp(),
        createUser: currentUser,
        products: [],
      });
      router.push(`/projects/${docRef.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Container maxW="800px" pt={12}>
        <Box as="h1" color="black" fontWeight="bold">
          学校名＋年度などの一意の名前を登録してください。
        </Box>
        <Flex flexDirection="column" alignItems="left" mt={2} gap={2}>
          <Text>■ 学校名</Text>
          <Input
            type="text"
            placeholder="例）帝塚山大学 心理学学科　春"
            bgColor="white"
            name="title"
            value={inputData.title}
            onChange={handleInputChange}
          />
          {/* <Text mt={2}>■ 説明</Text>
          <Textarea
            placeholder='説明'
            bgColor='white'
            name='desc'
            value={inputData.desc}
            onChange={handleInputChange}
          /> */}
          <Text mt={2}>■ 採寸日</Text>
          <Input
            type="date"
            bgColor="white"
            w={200}
            name="schedule"
            value={inputData.schedule}
            onChange={handleInputChange}
          />
          <Flex w="100%" justifyContent="flex-end" gap={2}>
            <Link href="/dashboard">
              <a>
                <Button variant="outline">戻る</Button>
              </a>
            </Link>
            <Button
              colorScheme="facebook"
              disabled={!inputData.title || !inputData.schedule}
              onClick={addTitle}
            >
              登録
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default New;
