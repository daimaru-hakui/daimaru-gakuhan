import { Box, Button, Container, Flex } from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db } from "../../../firebase";
import { currentUserState, loadingState } from "../../../store";
import SignatureEditModal from "../../components/signature/SignatureEditModal";

const Signature = () => {
  const router = useRouter();
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingState);
  const [signatures, setSignatures] = useState<any>();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const getSignatures = async () => {
      const q = query(
        collection(db, "signatures"),
        orderBy("createdAt", "desc")
      );

      onSnapshot(q, (querySnapshot) =>
        setSignatures(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      );
    };
    getSignatures();
  }, []);

  // 署名を削除
  const deleteSignature = async (signatureId: string) => {
    const result = window.confirm("削除して宜しいでしょうか");
    if (!result) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "signatures", `${signatureId}`));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="600px">
      <Flex justifyContent="flex-end">
        <Box pt={6}>
          <Link href="/signature/new">
            <a>
              <Button colorScheme="facebook">新しい署名を追加</Button>
            </a>
          </Link>
        </Box>
      </Flex>
      {signatures?.map((signature: any) => (
        <Box
          key={signature.id}
          my={6}
          p={6}
          rounded="md"
          boxShadow="sm"
          bg="white"
          whiteSpace="pre-wrap"
        >
          <Box>{signature.content}</Box>
          <Flex mt={3} gap={3} justifyContent="flex-end" alignItems="center">
            <SignatureEditModal signatureId={signature.id} />
            <FaTrashAlt
              cursor="pointer"
              onClick={() => deleteSignature(signature.id)}
            />
          </Flex>
        </Box>
      ))}
    </Container>
  );
};

export default Signature;
