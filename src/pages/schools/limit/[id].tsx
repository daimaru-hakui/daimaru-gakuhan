import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
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
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { useRecoilValue } from "recoil";
import { db } from "../../../../firebase";
import { currentUserAuth } from "../../../../store";
import SliderWidth from "../../../components/SliderWidth";

const LimitId = () => {
  const router = useRouter();
  const projectId = router.query.id;
  const currentUser = useRecoilValue(currentUserAuth);
  const [students, setStudents] = useState<any>();
  const [project, setProject] = useState<any>();
  const [unRegister, setUnRegister] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [tableWidth, setTableWidth] = useState(900);

  // ログインしてなければloginページへ移動
  // useEffect(() => {
  //   if (!currentUser) {
  //     router.push('/login');
  //   }
  // }, [currentUser, router]);

  //生徒の情報を取得
  useEffect(() => {
    const getStudents = async () => {
      const collectionRef = collection(
        db,
        "schools",
        `${projectId}`,
        "students"
      );
      const q = query(collectionRef, orderBy("studentNumber", "asc"));
      onSnapshot(q, (querySnapshot) => {
        setStudents(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    };
    getStudents();
  }, [projectId]);

  // 学販projectデータ取得
  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, "projects", `${projectId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap?.data().release === false) {
          router.push("/register");
          return;
        }
        setProject({ ...docSnap.data(), id: docSnap.id });
      }
    };
    getProject();
  }, [router, projectId]);

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
    <Container maxW={`${tableWidth}px`} py={6} minH="100vh">
      <SliderWidth
        tableWidth={tableWidth}
        setTableWidth={setTableWidth}
        width={900}
      />
      <Box as="h2" mt={3} fontWeight="bold">
        {project?.title}
      </Box>
      {students?.length > 0 ? (
        <>
          <Flex mt={3} alignItems="center" justifyContent="space-between">
            <Box>
              全{students?.length}件
              {unRegister && (
                <Box as="span">{`（未提出者 ${unRegister}名）`}</Box>
              )}
            </Box>
          </Flex>

          <TableContainer mt={6}>
            <Table variant="striped" colorScheme="gray" size="sm">
              <Thead>
                <Tr>
                  <Th>学生番号</Th>
                  <Th>名前</Th>
                  <Th>性別</Th>
                  <Th>登録日</Th>
                  <Th>採寸完了日</Th>
                  <Th>経過時間</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students?.map((student: any) => (
                  <Tr
                    key={student.id}
                    textColor={student?.updatedAt || "red.500"}
                  >
                    <Td>{student?.studentNumber}</Td>
                    <Td>{`${student?.lastName} ${student?.firstName}`}</Td>
                    <Td>{genderDisp(student.gender)}</Td>
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
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Box mt={6}>現在、登録情報はありません。</Box>
      )}
    </Container>
  );
};

export default LimitId;
