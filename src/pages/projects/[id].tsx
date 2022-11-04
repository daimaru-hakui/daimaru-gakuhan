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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { FaTrashAlt, FaTimes, FaRegCircle, FaEdit } from "react-icons/fa";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db, storage } from "../../../firebase";
import { currentUserAuth, projectsState } from "../../../store";
import InputModal from "../../components/projects/InputModal";
import { deleteObject, ref } from "firebase/storage";
import SignatureModal from "../../components/projects/SignatureModal";

const ProjectId = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserAuth);
  const [editTitle, setEditTitle] = useState(false);
  const toast = useToast();
  const projects = useRecoilValue(projectsState);
  const [students, setStudents] = useState<any>();
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

  // studentsデータを取得（採寸したデータ）
  useEffect(() => {
    const getSchool = async () => {
      const studentsCollectionRef = collection(
        db,
        "schools",
        `${router.query.id}`,
        "students"
      );
      const querySnapshot = await getDocs(studentsCollectionRef);
      setStudents(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    };
    getSchool();
  }, [router.query.id]);

  ////////// productを削除//////////
  const deleteProduct = async (productIndex: number) => {
    const result = window.confirm("削除して宜しいでしょうか");
    if (!result) return;

    // サイズスペック画像の削除
    if (project.products[productIndex]?.sizePath) {
      const sizePathRef = ref(
        storage,
        `${project.products[productIndex]?.sizePath}`
      );
      await deleteObject(sizePathRef);
    }

    // イメージ画像の削除
    if (project.products[productIndex]?.imagePath) {
      const imagePathRef = ref(
        storage,
        `${project.products[productIndex]?.imagePath}`
      );
      await deleteObject(imagePathRef);
    }

    // データベースから商品を削除
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

  // スケジュール変更
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

  //　性別記入を変更
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

  const deleteSignature = async () => {
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      await updateDoc(docRef, {
        signature: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box bg="white" boxShadow="xs">
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
          <Box p={6} bg="white" borderRadius={6} boxShadow="base">
            {project?.desc}
          </Box>
        )}
        {project?.schedule && (
          <Box p={6} mt={6} bg="white" borderRadius={6} boxShadow="base">
            <Box fontWeight="bold">採寸日</Box>
            <Input
              mt={2}
              type="date"
              value={project?.schedule}
              onChange={(e) => handleScheduleChange(e, "schedule")}
            />
          </Box>
        )}

        <Box p={6} mt={6} bg="white" borderRadius={6} boxShadow="base">
          <Box fontWeight="bold">署名選択</Box>
          {project?.signature && (
            <Box
              mt={2}
              p={6}
              rounded="md"
              whiteSpace="pre-wrap"
              border="1px"
              borderColor="gray.200"
            >
              {project?.signature}
            </Box>
          )}
          <Box mt={2} textAlign={project?.signature ? "right" : "left"}>
            {project?.signature && (
              <Button mr={2} colorScheme="red" onClick={deleteSignature}>
                削除
              </Button>
            )}
            <SignatureModal />
          </Box>
        </Box>
        {students?.length === 0 ? (
          <>
            <Box p={6} mt={6} bg="white" borderRadius={6} boxShadow="base">
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

            <Box p={6} mt={6} bg="white" borderRadius={6} boxShadow="base">
              <Box fontWeight="bold">商品登録</Box>
              <Box mt={2}>
                以下のボタンをクリックして採寸する商品を追加してください。
              </Box>

              <TableContainer mt={6}>
                <Table variant="simple">
                  {project?.products?.length > 0 && (
                    <Thead>
                      <Tr>
                        <Th>商品名</Th>
                        <Th>金額</Th>
                        <Th>サイズ展開</Th>
                        <Th>数量入力</Th>
                        <Th>股下修理</Th>
                        <Th>編集・削除</Th>
                      </Tr>
                    </Thead>
                  )}
                  <Tbody>
                    {Object.keys([...Array(9)]).map(
                      (i: string, index: number) => (
                        <Tr key={i} mt={6}>
                          {project?.products[index] && (
                            <>
                              <Td mr={2}>
                                {project?.products[index].productName}
                              </Td>
                              <Td mr={2}>
                                {project?.products[index].price ? (
                                  <>
                                    {Number(
                                      project?.products[index].price
                                    )?.toLocaleString()}
                                    円
                                  </>
                                ) : (
                                  "未登録"
                                )}
                              </Td>
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
                                {Number(project?.products[index].quantity) ===
                                1 ? (
                                  <FaRegCircle />
                                ) : (
                                  <FaTimes />
                                )}
                              </Td>
                              <Td>
                                {Number(project?.products[index].inseam) ===
                                1 ? (
                                  <FaRegCircle />
                                ) : (
                                  <FaTimes />
                                )}
                              </Td>
                              <Td>
                                <HStack spacing={6}>
                                  <InputModal
                                    productIndex={index}
                                    buttonDesign="edit"
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
                      )
                    )}
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
          </>
        ) : (
          <Box
            p={6}
            mt={6}
            bg="white"
            rounded="md"
            boxShadow="base"
            textAlign="center"
          >
            採寸データが入力されているため編集できません。
          </Box>
        )}
      </Container>
    </>
  );
};

export default ProjectId;
