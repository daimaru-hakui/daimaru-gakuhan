import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Toast,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { db } from "../../../firebase";
import { loadingState } from "../../../store";

type SignatureType = {
  id: string;
  content: string;
};

const SignatureModal = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signatures, setSignatures] = useState([] as SignatureType[]);
  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    const getSignatures = async () => {
      const q = query(
        collection(db, "signatures"),
        orderBy("createdAt", "desc")
      );
      const querySnap = await getDocs(q);
      setSignatures(
        querySnap.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as SignatureType)
        )
      );
    };
    getSignatures();
  }, []);

  const addProjectSignature = async (content: string) => {
    setLoading(true);
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      await updateDoc(docRef, {
        signature: content,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      toast({
        title: "商品登録を登録しました",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <>
      <Button onClick={onOpen}>選択する</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>署名を選択する</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              justifyContent="center"
              p={6}
              gap={6}
            >
              {signatures?.map((signature: SignatureType) => (
                <Box
                  key={signature.id}
                  p={3}
                  boxShadow="lg"
                  cursor="pointer"
                  border="1px solid white"
                  _hover={{ border: "1px", borderColor: "#1669d8" }}
                  onClick={() => addProjectSignature(signature.content)}
                >
                  <Box whiteSpace="pre-wrap">{signature.content}</Box>
                </Box>
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Link href="/signature/new">
              <a>
                <Button colorScheme="facebook">署名を追加</Button>
              </a>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignatureModal;
