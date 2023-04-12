import { Box, Container, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import ConfMail from "../../components/completion/ConfMail";

type ProjectType = {
  id: string;
  title: string;
  name: string;
  desc: string;
  schedule: string;
  gender: string;
  products: string[];
  release: boolean;
};

const Completion = () => {
  const router = useRouter();
  const studentId = router.query.id;
  const [release, setRelease] = useState<boolean>(false);
  const [student, setStudent] = useState<any>();

  // localstorage 取得
  useEffect(() => {
    const jsonData: any = localStorage.getItem(`${studentId}`);
    setStudent(JSON.parse(jsonData));
    history.pushState(null, "null", null);
    history.go(1);
    return;
  }, [router, studentId]);

  // project（個別）を取得
  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, "projects", `${student?.projectId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRelease(docSnap.data().release);
      }
    };
    getProject();
  }, [student?.projectId]);

  return (
    <Container maxW="500px" py={6} minH="100vh">
      {student && (
        <Box p={6} boxShadow="base" bg="white" rounded="md">
          <Text as="h1" textAlign="center" fontWeight="bold" fontSize="2xl">
            採寸登録が完了しました
          </Text>
          <Text fontSize="sm" mt={6}>
            採寸登録ありがとうございます。
            <Box as="span" fontWeight="bold" textDecoration="underline">
              こちらの画面が控えになります。
            </Box>
            ご必要な場合はお手数ですが、スクリーンショット又は
            メールアドレスを登録して確認メールを受け取ってください。
            またサイズ変更等ございます場合は、係員にお申し付けください。
          </Text>

          {release && (
            <Box mt={6}>
              <ConfMail student={student} release={release} />
            </Box>
          )}

          <Box mt={6}>
            <Box textAlign="center" fontWeight="bold">
              {student?.title}
            </Box>
            <Flex mt={6}>
              <Box fontWeight="bold" w="90px">
                学籍番号
              </Box>
              <Box>{student?.studentNumber}</Box>
            </Flex>
            <Flex>
              <Box fontWeight="bold" w="90px">
                名前
              </Box>
              <Box>{`${student?.lastName} ${student?.firstName}`}</Box>
            </Flex>
            {student?.sumTotal > 0 && (
              <Flex>
                <Box fontWeight="bold" w="90px">
                  合計金額
                </Box>
                <Box>
                  {Math.round(student?.sumTotal).toLocaleString()}円（税込）
                </Box>
              </Flex>
            )}
            <Stack spacing={3}>
              {student?.products.map(
                (product: {
                  productName: string;
                  size: string;
                  color: string;
                  quantity: string;
                  inseam: string;
                  inseamPrice: number;
                  price: number;
                }) => (
                  <Box key={product.productName} mt={6}>
                    {product.productName && (
                      <Flex>
                        <Box fontWeight="bold" w="90px">
                          商品名
                        </Box>
                        <Box>{product.productName}</Box>
                      </Flex>
                    )}
                    {product.color && (
                      <Flex>
                        <Box fontWeight="bold" w="90px">
                          カラー
                        </Box>
                        <Box>{product.color}</Box>
                      </Flex>
                    )}
                    {product.size && (
                      <Flex>
                        <Box fontWeight="bold" w="90px">
                          サイズ
                        </Box>
                        <Box>{product.size}</Box>
                      </Flex>
                    )}
                    {product.quantity && (
                      <Flex>
                        <Box fontWeight="bold" w="90px">
                          数量
                        </Box>
                        <Box>{product.quantity}</Box>
                      </Flex>
                    )}
                    {product.inseam && (
                      <Flex>
                        <Box fontWeight="bold" w="90px">
                          股下修理
                        </Box>
                        <Box>{product.inseam}</Box>
                      </Flex>
                    )}
                    {product.price && (
                      <Flex>
                        <Box fontWeight="bold" w="90px">
                          単価
                        </Box>
                        <Flex>
                          {product.price.toLocaleString()}
                          {product.inseam &&
                            !["不要", "なし"].includes(product.inseam) &&
                            product.inseamPrice !== 0 && (
                              <Box>{`+${product.inseamPrice}`}</Box>
                            )}
                          円（税込）
                        </Flex>
                      </Flex>
                    )}
                  </Box>
                )
              )}
            </Stack>
            {student?.signature && (
              <>
                <Divider mt={6} />
                <Box mt={6} fontSize="sm" lineHeight="5" whiteSpace="pre-wrap">
                  {student.signature}
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Completion;
