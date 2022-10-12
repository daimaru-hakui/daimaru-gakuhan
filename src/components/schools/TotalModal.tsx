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
      <Flex justifyContent="flex-end">
        <Button colorScheme="facebook" onClick={onOpen}>
          集計
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>集計</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {totals?.map((total: any) => (
              <Box mt={6} key={total}>
                {total.map(
                  (
                    value: {
                      productName: string;
                      size: string;
                      quantity: number;
                      sum: number;
                    },
                    index: number,
                    array: []
                  ) => (
                    <Box key={value.size}>
                      {index === 0 && (
                        <Box fontWeight="bold">{value.productName} </Box>
                      )}
                      <Flex mt={1}>
                        <Box w={10}>{value.size}</Box>
                        <Box w={10} textAlign="right">
                          {value.quantity}
                        </Box>
                      </Flex>
                      {index === array.length - 1 && (
                        <Flex
                          mt={1}
                          py={1}
                          borderTop="1px"
                          borderColor="gray.200"
                        >
                          <Box w={10}>合計</Box>
                          <Box w={10} textAlign="right">
                            {value.sum}
                          </Box>
                        </Flex>
                      )}
                    </Box>
                  )
                )}
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
