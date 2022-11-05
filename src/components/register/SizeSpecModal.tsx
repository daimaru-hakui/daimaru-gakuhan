/* eslint-disable @next/next/no-img-element */
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
  useDisclosure,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';

type Props = {
  sizeUrl: string;
};

const SizeSpecModal: NextPage<Props> = ({ sizeUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button size='xs' onClick={onOpen}>
        サイズ表
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>サイズスペック</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent='center'>
              <img src={sizeUrl} alt={sizeUrl} />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SizeSpecModal;
