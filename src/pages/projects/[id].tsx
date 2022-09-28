import {
  Box,
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
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import InputModal from "../../components/InputModal";

const ProjectId = () => {
  const router = useRouter();

  const [project, setProject] = useState<any>({
    title: "",
    desc: "",
    schedule: "",
    createdAt: "",
    products: [
      { id: 0, productName: "", size: [] },
      { id: 1, productName: "", size: [] },
      { id: 2, productName: "", size: [] },
      { id: 3, productName: "", size: [] },
      { id: 4, productName: "", size: [] },
    ],
  });

  //projectデータを取得
  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, "projects", `${router.query.id}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw "プロジェクトがありません。";
      }
      setProject(docSnap.data());
    };
    getProject();
  }, [router.query.id]);

  return (
    <>
      <Box bgColor="white" boxShadow="xs">
        <Container maxW="800px" py={{ base: 6, md: 10 }}>
          <Text fontSize="3xl" fontWeight="bold">
            {project?.title}
          </Text>
        </Container>
      </Box>
      <Container maxW="800px" pt={6}>
        {project.desc && (
          <Box p={6} bgColor="white" borderRadius={6} boxShadow="base">
            {project?.desc}
          </Box>
        )}
        {project.schedule && (
          <Box p={6} mt={6} bgColor="white" borderRadius={6} boxShadow="base">
            <Box>採寸日：{project?.schedule}</Box>
          </Box>
        )}
        <Box p={6} mt={6} bgColor="white" borderRadius={6} boxShadow="base">
          <Box fontWeight="bold">商品登録</Box>
          <Box mt={2}>
            以下のボタンをクリックして採寸する商品を追加してください。
          </Box>

          <TableContainer mt={6}>
            <Table variant="simple">
              {project.products.length > 0 && (
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
                {[...Array(5)].map((i: number, index: number) => (
                  <Tr key={i} mt={6}>
                    {project?.products[index] && (
                      <>
                        <Td mr={2}>{project?.products[index].productName}</Td>
                        <Td>
                          <HStack>
                            {project?.products[index].size?.map(
                              (size: string) => (
                                <Box key={size} mr={2}>
                                  {size}
                                </Box>
                              )
                            )}
                          </HStack>
                        </Td>
                        <Td>
                          {Number(project?.products[index].type) === 1
                            ? "あり"
                            : "なし"}
                        </Td>
                        <Td>
                          <InputModal
                            productIndex={index}
                            buttonDesign={"edit"}
                          />
                        </Td>
                      </>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {[...Array(5)].map((i: number, index: number) => (
            <Box key={i} mt={6}>
              {!project?.products[index] &&
                project?.products.length === index && (
                  <InputModal productIndex={index} buttonDesign={"add"} />
                )}
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default ProjectId;
