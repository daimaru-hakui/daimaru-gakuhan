import { Box, Button, Container, Flex } from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db } from "../../../firebase";
import { currentUserState, loadingState } from "../../../store";
import { ColorType } from "../../types/ColorType";
import { FaTrashAlt } from "react-icons/fa";
import ColorEditModal from "../../components/colors/ColorEditModal";

const Colors = () => {
  const currentUser = useRecoilValue(currentUserState);
  const router = useRouter();
  const [colors, setColors] = useState([] as ColorType[]);
  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const getSColors = async () => {
      const q = query(collection(db, "colors"), orderBy("title", "desc"));

      onSnapshot(q, (querySnapshot) =>
        setColors(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as ColorType)
          )
        )
      );
    };
    getSColors();
  }, []);

  // 署名を削除
  const deleteColor = async (colorId: string) => {
    const result = window.confirm("削除して宜しいでしょうか");
    if (!result) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "colors", `${colorId}`));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="500px">
      <Flex justifyContent="flex-end">
        <Box pt={6}>
          <Link href="/colors/new">
            <a>
              <Button colorScheme="facebook">新しい色を追加</Button>
            </a>
          </Link>
        </Box>
      </Flex>
      <Box mt={6} p={3} bg="white" rounded="md" boxShadow="md">
        {colors?.map((color: ColorType) => (
          <Flex
            key={color.id}
            mt={3}
            p={1}
            borderBottom="1px"
            borderColor="gray.200"
            whiteSpace="pre-wrap"
            justifyContent="space-between"
          >
            <Box>{color.title}</Box>
            <Flex gap={3} justifyContent="flex-end" alignItems="center">
              <ColorEditModal colorId={color.id} />
              <FaTrashAlt
                cursor="pointer"
                onClick={() => deleteColor(color.id)}
              />
            </Flex>
          </Flex>
        ))}
      </Box>
    </Container>
  );
};

export default Colors;
