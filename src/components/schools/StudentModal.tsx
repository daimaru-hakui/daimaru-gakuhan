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
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import QRCode from 'qrcode.react';

type Props = {
  projectId: string;
  studentId: string;
  genderDisp: Function;
};

const StudentModal: NextPage<Props> = ({
  projectId,
  studentId,
  genderDisp,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [student, setStudent] = useState<any>();

  useEffect(() => {
    const getStudent = async () => {
      const studentRef = doc(
        db,
        'schools',
        `${projectId}`,
        'students',
        `${studentId}`
      );
      onSnapshot(studentRef, (querySnapshot) => {
        setStudent({ ...querySnapshot?.data() });
      });
    };
    getStudent();
  }, [projectId, studentId]);

  return (
    <>
      <Button
        size='sm'
        variant='outline'
        colorScheme='facebook'
        onClick={onOpen}
      >
        詳細
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size='4xl'>
        <ModalOverlay bg='#000000bf' />
        <ModalContent>
          <ModalHeader>採寸データ</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <Flex justifyContent='space-between'>
              <Stack>
                <Flex>
                  <Box>学籍番号：</Box>
                  <Box>{student?.studentNumber}</Box>
                </Flex>
                <Flex>
                  <Box>名前：</Box>
                  <Box>{`${student?.lastName} ${student?.firstName}`}</Box>
                </Flex>
                <Flex>
                  <Box>性別：</Box>
                  <Box>{genderDisp(student?.gender)}</Box>
                </Flex>
                {student?.sumTotal && (
                  <Flex>
                    <Box>金額：</Box>
                    <Box>
                      {Math.round(Number(student?.sumTotal)).toLocaleString()}円
                    </Box>
                  </Flex>
                )}
                <Flex>
                  <Box>Email：</Box>
                  <Box>{student?.email}</Box>
                </Flex>
              </Stack>
              <Box textAlign='center'>
                <QRCode
                  value={`${location.origin}/register/measure/${projectId}?studentId=${studentId}/`}
                  renderAs='canvas'
                  size={100}
                />
                <Text mt={1} fontSize='xs'>
                  もう一度採寸 QR
                </Text>
              </Box>
            </Flex>
            <TableContainer mt={6}>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th w='auto'>商品名</Th>
                    <Th w='100px'>サイズ</Th>
                    <Th w='100px'>数量</Th>
                    <Th w='100px'>裾上げ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {student?.products?.map((product: any, index: number) => (
                    <Tr key={index}>
                      <Td>{product.productName}</Td>
                      <Td isNumeric>{product.size}</Td>
                      <Td isNumeric>{product.quantity}</Td>
                      <Td isNumeric>
                        {product.inseam ? product.inseam : 'なし'}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
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
