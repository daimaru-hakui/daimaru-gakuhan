import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { db } from '../../firebase';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../store';
import { prepareServerlessUrl } from 'next/dist/server/base-server';
import Link from 'next/link';

const New = () => {
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingState);
  const [inputData, setInputData] = useState({
    title: '',
    desc: '',
  });

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputData({ ...inputData, [name]: value });
  };

  const addTitle = async () => {
    const projectsRef = collection(db, 'projects');
    try {
      setLoading(true);
      const docRef = await addDoc(projectsRef, {
        title: inputData.title,
        desc: inputData.desc,
        createdAt: serverTimestamp(),
      });
      router.push(`/projects/${docRef.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Container maxW='800px' pt={12}>
        <Box as='h1' color='black' fontWeight='bold'>
          学校名＋年度などの一意の名前を登録してください。
        </Box>
        <Flex flexDirection='column' alignItems='center' mt={2} gap={2}>
          <Input
            type='text'
            placeholder='タイトル　例）帝塚山大学 心理学学科　春'
            bgColor='white'
            name='title'
            value={inputData.title}
            onChange={handleInputChange}
          />
          <Textarea
            placeholder='説明'
            bgColor='white'
            name='desc'
            value={inputData.desc}
            onChange={handleInputChange}
          />
          <Flex w='100%' justifyContent='flex-end' gap={2}>
            <Link href='/dashboard'>
              <a>
                <Button variant='outline'>戻る</Button>
              </a>
            </Link>
            <Button
              colorScheme='facebook'
              disabled={!inputData.title}
              onClick={addTitle}
            >
              登録
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default New;
