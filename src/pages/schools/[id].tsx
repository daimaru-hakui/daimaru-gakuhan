import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
} from '@chakra-ui/react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { FaTrashAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { db } from '../../../firebase';
import { currentUserAuth } from '../../../store';
import { CSVLink } from 'react-csv';
import TotalModal from '../../components/schools/TotalModal';
import StudentModal from '../../components/schools/StudentModal';
import SliderWidth from '../../components/SliderWidth';
import Link from 'next/link';

const SchoolId = () => {
  const router = useRouter();
  const projectId = router.query.id;
  const currentUser = useRecoilValue(currentUserAuth);
  const [students, setStudents] = useState<any>();
  const [project, setProject] = useState<any>();
  const [totals, setTotals] = useState<any>();
  const [unRegister, setUnRegister] = useState('');
  const [deleteCheck, setDeleteCheck] = useState('');
  const [csvData, setCsvData] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [tableWidth, setTableWidth] = useState(1200);

  // ログインしてなければloginページへ移動
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  //生徒の情報を取得
  useEffect(() => {
    const getStudents = async () => {
      const collectionRef = collection(
        db,
        'schools',
        `${projectId}`,
        'students'
      );
      const q = query(collectionRef, orderBy('studentNumber', 'asc'));
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
      const docRef = doc(db, 'projects', `${projectId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ ...docSnap.data(), id: docSnap.id });
      }
    };
    getProject();
  }, [projectId]);

  // 未登録の生徒数
  useEffect(() => {
    const getUnregister = () => {
      const result = students?.filter(
        (student: { updatedAt: Date }) => !student.updatedAt
      );
      setUnRegister(result?.length === 0 ? '' : result?.length);
    };
    getUnregister();
  }, [students]);

  // 生徒全員の合計金額
  useEffect(() => {
    const getSumPrice = () => {
      const total = students
        ?.map((student: { sumTotal: number }) => student.sumTotal)
        ?.reduce((prev: number, current: number) => prev + current, 0);
      setTotalPrice(total);
    };
    getSumPrice();
  }, [students]);

  // 生徒の登録情報を削除
  const deleteStudent = (studentId: string) => {
    const result = window.confirm('削除して宜しいでしょうか');
    if (!result) return;
    deleteDoc(doc(db, 'schools', `${projectId}`, 'students', studentId));
  };

  //性別を表示
  const genderDisp = (gender: string) => {
    switch (gender) {
      case '1':
        return '男性';
      case '2':
        return '女性';
      default:
        return '未記入';
    }
  };

  // 作成日表示
  const getDateTime = (d: Date) => {
    const date = new Date(d);
    let month = String(date.getMonth() + 1);
    month = ('0' + month).slice(-2);
    let day = String(date.getDate());
    day = ('0' + day).slice(-2);
    let hours = String(date.getHours());
    hours = ('0' + hours).slice(-2);
    let min = String(date.getMinutes());
    min = ('0' + min).slice(-2);
    let sec = String(date.getSeconds());
    sec = ('0' + sec).slice(-2);
    return `${month}月${day}日${hours}:${min}:${sec}`;
  };

  // 経過時間
  const getElapsedtime = (before: Date, after: Date) => {
    const beforeTime = new Date(before).getTime();
    const afterTime = new Date(after).getTime();
    const elap = Math.floor((afterTime - beforeTime) / 1000);
    const hour = Math.floor(Number(elap) / 3600);
    let min = String(Math.floor((elap / 60) % 60));
    min = ('0' + min).slice(-2);
    let sec = String(Math.floor(elap % 60));
    sec = ('0' + sec).slice(-2);
    const result = `${hour}時間 ${min}分 ${sec}秒`;
    return result;
  };

  ////////////////// CSV作成 //////////////////////////////////
  const onClickCsv = () => {
    // 生徒を一人ひとりループしてデータを作成
    const csvData = students.map((student: any) => {
      // 商品毎にオブジェクト(obj)を作成して配列に格納
      let items = student?.products.map(
        (
          product: {
            productName: string;
            size: string;
            quantity: number;
            inseam: number;
          },
          index: number
        ) => {
          // keyの名前を作成
          const nameProduct = '商品名' + Number(index + 1);
          const nameSize = 'サイズ' + Number(index + 1);
          const nameQuantity = '数量' + Number(index + 1);
          const nameInseam = '股下修理' + Number(index + 1);

          // keyに各項目名を入れてオブジェクトを作成
          const obj = {
            [nameProduct]: product.productName,
            [nameSize]: product.size,
            [nameQuantity]: product.quantity,
            [nameInseam]: product.inseam || undefined,
          };

          // 値がundefindであれば削除
          const newObject = Object.fromEntries(
            Object.entries(obj).filter(([, v]) => v !== undefined)
          );

          return newObject;
        }
      );

      // 生徒毎に各項目のオブジェクトを作成して配列に格納
      let array: any = [];
      items.forEach((obj: any) => {
        Object.keys(obj).forEach((key) => {
          array.push({ [key]: obj[key] });
        });
      });

      const gender = genderDisp(student?.gender);

      // 学生番号・名前などを配列に追加
      array.unshift(
        { 学籍番号: student.studentNumber },
        { 名前: student?.lastName + student?.firstName },
        { 性別: gender },
        { 金額: student?.sumTotal },
        { 作成日: getDateTime(student?.createdAt?.toDate()) },
        {
          採寸完了日:
            student?.updatedAt && getDateTime(student?.updatedAt?.toDate()),
        },
        {
          経過時間:
            student?.updatedAt &&
            getElapsedtime(
              student?.createdAt?.toDate(),
              student?.updatedAt?.toDate()
            ),
        }
      );

      return [...array];
    });

    // CSVファイルの項目を作成
    const header = csvData[0]
      .map((csv: any) => Object.keys(csv))
      .map((key: any) => key[0])
      .join(',');

    // CSVファイルの内容を作成
    const body = csvData
      .map((csv: any) =>
        csv
          .map((c: any) => Object.values(c))
          .map((value: any) => value[0])
          .join(',')
      )
      .join('\n');

    //　項目と内容を合わせてCSVファイルを作成
    const csvFile = header + '\n' + body;
    setCsvData(csvFile);
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
      productSize?.push('未記入');
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
          .map((size: any) => Number(size?.quantity || 0))
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
    <Container maxW={`${tableWidth}px`} py={6}>
      <SliderWidth
        tableWidth={tableWidth}
        setTableWidth={setTableWidth}
        width={1200}
      />
      <Box as='h2' mt={3} fontWeight='bold'>
        {project?.title}
      </Box>
      {students?.length > 0 ? (
        <>
          <Flex mt={3} alignItems='center' justifyContent='space-between'>
            <Box>
              全{students?.length}件
              {unRegister && (
                <Box as='span'>{`（未提出者 ${unRegister}名）`}</Box>
              )}
            </Box>
            <Flex>
              <Link href={`/schools/limit/${projectId}`}>
                <a>
                  <Button size='sm' mr={2} colorScheme='facebook'>
                    学生閲覧用ぺージ
                  </Button>
                </a>
              </Link>
              <CSVLink
                data={csvData}
                filename={
                  new Date().toLocaleString() + `_${project?.title}.csv`
                }
              >
                <Button
                  size='sm'
                  mr={2}
                  colorScheme='facebook'
                  onClick={onClickCsv}
                >
                  CSV
                </Button>
              </CSVLink>
              {/* <TotalModal totals={totals} totalPrice={totalPrice} /> */}
            </Flex>
          </Flex>

          <TableContainer mt={6}>
            <Table variant='striped' colorScheme='gray' size='sm'>
              <Thead>
                <Tr>
                  <Th>学生番号</Th>
                  <Th>名前</Th>
                  <Th>性別</Th>
                  <Th isNumeric>金額（税込）</Th>
                  {students[0]?.products.map(
                    (
                      product: {
                        productName: string;
                        size: string[];
                        quantity: string;
                        inseam: string;
                      },
                      index: number
                    ) => (
                      <React.Fragment key={index}>
                        {product?.productName && <Th w='80px'>商品名</Th>}
                        {product?.size && <Th w='80px'>サイズ</Th>}
                        {product?.quantity && <Th w='50px'>数量</Th>}
                        {product?.inseam && <Th w='50px'>股下修理</Th>}
                      </React.Fragment>
                    )
                  )}
                  <Th>登録日</Th>
                  <Th>採寸完了日</Th>
                  <Th>経過時間</Th>
                  <Th>詳細</Th>
                  <Th>削除</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students?.map((student: any) => (
                  <Tr
                    key={student.id}
                    textColor={student?.updatedAt || 'red.500'}
                  >
                    <Td>{student?.studentNumber}</Td>
                    <Td>{`${student?.lastName} ${student?.firstName}`}</Td>
                    <Td>{genderDisp(student.gender)}</Td>
                    <Td isNumeric>
                      {student.sumTotal
                        ? Math.round(Number(student.sumTotal)).toLocaleString()
                        : 0}
                      円
                    </Td>
                    {student.products.map((product: any, index: number) => (
                      <React.Fragment key={index}>
                        {product.productName && (
                          <Td w='80px'>{product.productName}</Td>
                        )}
                        {product.size && (
                          <Td w='80px' textAlign='center'>
                            {product.size}
                          </Td>
                        )}
                        {product.quantity && (
                          <Td w='50px' textAlign='right'>
                            {product.quantity}
                          </Td>
                        )}
                        {product.inseam && (
                          <Td w='50px' textAlign='right'>
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
                    <Td>
                      <StudentModal
                        projectId={project?.id}
                        studentId={student?.id}
                        genderDisp={genderDisp}
                      />
                    </Td>
                    <Td>
                      <FaTrashAlt
                        cursor='pointer'
                        onClick={() => deleteCheck && deleteStudent(student.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt={6}>
            <Checkbox
              value={deleteCheck}
              name='check'
              onChange={(e: any) => setDeleteCheck(e.target.checked)}
            >
              削除する場合はチェックを入れてください
            </Checkbox>
          </Box>
        </>
      ) : (
        <Box mt={6}>現在、登録情報はありません。</Box>
      )}
    </Container>
  );
};

export default SchoolId;
