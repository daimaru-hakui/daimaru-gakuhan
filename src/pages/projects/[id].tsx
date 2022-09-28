import {
  Box,
  Button,
  Container,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { db } from '../../../firebase';
import { currentUserAuth, projectsState } from '../../../store';
import InputModal from '../../components/InputModal';

const ProjectId = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserAuth);
  const projects = useRecoilValue(projectsState);
  const [project, setProject] = useState<any>({
    title: '',
    desc: '',
    schedule: '',
    createdAt: '',
    products: [],
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // project（個別）データを取得
  useEffect(() => {
    const getProject = async () => {
      setProject(
        projects.find((project: { id: string }) => {
          if (project.id === `${router.query.id}`) return true;
        })
      );
    };
    getProject();
  }, [router.query.id, projects]);

  // productを削除
  const deleteProduct = async (productIndex: number) => {
    const docRef = doc(db, 'projects', `${router.query.id}`);
    try {
      if (project.products[productIndex]) {
        const productsArray = project.products.filter(
          (product: string, index: number) =>
            index === productIndex ? false : true
        );
        await updateDoc(docRef, {
          ...project,
          products: productsArray,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box bgColor='white' boxShadow='xs'>
        <Container maxW='800px' py={{ base: 6, md: 10 }}>
          <Text fontSize='3xl' fontWeight='bold'>
            {project?.title}
          </Text>
        </Container>
      </Box>
      <Container maxW='900px' py={6}>
        {project?.desc && (
          <Box p={6} bgColor='white' borderRadius={6} boxShadow='base'>
            {project?.desc}
          </Box>
        )}
        {project?.schedule && (
          <Box p={6} mt={6} bgColor='white' borderRadius={6} boxShadow='base'>
            <Box>採寸日：{project?.schedule}</Box>
          </Box>
        )}
        <Box p={6} mt={6} bgColor='white' borderRadius={6} boxShadow='base'>
          <Box fontWeight='bold'>商品登録</Box>
          <Box mt={2}>
            以下のボタンをクリックして採寸する商品を追加してください。
          </Box>

          <TableContainer mt={6}>
            <Table variant='simple'>
              {project?.products.length > 0 && (
                <Thead>
                  <Tr>
                    <Th>商品名</Th>
                    <Th>サイズ展開</Th>
                    <Th>数量入力</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
              )}
              <Tbody>
                {[...Array(9)].map((i: number, index: number) => (
                  <Tr key={i} mt={6}>
                    {project?.products[index] && (
                      <>
                        <Td mr={2}>{project?.products[index].productName}</Td>
                        <Td>
                          <HStack spacing={2}>
                            {project?.products[index].size?.map(
                              (size: string) => (
                                <Box key={size}>{size}</Box>
                              )
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          {Number(project?.products[index].type) === 1
                            ? 'あり'
                            : 'なし'}
                        </Td>
                        <Td>
                          <HStack spacing={6}>
                            <InputModal
                              productIndex={index}
                              buttonDesign={'edit'}
                            />
                            <FaTrashAlt
                              cursor='pointer'
                              onClick={() => deleteProduct(index)}
                            />
                          </HStack>
                        </Td>
                      </>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {[...Array(9)].map((i: number, index: number) => (
            <Box key={i} mt={6}>
              {!project?.products[index] &&
                project?.products.length === index && (
                  <InputModal productIndex={index} buttonDesign={'add'} />
                )}
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default ProjectId;
