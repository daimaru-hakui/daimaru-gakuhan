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
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import QRCode from "qrcode.react";
import { FaQrcode } from "react-icons/fa";
import { NextPage } from "next";

type Props = {
  projectId: string;
};

const QrModal: NextPage<Props> = ({ projectId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <FaQrcode onClick={onOpen} cursor="pointer" />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w="100%"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <QRCode
                // value={`${location.host}${projectId}/`}
                value={`${location.origin}${projectId}/`}
                renderAs="canvas"
                size={250}
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QrModal;
