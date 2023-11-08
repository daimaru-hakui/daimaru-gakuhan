import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { db } from "../../../firebase";
import { loadingState } from "../../../store";

type Props = {
  signatureId: string;
};

const SignatureEditModal: NextPage<Props> = ({ signatureId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setLoading = useSetRecoilState(loadingState);
  const [content, setContent] = useState<any>();
  const [resetContent, setResetContent] = useState("");

  // 署名を取得
  useEffect(() => {
    const getSignature = async () => {
      const docRef = doc(db, "signatures", `${signatureId}`);
      const docSnap = await getDoc(docRef);
      setContent(docSnap?.data()?.content);
      setResetContent(docSnap?.data()?.content);
    };
    getSignature();
  }, [signatureId]);

  // 署名を編集
  const updateSignature = async () => {
    setLoading(true);
    const docRef = doc(db, "signatures", `${signatureId}`);
    try {
      updateDoc(docRef, {
        content,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 署名をリセット
  const resetSignature = () => {
    setContent(resetContent);
  };

  return (
    <>
      <FaEdit size="19px" cursor="pointer" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>署名の編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              h="200px"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Flex gap={3}>
              <Button
                variant="outline"
                onClick={() => {
                  resetSignature();
                  onClose();
                }}
              >
                閉じる
              </Button>
              <Button
                colorScheme="facebook"
                onClick={() => {
                  updateSignature();
                  onClose();
                }}
              >
                編集
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignatureEditModal;
