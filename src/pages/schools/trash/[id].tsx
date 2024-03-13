import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FaTrashAlt } from "react-icons/fa";
import { MdKeyboardReturn } from "react-icons/md";

import { useRecoilValue } from "recoil";
import { db } from "../../../../firebase";
import { currentUserState } from "../../../../store";
import StudentModal from "../../../components/schools/StudentModal";
import SliderWidth from "../../../components/SliderWidth";
import Link from "next/link";
import { StudentType } from "../../../types/StudentType";

const TrashId = () => {
  const router = useRouter();
  const projectId = router.query.id;
  const currentUser = useRecoilValue(currentUserState);
  const [students, setStudents] = useState<any>([] as StudentType[]);
  const [project, setProject] = useState<any>();
  const [unRegister, setUnRegister] = useState("");
  const [deleteCheck, setDeleteCheck] = useState("");
  const [tableWidth, setTableWidth] = useState(1200);

  // ログインしてなければloginページへ移動
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  //生徒の情報を取得
  useEffect(() => {
    const getStudents = async () => {
      if (!currentUser) return;
      const collectionRef = collection(
        db,
        "schools",
        `${projectId}`,
        "students"
      );
      const q = query(collectionRef, orderBy("serialNumber", "asc"));
      onSnapshot(q, (querySnapshot) => {
        setStudents(
          querySnapshot.docs
            .map(
              (doc) =>
                ({
                  ...doc.data(),
                  id: doc.id,
                } as StudentType)
            )
            ?.filter((student) => student.deletedFlag === true)
        );
      });
    };
    getStudents();
  }, [projectId, currentUser]);

  // 学販projectデータ取得
  useEffect(() => {
    if (!currentUser) return;
    const getProject = async () => {
      const docRef = doc(db, "projects", `${projectId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ ...docSnap.data(), id: docSnap.id });
      }
    };
    getProject();
  }, [projectId, currentUser]);

  // 未登録の生徒数
  useEffect(() => {
    const getUnregister = () => {
      const result = students?.filter(
        (student: { updatedAt: Date }) => !student.updatedAt
      );
      setUnRegister(result?.length === 0 ? "" : result?.length);
    };
    getUnregister();
  }, [students]);

  // 生徒の登録情報を削除
  const deleteStudent = (studentId: string) => {
    const result = window.confirm("完全に削除して宜しいでしょうか");
    if (!result) return;
    deleteDoc(doc(db, "schools", `${projectId}`, "students", studentId));
  };

  //論理削除
  const reverseStudent = async (studentId: string) => {
    const result = window.confirm("リストに戻しますか？");
    if (!result) return;
    const docRef = doc(db, "schools", `${projectId}`, "students", studentId);
    const docSnap = await updateDoc(docRef, {
      deletedFlag: false,
    });
  };

  //性別を表示
  const genderDisp = (gender: string) => {
    switch (gender) {
      case "1":
        return "男性";
      case "2":
        return "女性";
      default:
        return "未記入";
    }
  };

  // 作成日表示
  const getDateTime = (d: Date) => {
    const date = new Date(d);
    let month = String(date.getMonth() + 1);
    month = ("0" + month).slice(-2);
    let day = String(date.getDate());
    day = ("0" + day).slice(-2);
    let hours = String(date.getHours());
    hours = ("0" + hours).slice(-2);
    let min = String(date.getMinutes());
    min = ("0" + min).slice(-2);
    let sec = String(date.getSeconds());
    sec = ("0" + sec).slice(-2);
    return `${month}月${day}日${hours}:${min}:${sec}`;
  };

  // 経過時間
  const getElapsedtime = (before: Date, after: Date) => {
    const beforeTime = new Date(before).getTime();
    const afterTime = new Date(after).getTime();
    const elap = Math.floor((afterTime - beforeTime) / 1000);
    const hour = Math.floor(Number(elap) / 3600);
    let min = String(Math.floor((elap / 60) % 60));
    min = ("0" + min).slice(-2);
    let sec = String(Math.floor(elap % 60));
    sec = ("0" + sec).slice(-2);
    const result = `${hour}時間 ${min}分 ${sec}秒`;
    return result;
  };

  return (
    <Container maxW={`${tableWidth}px`} py={6}>
      {currentUser && (
        <>
          <SliderWidth
            tableWidth={tableWidth}
            setTableWidth={setTableWidth}
            width={1200}
          />
          <Box as="h2" mt={3} fontWeight="bold">
            {project?.title}（ゴミ箱）
          </Box>
          <Flex mt={3} alignItems="center" justifyContent="space-between">
            <Box>
              全{students?.length}件
              {unRegister && (
                <Box as="span">{`（未提出者 ${unRegister}名）`}</Box>
              )}
            </Box>
            <Flex>
              <Link href={`/schools/${projectId}`}>
                <a>
                  <Button
                    size="sm"
                    mr={2}
                    variant="outline"
                    colorScheme="facebook"
                  >
                    戻る
                  </Button>
                </a>
              </Link>
            </Flex>
          </Flex>
          {students?.length > 0 ? (
            <>
              <TableContainer mt={6}>
                <Table
                  variant="simple"
                  colorScheme="pink"
                  size="sm"
                  bg="red.200"
                >
                  <Thead>
                    <Tr>
                      {deleteCheck && <Th>削除</Th>}
                      <Th>戻す</Th>
                      <Th>詳細</Th>
                      <Th>学生番号</Th>
                      <Th>名前</Th>
                      <Th>性別</Th>
                      <Th isNumeric>金額（税込）</Th>
                      {students[0]?.products.map(
                        (
                          product: {
                            productName: string;
                            color: string[];
                            size: string[];
                            quantity: string;
                            inseam: string;
                          },
                          index: number
                        ) => (
                          <React.Fragment key={index}>
                            {product?.productName && <Th w="80px">商品名</Th>}
                            {product?.color && <Th w="80px">カラー</Th>}
                            {product?.size && <Th w="80px">サイズ</Th>}
                            {product?.quantity && <Th w="50px">数量</Th>}
                            {product?.inseam && <Th w="50px">股下修理</Th>}
                          </React.Fragment>
                        )
                      )}
                      <Th>登録日</Th>
                      <Th>採寸完了日</Th>
                      <Th>経過時間</Th>
                      <Th>Email</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students?.map((student: any) => (
                      <Tr
                        key={student.id}
                        fontWeight={student?.updatedAt || "bold"}
                        textColor={student?.updatedAt || "red.500"}
                      >
                        {deleteCheck && (
                          <Td>
                            <FaTrashAlt
                              cursor="pointer"
                              onClick={() =>
                                deleteCheck && deleteStudent(student.id)
                              }
                            />
                          </Td>
                        )}
                        <Td>
                          <MdKeyboardReturn
                            cursor="pointer"
                            onClick={() => reverseStudent(student.id)}
                          />
                        </Td>
                        <Td>
                          <StudentModal
                            projectId={student?.projectId}
                            studentId={student?.id}
                            genderDisp={genderDisp}
                            students={students}
                          />
                        </Td>
                        <Td>{student?.studentNumber}</Td>
                        <Td>{`${student?.lastName} ${student?.firstName}`}</Td>
                        <Td>{genderDisp(student.gender)}</Td>
                        <Td isNumeric>
                          {student.sumTotal
                            ? Math.round(
                                Number(student.sumTotal) +
                                  (Number(student.isDelivery) === 1 &&
                                    student.deliveryCost)
                              ).toLocaleString()
                            : 0}
                          円
                        </Td>
                        {student.products.map((product: any, index: number) => (
                          <React.Fragment key={index}>
                            {product.productName && (
                              <Td w="80px">{product.productName}</Td>
                            )}
                            {product.color && (
                              <Td
                                w="80px"
                                textAlign="center"
                                fontWeight={
                                  product.color === "未記入" ? "bold" : ""
                                }
                                color={product.color === "未記入" ? "red" : ""}
                              >
                                {product.color}
                              </Td>
                            )}
                            {product.size && (
                              <Td
                                w="80px"
                                textAlign="center"
                                fontWeight={
                                  product.size === "未記入" ? "bold" : ""
                                }
                                color={product.size === "未記入" ? "red" : ""}
                              >
                                {product.size}
                              </Td>
                            )}
                            {product.quantity && (
                              <Td w="50px" textAlign="right">
                                {product.quantity}
                              </Td>
                            )}
                            {product.inseam && (
                              <Td
                                w="50px"
                                textAlign="right"
                                fontWeight={
                                  product.inseam === "未記入" ? "bold" : ""
                                }
                                color={product.inseam === "未記入" ? "red" : ""}
                              >
                                {product.inseam}
                              </Td>
                            )}
                          </React.Fragment>
                        ))}
                        <Td>{getDateTime(student?.createdAt.toDate())}</Td>
                        <Td>
                          {student?.updatedAt &&
                            getDateTime(student?.updatedAt.toDate())}
                        </Td>
                        <Td>
                          {student?.updatedAt &&
                            getElapsedtime(
                              student?.createdAt.toDate(),
                              student?.updatedAt.toDate()
                            )}
                        </Td>
                        <Td>{student?.email && student?.email}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box mt={6}>
                <Checkbox
                  value={deleteCheck}
                  name="check"
                  onChange={(e: any) => setDeleteCheck(e.target.checked)}
                >
                  削除する場合はチェックを入れてください
                </Checkbox>
              </Box>
            </>
          ) : (
            <Box textAlign="center" mt={6}>
              現在、登録情報はありません。
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default TrashId;
