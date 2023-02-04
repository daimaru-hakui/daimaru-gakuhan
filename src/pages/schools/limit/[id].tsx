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
import { currentUserState } from "../../../../store";
import SliderWidth from "../../../components/SliderWidth";

const LimitId = () => {
  const router = useRouter();
  const projectId = router.query.id;
  const [students, setStudents] = useState<any>();
  const [project, setProject] = useState<any>();
  const [unRegister, setUnRegister] = useState("");
  const [tableWidth, setTableWidth] = useState(900);

  //生徒の情報を取得
  useEffect(() => {
    const getStudents = async () => {
      const collectionRef = collection(
        db,
        "schools",
        `${projectId}`,
        "students"
      );
      const q = query(collectionRef, orderBy("serialNumber", "asc"));
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

  return (
    <Container maxW={`${tableWidth}px`} py={6} minH="100vh">
      {project?.release && (
        <>
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
                <Box fontSize="2xl">
                  全{students?.length}件
                  {unRegister && (
                    <Box as="span">{`（未提出者 ${unRegister}名）`}</Box>
                  )}
                </Box>
              </Flex>

              <Flex
                mt={6}
                w="full"
                wrap="wrap"
                justifyContent="space-between"
                gap={1}
              >
                {students?.map((student: any) => (
                  <Flex
                    key={student.id}
                    minW="175px"
                    p={1}
                    gap={2}
                    fontSize="sm"
                    textColor={student?.updatedAt ? "black" : "gray.100"}
                    bg={student?.updatedAt ? "gray.100" : "red.500"}
                  >
                    <Box>{student?.studentNumber}</Box>
                    <Box
                      flex={1}
                    >{`${student?.lastName} ${student?.firstName}`}</Box>
                  </Flex>
                ))}
              </Flex>
            </>
          ) : (
            <Box mt={6}>現在、登録情報はありません。</Box>
          )}
        </>
      )}
    </Container>
  );
};

export default LimitId;
