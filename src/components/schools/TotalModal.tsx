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
import { NextPage } from "next";
import React from "react";

type Props = {
  totals: string[];
};

const TotalModal: NextPage<Props> = ({ totals }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        集計
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>集計</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {totals?.map((total: any) => (
              <Box mt={6} key={total}>
                {total.map((value: any, index: number) => (
                  <Box key={value.size}>
                    <Box fontWeight="bold">
                      {index === 0 && value.productName}
                    </Box>
                    <Flex mt={1}>
                      <Box w={6} ml={3}>
                        {value.size}
                      </Box>
                      <Box>{value.quantity}</Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TotalModal;
