import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db } from "../../../firebase";
import { currentUserState, loadingState } from "../../../store";

const ColorNew = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingState);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  // カラー登録
  const addColor = async () => {
    setLoading(true);
    const docRef = collection(db, "colors");
    try {
      await addDoc(docRef, {
        title,
        createUser: currentUser,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      router.push("/colors");
    }
  };

  return (
    <Container maxW="600px">
      <Box mt={6} p={6} rounded="md" bg="white" boxShadow="md">
        <Flex alignItems="center" justifyContent="space-between">
          <Box>カラーを登録</Box>
          <Link href="/colors">
            <Button size="sm">一覧へ戻る</Button>
          </Link>
        </Flex>
        <Input
          mt={6}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Box textAlign="center">
          <Button
            mt={6}
            colorScheme="facebook"
            disabled={!title}
            onClick={addColor}
          >
            登録
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ColorNew;
