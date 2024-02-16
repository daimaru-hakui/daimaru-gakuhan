/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import { NextRouter } from "next/router";
import React from "react";
import { db } from "../../../firebase";
import { addresses } from "../../utils";
import axios from "axios";

type Props = {
  items: any;
  setItems: Function;
  student: any;
  project: any;
  router: NextRouter;
};

const InputEditModal: NextPage<Props> = ({
  items,
  setItems,
  student,
  project,
  router,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const studentId = router.query.studentId;

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

  // 学籍番号と名前と性別を更新
  const updateStudent = async () => {
    try {
      await updateDoc(
        doc(db, "schools", `${project.id}`, "students", `${studentId}`),
        {
          studentNumber: items.studentNumber,
          serialNumber: serialNumber(items?.studentNumber) || "",
          firstName: items.firstName,
          lastName: items.lastName,
          gender: items.gender,
          postCode: items.postCode,
          address1: items.address1,
          address2: items.address2,
          address3: items.address3,
          address4: items.address4,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      window.location.reload();
    }
  };

  // 編集をキャンセル
  const cancel = () => {
    const getStudent = async () => {
      const docRef = doc(
        db,
        "schools",
        `${project.id}`,
        "students",
        `${studentId}`
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItems({
          ...items,
          studentNumber: docSnap?.data().studentNumber,
          firstName: docSnap?.data().firstName,
          lastName: docSnap?.data().lastName,
          gender: docSnap?.data().gender,
        });
      }
    };
    getStudent();
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

  return (
    <>
      <Button size="xs" onClick={onOpen}>
        編集
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
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
                    type="text"
                    mt={2}
                    name="lastName"
                    value={items.lastName || ""}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="text"
                    mt={2}
                    name="firstName"
                    value={items.firstName || ""}
                    onChange={handleInputChange}
                  />
                </Flex>
              </Box>
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
                </Box>
              )}

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
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                cancel();
                onClose();
              }}
            >
              キャンセル
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                updateStudent();
                onClose();
              }}
            >
              更新する
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InputEditModal;
