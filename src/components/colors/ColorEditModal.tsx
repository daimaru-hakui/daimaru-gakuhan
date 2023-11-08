import {
  Button,
  Flex,
  Input,
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
  colorId: string;
};

const ColorEditModal: NextPage<Props> = ({ colorId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setLoading = useSetRecoilState(loadingState);
  const [color, setColor] = useState("");
  const [resetColor, setResetColor] = useState("");

  // 署名を取得
  useEffect(() => {
    const getColor = async () => {
      const docRef = doc(db, "colors", `${colorId}`);
      const docSnap = await getDoc(docRef);
      setColor(docSnap?.data()?.title);
      setResetColor(docSnap?.data()?.title);
    };
    getColor();
  }, [colorId]);

  // 署名を編集
  const updateColor = async () => {
    setLoading(true);
    const docRef = doc(db, "colors", `${colorId}`);
    try {
      updateDoc(docRef, {
        title: color,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 署名をリセット
  const resetSignature = () => {
    setColor(resetColor);
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
            <Input
              value={color}
              type="text"
              onChange={(e) => setColor(e.target.value)}
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
                  updateColor();
                  onClose();
                }}
              >
                更新
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ColorEditModal;
