import { Box, Container, Flex, Stack, Text } from '@chakra-ui/react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';

const Completion = () => {
  const router = useRouter();
  const [student, setStudent] = useState<any>();
  const [project, setProject] = useState<any>();

  // 生徒の情報を取得
  useEffect(() => {
    const getStudent = async () => {
      const docRef = doc(
        db,
        'schools',
        `${router.query.id}`,
        'students',
        `${router.query.studentId}`
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudent({ ...docSnap?.data(), id: docSnap.id });
      }
    };
    getStudent();
  }, [router.query.id, router.query.studentId]);

  useEffect(() => {
    const getProject = async () => {
      const unsub = onSnapshot(
        doc(db, 'projects', `${router.query.id}`),
        (doc) => {
          setProject({ ...doc.data(), id: doc.id });
          if (doc.data()?.release === false) {
            router.push('404/notfound');
          }
        }
      );
    };
    getProject();
  }, [router.query.id]);

  return (
    <Container maxW='500px' py={6} minH='100vh'>
      {project?.release && (
        <Box p={6} boxShadow='base' bgColor='white' borderRadius={6}>
          <Text as='h1' textAlign='center' fontWeight='bold' fontSize='2xl'>
            採寸登録が完了しました
          </Text>
          <Text fontSize='sm' mt={6}>
            採寸登録ありがとうございます。こちらの画面が控えになります。
            ご必要な場合はお手数ですが、スクリーンショット又は
            ブックマーク・お気に入り等に登録してください。
          </Text>
          <Box mt={12}>
            <Flex>
              <Box fontWeight='bold' w='90px'>
                学籍番号
              </Box>
              <Box>{student?.studentNumber}</Box>
            </Flex>
            <Flex>
              <Box fontWeight='bold' w='90px'>
                名前
              </Box>
              <Box>{student?.name}</Box>
            </Flex>
            <Stack spacing={3}>
              {student?.products.map(
                (product: {
                  productName: string;
                  quantity: string;
                  inseam: string;
                }) => (
                  <Box key={product.productName} mt={6}>
                    {product.productName && (
                      <Flex>
                        <Box fontWeight='bold' w='90px'>
                          商品名
                        </Box>
                        <Box>{product.productName}</Box>
                      </Flex>
                    )}
                    {product.quantity && (
                      <Flex>
                        <Box fontWeight='bold' w='90px'>
                          数量
                        </Box>
                        <Box>{product.quantity}</Box>
                      </Flex>
                    )}
                    {product.inseam && (
                      <Flex>
                        <Box fontWeight='bold' w='90px'>
                          股下修理
                        </Box>
                        <Box>{product.inseam}</Box>
                      </Flex>
                    )}
                  </Box>
                )
              )}
            </Stack>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Completion;
