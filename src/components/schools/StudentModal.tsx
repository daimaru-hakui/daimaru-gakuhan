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
  Stack,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

type Props = {
  projectId: string;
  studentId: string;
  genderDisp: Function;
  TAX: number;
};

const StudentModal: NextPage<Props> = ({
  projectId,
  studentId,
  genderDisp,
  TAX,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [student, setStudent] = useState<any>();

  useEffect(() => {
    const getStudent = async () => {
      const studentRef = doc(
        db,
        "schools",
        `${projectId}`,
        "students",
        `${studentId}`
      );
      const docSnap = await getDoc(studentRef);
      setStudent(docSnap.data());
    };
    getStudent();
  }, [projectId, studentId]);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        colorScheme="facebook"
        onClick={onOpen}
      >
        詳細
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay bg="#000000bf" />
        <ModalContent>
          <ModalHeader>採寸データ</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <Stack>
              <Flex>
                <Box>学籍番号：</Box>
                <Box>{student?.studentNumber}</Box>
              </Flex>
              <Flex>
                <Box>名前：</Box>
                <Box>{student?.name}</Box>
              </Flex>
              <Flex>
                <Box>性別：</Box>
                <Box>{genderDisp(student?.gender)}</Box>
              </Flex>
              {student?.sumTotal && (
                <Flex>
                  <Box>金額：</Box>
                  <Box>
                    {(Number(student?.sumTotal) * TAX).toLocaleString()}円
                  </Box>
                </Flex>
              )}

              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th w="auto">商品名</Th>
                      <Th w="100px">サイズ</Th>
                      <Th w="100px">数量</Th>
                      <Th w="100px">裾上げ</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {student?.products.map((product: any, index: number) => (
                      <Tr key={index}>
                        <Td>{product.productName}</Td>
                        <Td isNumeric>{product.size}</Td>
                        <Td isNumeric>{product.quantity}</Td>
                        <Td isNumeric>
                          {product.inseam ? product.inseam : "なし"}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
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

export default StudentModal;
