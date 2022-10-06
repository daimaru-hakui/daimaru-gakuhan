import { Box, Container, Flex, Stack, Text } from "@chakra-ui/react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

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
  const [student, setStudent] = useState<any>();

  // useEffect(() => {
  //   const getProject = async () => {
  //     const unsub = onSnapshot(
  //       doc(db, "projects", `${router.query.id}`),
  //       (doc) => {
  //         setProject({ ...doc.data(), id: doc.id } as ProjectType);
  //         if (doc.data()?.release === false) {
  //           router.push("404/notfound");
  //         }
  //       }
  //     );
  //   };
  //   getProject();
  // }, [router.query.id, router]);

  // localstorage 取得
  useEffect(() => {
    const jsonData: any = localStorage.getItem(`${router.query.id}`);
    setStudent(JSON.parse(jsonData));
    history.pushState(null, "null", null);
    history.go(1);
    return;
  }, [router, router.query.id]);

  return (
    <Container maxW="500px" py={6} minH="100vh">
      {student && (
        <Box p={6} boxShadow="base" bgColor="white" borderRadius={6}>
          <Text as="h1" textAlign="center" fontWeight="bold" fontSize="2xl">
            採寸登録が完了しました
          </Text>
          <Text fontSize="sm" mt={6}>
            採寸登録ありがとうございます。
            <Box as="span" fontWeight="bold" textDecoration="underline">
              こちらの画面が控えになります。
            </Box>
            ご必要な場合はお手数ですが、スクリーンショット又は
            ブックマーク・お気に入り等に登録してください。
            またサイズ変更等ございます場合は、係員にお申し付けください。
          </Text>
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
              <Box>{student?.name}</Box>
            </Flex>
            <Stack spacing={3}>
              {student?.products.map(
                (product: {
                  productName: string;
                  size: string;
                  quantity: string;
                  inseam: string;
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
                    {product.quantity && (
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
                  </Box>
                )
              )}
            </Stack>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Completion;
