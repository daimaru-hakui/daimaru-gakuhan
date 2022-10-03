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
  const [tableTitle, setTableTitle] = useState<any>();

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

  useEffect(() => {
    setTableTitle(
      students?.find((student: any, index: number) => {
        if (index === 0) return true;
      })
    );
  }, [students]);
  console.log(tableTitle);

  return (
    <Container maxW='1200px' py={6}>
      <TableContainer>
        <Table variant='striped' colorScheme='gray'>
          <Thead>
            <Tr>
              <Th>{tableTitle?.studentNumber && '学生番号'}</Th>
              <Th>{tableTitle?.name && '名前'}</Th>
              <Th>{tableTitle?.gender && '性別'}</Th>
              {tableTitle?.products.map(
                (product: {
                  productName: string;
                  size: string[];
                  quantity: string;
                  inseam: string;
                }) => (
                  <React.Fragment key={product.productName}>
                    <Th w='80px'>{product?.productName && '商品名'}</Th>
                    <Th w='80px'>{product?.size && 'サイズ'}</Th>
                    <Th w='50px'>{product?.quantity && '数量'}</Th>
                    <Th w='50px'>{product?.inseam && '股下修理'}</Th>
                  </React.Fragment>
                )
              )}
            </Tr>
          </Thead>
          <Tbody>
            {students?.map((student: any) => (
              <Tr key={student.id}>
                <Td>{student.studentNumber}</Td>
                <Td>{student.name}</Td>
                <Td>{genderDisp(student.gender)}</Td>
                {student.products.map((product: any) => (
                  <React.Fragment key={product.productName}>
                    <Td w='80px'>{product.productName}</Td>
                    <Td w='80px' textAlign='center'>
                      {product.size}
                    </Td>
                    <Td w='50px' textAlign='right'>
                      {product.quantity}
                    </Td>
                    <Td w='50px' textAlign='right'>
                      {product.inseam}
                    </Td>
                  </React.Fragment>
                ))}
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
