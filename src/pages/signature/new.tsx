import { Box, Button, Container, Textarea } from "@chakra-ui/react";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db } from "../../../firebase";
import { currentUserAuth, loadingState } from "../../../store";

const SignatureNew = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserAuth);
  const setLoading = useSetRecoilState(loadingState);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  // 署名登録
  const addSignature = async () => {
    setLoading(true);
    const docRef = collection(db, "signatures");
    try {
      await addDoc(docRef, {
        content,
        currentUser,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      router.push("/signature");
    }
  };

  return (
    <Container maxW="600px">
      <Box mt={6} p={6} rounded="md" bg="white">
        署名登録
        <Textarea
          mt={6}
          h="200px"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Box textAlign="center">
          <Button
            mt={6}
            colorScheme="facebook"
            disabled={!content}
            onClick={addSignature}
          >
            登録
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignatureNew;
