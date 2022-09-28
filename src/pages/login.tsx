import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../../firebase/index";
import { useRouter } from "next/router";
import Link from "next/link";
import { currentUserAuth, loadingState } from "../../store";
import { useRecoilState, useSetRecoilState } from "recoil";

const Login = () => {
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAuth);

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const signInUser = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user?.uid);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        window.alert("失敗しました");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Flex
      w="100%"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      px={6}
      position="relative"
      bgColor="#fafafa"
    >
      <Container
        maxW="400px"
        p={0}
        boxShadow="sm"
        borderRadius={6}
        bgColor="white"
      >
        <Flex
          w="100%"
          h="70px"
          justifyContent="center"
          alignItems="center"
          fontSize="2xl"
        >
          サインイン
        </Flex>
        <Flex flexDirection="column" justifyContent="space-around" px={6}>
          <Input
            type="text"
            w="100%"
            mt={0}
            backgroundColor="rgb(232 240 254)"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            w="100%"
            mt={3}
            backgroundColor="rgb(232 240 254)"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            mt={3}
            color="white"
            backgroundColor="facebook.600"
            _hover={{ backgroundColor: "facebook.500" }}
            disabled={!email || !password}
            onClick={signInUser}
          >
            サインイン
          </Button>
          <Box my={3} fontSize="xs" color="whiteAlpha.900" textAlign="center">
            アカウントをお持ちでないですか？
            <Link href="/register">
              <a>
                <Text
                  as="span"
                  ml={2}
                  textDecoration="underline"
                  cursor="pointer"
                >
                  新規登録
                </Text>
              </a>
            </Link>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Login;
