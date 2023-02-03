import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Input,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import QRCode from "qrcode.react";
import emailjs from "@emailjs/browser";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store";

type Props = {
  projectId: string;
  studentId: string;
  genderDisp: Function;
  students: any;
};

const StudentModal: NextPage<Props> = ({
  projectId,
  studentId,
  genderDisp,
  students,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setLoading = useSetRecoilState(loadingState);
  const [student, setStudent] = useState<any>();
  const [studentIdTemp, setStudentIdTemp] = useState(studentId);
  const [studentNumOrder, setStudentNumOrder] = useState(0);
  const [send, setSend] = useState({
    email: "",
    title: "",
    content: "",
    studentNumber: "",
    lastName: "",
    firstName: "",
    sumTotal: "",
    signature: "",
  });
  const form = useRef<HTMLFormElement>(
    null
  ) as React.MutableRefObject<HTMLFormElement>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSend({ ...send, [name]: value });
  };

  // 生徒の情報を取得
  useEffect(() => {
    const getStudent = async () => {
      const studentRef = doc(
        db,
        "schools",
        `${projectId}`,
        "students",
        `${studentIdTemp}`
      );
      onSnapshot(studentRef, (querySnapshot) => {
        setStudent({ ...querySnapshot?.data() });
      });
    };
    getStudent();
  }, [projectId, studentIdTemp]);

  // リストの順番を取得
  useEffect(() => {
    const array = students.map((student: any) => student.id);
    let studentIndex = array?.indexOf(studentIdTemp) + 1;
    setStudentNumOrder(studentIndex);
  }, [studentIdTemp, students]);

  // 次の生徒を取得
  const getNextStudent = () => {
    const array = students.map((student: any) => student.id);
    let studentIndex = array?.indexOf(studentIdTemp);
    if (array.length === studentIndex + 1) return;
    setStudentIdTemp(array[studentIndex + 1]);
  };

  // 前の生徒を取得
  const getPrevStudent = () => {
    const array = students.map((student: any) => student.id);
    let studentIndex = array?.indexOf(studentIdTemp);
    if (studentIndex === 0) return;
    setStudentIdTemp(array[studentIndex - 1]);
  };

  // 生徒インデックスをリセット
  const resetStudentIndex = () => {
    setStudentIdTemp(studentId);
    setStudentNumOrder(0);
  };

  // emailで送る内容をstateで管理
  useEffect(() => {
    let content: string[] = [];
    student?.products.forEach(
      (product: {
        productName: string;
        size: string;
        quantity: string;
        inseam: string;
      }) => {
        let row: string;
        row =
          "<div>" +
          (product.productName
            ? `<div>商品名 ${product.productName}</div>`
            : "") +
          (product.size ? `<div>サイズ ${product.size}</div>` : "") +
          (product.quantity ? `<div>数量 ${product.quantity}</div>` : "") +
          (product.inseam ? `<div>裾上げ ${product.inseam}</div>` : "") +
          "</div>";
        content.push(row + "<br/>");
      }
    );
    let signature = student?.signature.split("\n");
    signature = `<div>${signature?.join("<br/>")}</div>`;
    setSend({
      ...send,
      content: content.join("").trim(),
      signature,
      title: student?.title,
      studentNumber: student?.studentNumber,
      firstName: student?.firstName,
      lastName: student?.lastName,
      sumTotal: student?.sumTotal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.products]);

  // 確認メール関数
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const PUBLIC_KEY = "user_7yd9EbIQJSbzjqGUXUbJt";
    const SERVICE_ID = "service_764mpxv";
    const TEMPLATE_ID = "template_70iyw39";
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        (result) => {
          window.alert("確認メールを送信致しました。");
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      )
      .finally(() => {
        updateStudent();
        setLoading(false);
        setSend({ ...send, email: "" });
      });
  };

  // 確認メールを送る
  const handleSendClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = window.confirm(
      `以下のメールアドレス宛にお送りして宜しいでしょうか。\n${send?.email}`
    );
    if (!result) return;
    sendEmail(e);
  };

  // emailアドレス正規表現
  const isValid = (email: string) => {
    const regex =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    const result = regex.test(email);
    return result;
  };

  // emailアドレスを更新
  const updateStudent = async () => {
    try {
      await updateDoc(
        doc(db, "schools", `${student.projectId}`, "students", `${student.id}`),
        {
          email: send.email,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        colorScheme="facebook"
        onClick={onOpen}
      >
        詳細
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetStudentIndex();
          onClose();
        }}
        size="4xl"
      >
        <ModalOverlay bg="#000000bf" />
        <ModalContent>
          <ModalHeader>採寸データ</ModalHeader>

          <ModalCloseButton />
          <ModalBody p={6}>
            <Flex justifyContent="space-between">
              <Stack>
                <Flex>
                  <Box>学籍番号：</Box>
                  <Box>{student?.studentNumber}</Box>
                </Flex>
                <Flex>
                  <Box>名前：</Box>
                  <Box>{`${student?.lastName} ${student?.firstName}`}</Box>
                </Flex>
                <Flex>
                  <Box>性別：</Box>
                  <Box>{genderDisp(student?.gender)}</Box>
                </Flex>
                {student?.sumTotal && (
                  <Flex>
                    <Box>金額：</Box>
                    <Box>
                      {Math.round(Number(student?.sumTotal)).toLocaleString()}円
                    </Box>
                  </Flex>
                )}
                <Flex>
                  <Box>Email：</Box>
                  <Box>{student?.email ? student?.email : "未登録"}</Box>
                </Flex>
              </Stack>
              <Box textAlign="center">
                <QRCode
                  value={`${location.origin}/register/measure/${projectId}?studentId=${studentIdTemp}/`}
                  renderAs="canvas"
                  size={100}
                />
                <Text mt={1} fontSize="xs">
                  もう一度採寸 QR
                </Text>
              </Box>
            </Flex>
            <Box mt={3}>
              <form ref={form} onSubmit={handleSendClick}>
                <Box display="none">
                  <Input name="title" defaultValue={send?.title} />
                  <Input
                    name="strudentNumber"
                    defaultValue={send?.studentNumber}
                  />
                  <Input name="firstName" defaultValue={send?.firstName} />
                  <Input name="lastName" defaultValue={send?.lastName} />
                  <Input name="sumTotal" defaultValue={send?.sumTotal} />
                  <Input name="signature" defaultValue={send?.signature} />
                  <Input name="content" defaultValue={send?.content} />
                </Box>
                <Flex gap={2}>
                  <Input
                    maxW="300px"
                    size="sm"
                    rounded="md"
                    fontSize="sm"
                    id="email"
                    placeholder="emailを追加・更新"
                    type="email"
                    name="email"
                    value={send.email}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="submit"
                    colorScheme="facebook"
                    isDisabled={!isValid(send.email)}
                    size="sm"
                  >
                    送信
                  </Button>
                </Flex>
              </form>
            </Box>
            <TableContainer mt={6}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th w="auto">商品名</Th>
                    <Th w="100px">サイズ</Th>
                    <Th w="100px">数量</Th>
                    <Th w="100px">裾上げ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {student?.products?.map((product: any, index: number) => (
                    <Tr key={index}>
                      <Td>{product.productName}</Td>
                      <Td isNumeric>{product.size}</Td>
                      <Td isNumeric>{product.quantity}</Td>
                      <Td isNumeric>
                        {product.inseam ? product.inseam : "なし"}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                resetStudentIndex();
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
          <Flex justifyContent="space-between" p={6} pt={0}>
            <FaChevronLeft
              cursor="pointer"
              opacity={studentNumOrder > 1 ? 1 : 0}
              onClick={getPrevStudent}
            >
              prev
            </FaChevronLeft>
            <Box>
              {studentNumOrder}/{students.length}
            </Box>
            <FaChevronRight
              cursor="pointer"
              opacity={studentNumOrder !== students.length ? 1 : 0}
              onClick={getNextStudent}
            >
              next
            </FaChevronRight>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StudentModal;
