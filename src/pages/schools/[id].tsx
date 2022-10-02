import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { db } from '../../../firebase';
import { currentUserAuth } from '../../../store';

const SchoolId = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserAuth);
  const [students, setStudents] = useState<any>();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    const getStudents = async () => {
      const q = query(
        collection(db, 'schools', `${router.query.id}`, 'students')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setStudents(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    };
    getStudents();
  }, [router.query.id]);

  // 生徒の登録情報を削除
  const deleteStudent = (studentId: string) => {
    const result = window.confirm('削除して宜しいでしょうか');
    if (!result) return;
    deleteDoc(doc(db, 'schools', `${router.query.id}`, 'students', studentId));
  };

  console.log(students);
  const genderDisp = (gender: string) => {
    switch (gender) {
      case '1':
        return '男性';
      case '2':
        return '女性';
      default:
        return '未記入';
    }
  };

  return (
    <Container maxW='1200px' py={6}>
      <TableContainer>
        <Table variant='striped' colorScheme='gray'>
          <Thead>
            <Tr>
              <Th>学籍番号</Th>
              <Th>名前</Th>
              <Th>性別</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students?.map((student: any) => (
              <Tr key={student.id}>
                <Td>{student.studentNumber}</Td>
                <Td>{student.name}</Td>
                <Td>{genderDisp(student.gender)}</Td>
                <Td mr={2}>
                  <Flex>
                    {student.products.map((product: any) => (
                      <Flex key={product.productName} mr={12}>
                        <Box mr={6}>{product.productName}</Box>
                        <Box w='80px' textAlign='center'>
                          {product.size}
                        </Box>
                        <Box w='50px' textAlign='right'>
                          {product.quantity}
                        </Box>
                      </Flex>
                    ))}
                  </Flex>
                </Td>
                <Td>
                  <Button
                    colorScheme='red'
                    onClick={() => deleteStudent(student.id)}
                  >
                    削除
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SchoolId;
