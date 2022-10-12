import {
  Box,
  Button,
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
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase";
import { currentUserAuth } from "../../../store";
import TotalModal from "../../components/schools/TotalModal";

const SchoolId = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserAuth);
  const [students, setStudents] = useState<any>();
  const [tableTitle, setTableTitle] = useState<any>();
  const [project, setProject] = useState<any>();
  const [totals, setTotals] = useState<any>();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  //生徒の情報を取得
  useEffect(() => {
    const getStudents = async () => {
      const q = query(
        collection(db, "schools", `${router.query.id}`, "students")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setStudents(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
    };
    getStudents();
  }, [router.query.id]);

  // テーブルタイトル（Th）を取得
  useEffect(() => {
    setTableTitle(
      students?.find((student: any, index: number) => {
        if (index === 0) return true;
      })
    );
  }, [students]);

  // 学販projectデータ取得
  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, "projects", `${router.query.id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ ...docSnap.data() });
      }
    };
    getProject();
  }, [router.query.id]);

  // 生徒の登録情報を削除
  const deleteStudent = (studentId: string) => {
    const result = window.confirm("削除して宜しいでしょうか");
    if (!result) return;
    deleteDoc(doc(db, "schools", `${router.query.id}`, "students", studentId));
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

  ///////////////////////////　集計計算 ///////////////////////////////////
  useEffect(() => {
    // 商品アイテム数
    const productsLen = project?.products.length;

    // サイズ明細を格納する配列
    let sizeDetails = [];

    for (let i = 0; i < productsLen; i++) {
      // サイズ規格を取得
      let productSize = project?.products[i]?.size;
      // 商品名を取得
      let productName = project?.products[i]?.productName;

      // studentsから商品情報のみ取得（table1行ずつ）して配列に格納
      const productsArray = students?.map((student: { products: string[] }) =>
        student.products.find((product: any, index: number) =>
          productSize?.find(
            (size: string) => product?.size === size && index === i && true
          )
        )
      );

      // productsArrayからサイズ情報だけ取得して配列を作成
      const sizeOnly = productsArray?.map((product: { size: string }) => {
        return product?.size;
      });

      // サイズ情報の重複を削除
      const sizeSet = new Set(sizeOnly);

      // new Setを配列に変換
      const sizeArray = Array.from(sizeSet);

      // サイズ毎に配列を作成
      const sizesArray = sizeArray.map((size) =>
        productsArray?.filter(
          (product: { size: string; quantity: string }) =>
            size === product?.size && true
        )
      );

      // sizesArrayから「数量」のみ取得して配列を作成
      const quantitys = sizesArray.map((sizeObj) =>
        sizeObj
          //quantityが空の場合は１として計算
          .map((size: any) => Number(size?.quantity || 1))
          .reduce((a: number, b: number) => a + b, 0)
      );

      // 合計数量を変数に格納
      const sum = quantitys.reduce((a, b) => {
        return a + b;
      }, 0);

      // サイズ明細を格納した配列を作成
      const array = sizeArray.map((size, index) => ({
        productName,
        size,
        quantity: quantitys[index],
        sum,
      }));

      // 各サイズ明細をループで追加していく
      sizeDetails.push(array);
    }

    //すべてのサイズ明細を格納したstate
    setTotals(sizeDetails);
  }, [students, project?.products]);

  return (
    <Container maxW="1200px" py={6}>
      <Box>
        <TotalModal totals={totals} />
      </Box>
      <TableContainer mt={6}>
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th>{tableTitle?.studentNumber && "学生番号"}</Th>
              <Th>{tableTitle?.name && "名前"}</Th>
              <Th>{tableTitle?.gender && "性別"}</Th>
              {project?.products.map(
                (product: {
                  productName: string;
                  size: string[];
                  quantity: string;
                  inseam: string;
                }) => (
                  <React.Fragment key={product.productName}>
                    <Th w="80px">{product?.productName && "商品名"}</Th>
                    <Th w="80px">{product?.size && "サイズ"}</Th>
                    <Th w="50px">{product?.quantity && "数量"}</Th>
                    <Th w="50px">{product?.inseam && "股下修理"}</Th>
                  </React.Fragment>
                )
              )}
            </Tr>
          </Thead>
          <Tbody>
            {students?.map((student: any) => (
              <Tr key={student.id}>
                <Td>{student.studentNumber}</Td>
                <Td>{student.name}</Td>
                <Td>{genderDisp(student.gender)}</Td>
                {student.products.map((product: any) => (
                  <React.Fragment key={product.productName}>
                    <Td w="80px">{product.productName}</Td>
                    <Td w="80px" textAlign="center">
                      {product.size}
                    </Td>
                    <Td w="50px" textAlign="right">
                      {product.quantity}
                    </Td>
                    <Td w="50px" textAlign="right">
                      {product.inseam}
                    </Td>
                  </React.Fragment>
                ))}
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => deleteStudent(student.id)}
                  >
                    削除
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SchoolId;
