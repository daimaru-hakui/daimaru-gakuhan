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
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store";
import { ProjectType } from "../../types/ProjectType";
import { addresses } from "../../utils";
import axios from "axios";

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
      postCode: "",

      address1: "",
      address2: "",
      address3: "",
      address4: "",
      tel1: "",
      tel2: "",
      tel3: "",

      products: project?.products?.map((product: any) => {
        const productName = "未記入";
        const price = product.price ? product.price : 0;
        const size = "未記入";
        const quantity = "0";
        const color = product.color || product.colorA ? "未記入" : null;
        const inseam = product.inseam || product.inseamA ? "未記入" : null;
        return {
          productName,
          price,
          size,
          quantity,
          color,
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
          gender: items?.gender || "1",
          serialNumber: serialNumber(items?.studentNumber) || "",
          title: project?.title,
          projectId: project?.id,
          tel1: items.tel1,
          tel2: items.tel2,
          tel3: items.tel3,
          address1: items.address1,
          address2: items.address2,
          address3: items.address3,
          address4: items.address4,
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  //学籍番号の数字を抜き出す
  const serialNumber = (str: string) => {
    const regex = /[^0-9]/g;
    const result = str.replace(regex, "");
    const number = parseInt(result);
    return number;
  };

  const getAddress = async (postNum: string) => {
    postNum = postNum
      .replace(/[０-９]/g, function (s: any) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      })
      .replace(/[- ー]/g, "");
    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postNum}`;
    const res = await axios(url);
    const data = await res.data;
    if (!data) return;
    const address1 = data.results[0].address1;
    const address2 = data.results[0].address2;
    const address3 = data.results[0].address3;
    setItems({ ...items, postCode: postNum, address1, address2, address3 });
  };

  console.log(items);

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
          {Number(project?.isAddress) === 1 && (
            <Box mt={6} p={6} bg="white" rounded={6} boxShadow="base">
              <Flex gap={6}>
                <Box w="full">
                  <Text>〒番号</Text>
                  <Flex mt={2} gap={2}>
                    <Input
                      w="full"
                      name="postCode"
                      value={items.postCode}
                      onChange={handleInputChange}
                    />
                    <Button onClick={() => getAddress(items.postCode)}>
                      検索
                    </Button>
                  </Flex>
                </Box>
                <Box w="full">
                  <Text>都道府県</Text>
                  <Select
                    mt={2}
                    w="full"
                    name="address1"
                    value={items.address1}
                    onChange={handleSelectChange}
                  >
                    <option>選択してください</option>
                    {addresses.map((address) => (
                      <option key={address} value={address}>
                        {address}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
              <Text mt={3}>市区町村</Text>
              <Input
                mt={2}
                name="address2"
                value={items.address2}
                onChange={handleInputChange}
              />
              <Text mt={3}>町域・番地</Text>
              <Input
                mt={2}
                name="address3"
                value={items.address3}
                onChange={handleInputChange}
              />
              <Text mt={3}>建物など</Text>
              <Input
                mt={2}
                name="address4"
                value={items.address4}
                onChange={handleInputChange}
              />
              <Flex align="center" mt={3}>
                <Text>Tel</Text>
                <Box fontSize="xs" mt={1} ml={3}>
                  (半角数字 ハイフン（-）無しで入力)
                </Box>
              </Flex>
              <Flex gap={3} mt={2} align="center">
                <Input
                  maxW={70}
                  type="number"
                  name="tel1"
                  value={items.tel1}
                  onChange={handleInputChange}
                />
                <Box pb={1}>-</Box>
                <Input
                  maxW={90}
                  type="number"
                  name="tel2"
                  value={items.tel2}
                  onChange={handleInputChange}
                />
                <Box pb={1}>-</Box>
                <Input
                  maxW={90}
                  type="number"
                  name="tel3"
                  value={items.tel3}
                  onChange={handleInputChange}
                />
              </Flex>
            </Box>
          )}

          <Box mt={6} textAlign="center">
            <Button
              colorScheme="facebook"
              onClick={addStudent}
              disabled={
                !items.firstName ||
                !items.lastName ||
                !items.studentNumber ||
                (Number(project?.gender) === 1 ? null : !items.gender) ||
                (Number(project?.isAddress) === 0 ? null : !items.address2) ||
                (Number(project?.isAddress) === 0 ? null : !items.tel1) ||
                (Number(project?.isAddress) === 0 ? null : !items.tel2) ||
                (Number(project?.isAddress) === 0 ? null : !items.tel3) ||
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
