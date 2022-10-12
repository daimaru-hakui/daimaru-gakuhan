import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  textDecoration,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { FaTrashAlt, FaTimes, FaRegCircle, FaEdit } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db } from "../../../firebase";
import { currentUserAuth, loadingState, projectsState } from "../../../store";
import InputModal from "../../components/InputModal";

const ProjectId = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserAuth);
  const [editTitle, setEditTitle] = useState(false);
  const toast = useToast();
  const projects = useRecoilValue(projectsState);
  const [project, setProject] = useState<any>({
    title: "",
    desc: "",
    schedule: "",
    createdAt: "",
    products: [],
  });

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
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
    const result = window.confirm("削除して宜しいでしょうか");
    if (!result) return;
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      if (project.products[productIndex]) {
        const productsArray = project.products.filter(
          (product: any, index: number) => index !== productIndex && true
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

  // タイトルを編集
  const updateTitle = async () => {
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      await updateDoc(docRef, {
        title: project.title,
      });
    } catch (err) {
      console.log(err);
    } finally {
      toast({
        title: "タイトルを変更しました",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setProject({ ...project, [name]: value });
  };

  const handleScheduleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = e.target.value;
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      updateDoc(docRef, {
        [type]: value,
      });
    } catch (err) {
      console.log(err);
    } finally {
      toast({
        title: "採寸予定日を変更しました",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleRadioChange = (e: string, type: string) => {
    const value = e;
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      updateDoc(docRef, {
        [type]: value,
      });
    } catch (err) {
      console.log(err);
    } finally {
      toast({
        title: "性別記入を変更しました",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box bgColor="white" boxShadow="xs">
        <Container maxW="1000px" py={{ base: 6, md: 10 }}>
          {editTitle ? (
            <Box>
              <Input
                name="title"
                value={project?.title}
                onChange={handleInputChange}
              />
              <Box mt={3} textAlign="right">
                <Button mr={2} onClick={() => setEditTitle((prev) => !prev)}>
                  キャンセル
                </Button>
                <Button
                  colorScheme="facebook"
                  onClick={() => {
                    updateTitle();
                    setEditTitle((prev) => !prev);
                  }}
                >
                  OK
                </Button>
              </Box>
            </Box>
          ) : (
            <Flex alignItems="center">
              <Text mr={2} fontSize="3xl" fontWeight="bold">
                {project?.title}
              </Text>
              <FaEdit
                cursor="pointer"
                onClick={() => setEditTitle((prev) => !prev)}
              />
            </Flex>
          )}
        </Container>
      </Box>
      <Container maxW="1000px" py={6}>
        {project?.desc && (
          <Box p={6} bgColor="white" borderRadius={6} boxShadow="base">
            {project?.desc}
          </Box>
        )}
        {project?.schedule && (
          <Box p={6} mt={6} bgColor="white" borderRadius={6} boxShadow="base">
            <Box fontWeight="bold">採寸日</Box>
            <Input
              mt={2}
              type="date"
              value={project?.schedule}
              onChange={(e) => handleScheduleChange(e, "schedule")}
            />
          </Box>
        )}
        <Box p={6} mt={6} bgColor="white" borderRadius={6} boxShadow="base">
          <RadioGroup
            value={project?.gender}
            onChange={(e) => handleRadioChange(e, "gender")}
          >
            <Box fontWeight="bold">性別記入</Box>
            <Stack direction={["column", "row"]} mt={2}>
              <Radio value="1" pr={6}>
                なし
              </Radio>
              <Radio value="2" pr={6}>
                男性・女性
              </Radio>
              <Radio value="3">男性・女性・その他</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Box p={6} mt={6} bgColor="white" borderRadius={6} boxShadow="base">
          <Box fontWeight="bold">商品登録</Box>
          <Box mt={2}>
            以下のボタンをクリックして採寸する商品を追加してください。
          </Box>

          <TableContainer mt={6}>
            <Table variant="simple">
              {project?.products.length > 0 && (
                <Thead>
                  <Tr>
                    <Th>商品名</Th>
                    <Th>サイズ展開</Th>
                    <Th>数量入力</Th>
                    <Th>股下修理</Th>
                    <Th>編集・削除</Th>
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
                          <Breadcrumb cursor="default">
                            {project?.products[index].size?.map(
                              (size: string) => (
                                <BreadcrumbItem key={size}>
                                  <BreadcrumbLink
                                    cursor="default"
                                    style={{ textDecoration: "none" }}
                                  >
                                    {size}
                                  </BreadcrumbLink>
                                </BreadcrumbItem>
                              )
                            )}
                          </Breadcrumb>
                        </Td>
                        <Td>
                          {Number(project?.products[index].quantity) === 1 ? (
                            <FaRegCircle />
                          ) : (
                            <FaTimes />
                          )}
                        </Td>
                        <Td>
                          {Number(project?.products[index].inseam) === 1 ? (
                            <FaRegCircle />
                          ) : (
                            <FaTimes />
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={6}>
                            <InputModal
                              productIndex={index}
                              buttonDesign={"edit"}
                            />
                            <FaTrashAlt
                              cursor="pointer"
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
          {Object.keys([...Array(9)]).map((i: string, index: number) => (
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
