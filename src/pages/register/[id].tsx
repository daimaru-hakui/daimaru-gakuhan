/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store";

type ProjectType = {
  id: string;
  title: string;
  name: string;
  desc: string;
  schedule: string;
  signature: string;
  gender: string;
  products: string[];
  release: boolean;
  createdAt: Timestamp;
};

const RegisterId = () => {
  const router = useRouter();
  const projectId = router.query.id;
  const [project, setProject] = useState<ProjectType>();
  const [items, setItems] = useState<any>();
  const setLoading = useSetRecoilState(loadingState);

  // project（個別）を取得
  useEffect(() => {
    const getProject = async () => {
      onSnapshot(doc(db, "projects", `${projectId}`), (doc) => {
        if (doc.data()?.release === false) {
          router.push("/register");
          return;
        }
        setProject({ ...doc.data(), id: doc.id } as ProjectType);
      });
    };
    getProject();
  }, [projectId, router]);

  // 商品登録用 初期値入力
  useEffect(() => {
    setItems({
      ...project,
      gender: "",
      sumTotal: 0,
      products: project?.products?.map((product: any) => {
        const productName = "未記入";
        const price = product.price ? product.price : 0;
        const size = "未記入";
        const quantity = "0";
        const inseam = product.inseam ? "未記入" : null;
        return {
          productName,
          price,
          size,
          quantity,
          inseam,
        };
      }),
    });
  }, [project]);

  // 採寸登録
  const addStudent = async () => {
    const result = window.confirm("登録して宜しいでしょうか");
    if (!result) return;
    setLoading(true);
    let student;
    try {
      student = await addDoc(
        collection(db, "schools", `${projectId}`, "students"),
        {
          ...items,
          title: project?.title,
          projectId: project?.id,
          createdAt: serverTimestamp(),
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      router.push({
        pathname: `/register/measure/${project?.id}`,
        query: { studentId: student?.id },
      });
    }
  };

  // 学籍番号・名前の変更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  //　性別の変更
  const handleRadioChange = (e: string) => {
    const value = e;
    setItems({ ...items, gender: value });
  };

  return (
    <Container maxW="600px" py={6} minH="100vh">
      {project?.release && (
        <>
          {project?.title && (
            <Box
              p={6}
              fontSize="3xl"
              fontWeight="bold"
              bg="white"
              rounded={6}
              boxShadow="base"
            >
              {project?.title}
            </Box>
          )}
          <Box mt={6} p={6} bg="white" rounded={6} boxShadow="base">
            <Text>学籍番号</Text>
            <Input
              type="text"
              mt={2}
              name="studentNumber"
              value={items.studentNumber || ""}
              onChange={handleInputChange}
            />
          </Box>

          <Box mt={6} p={6} bg="white" rounded={6} boxShadow="base">
            <Text>名前</Text>
            <Flex gap={2}>
              <Input
                mt={2}
                type="text"
                placeholder="姓"
                name="lastName"
                value={items.lastName || ""}
                onChange={handleInputChange}
              />
              <Input
                mt={2}
                type="text"
                placeholder="名"
                name="firstName"
                value={items.firstName || ""}
                onChange={handleInputChange}
              />
            </Flex>
          </Box>

          {Number(project?.gender) === 1 && ""}
          {Number(project?.gender) === 2 && (
            <Box mt={6} p={6} bg="white" rounded={6} boxShadow="base">
              <RadioGroup
                name="gender"
                value={items.gender}
                onChange={(e) => handleRadioChange(e)}
              >
                <Stack spacing={5} direction="row">
                  <Radio colorScheme="green" value="1">
                    男性
                  </Radio>
                  <Radio colorScheme="green" value="2">
                    女性
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          )}
          {/* {Number(project?.gender) === 3 && (
            <Box mt={6} p={6} bg="white" rounded={6} boxShadow="base">
              <RadioGroup
                name="gender"
                value={items.gender}
                onChange={(e) => handleRadioChange(e)}
              >
                <Stack spacing={5} direction="row">
                  <Radio colorScheme="green" value="1">
                    男性
                  </Radio>
                  <Radio colorScheme="green" value="2">
                    女性
                  </Radio>
                  <Radio colorScheme="green" value="3">
                    その他
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          )} */}

          <Box mt={6} textAlign="center">
            <Button
              colorScheme="facebook"
              onClick={addStudent}
              disabled={
                !items.firstName ||
                !items.lastName ||
                !items.studentNumber ||
                (Number(project?.gender) === 1 ? null : !items.gender) ||
                !project.release
              }
            >
              採寸を始める
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default RegisterId;
