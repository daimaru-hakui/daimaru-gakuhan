import {
  Box,
  Button,
  Container,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';

type ProjectType = {
  id: string;
  title: string;
  desc: string;
  schedule: string;
  products: string[];
  createdAt: Timestamp;
};

const Measure = () => {
  const router = useRouter();
  const [project, setProject] = useState<ProjectType>();

  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, 'projects', `${router.query.id}`);
      try {
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data()?.productName);

        if (docSnap.exists()) {
          setProject(docSnap?.data() as ProjectType);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProject();
  }, [router.query.id]);

  return (
    <Container maxW='600px' py={6}>
      {project?.title && (
        <Box
          p={6}
          fontSize='3xl'
          fontWeight='bold'
          bgColor='white'
          borderRadius={6}
          boxShadow='base'
        >
          {project?.title}
        </Box>
      )}
      <Box mt={6} p={6} bgColor='white' borderRadius={6} boxShadow='base'>
        <Text>学籍番号</Text>
        <Input type='text' mt={2} />
      </Box>
      <Box mt={6} p={6} bgColor='white' borderRadius={6} boxShadow='base'>
        <Text>名前</Text>
        <Input type='text' mt={2} />
      </Box>
      <Box mt={6} p={6} bgColor='white' borderRadius={6} boxShadow='base'>
        <RadioGroup defaultValue='3'>
          <Stack spacing={5} direction='row'>
            <Radio colorScheme='green' value='1'>
              男性
            </Radio>
            <Radio colorScheme='green' value='2'>
              女性
            </Radio>
            <Radio colorScheme='green' value='3'>
              未記入
            </Radio>
          </Stack>
        </RadioGroup>
      </Box>
      {project?.products.map((product: any) => (
        <Box
          key={product.id}
          mt={6}
          p={6}
          bgColor='white'
          borderRadius={6}
          boxShadow='base'
        >
          <Box>{product.productName}</Box>
          <Box mt={6}>
            <Select placeholder='サイズを選択してください'>
              {product.size.map((size: string) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
            <Box mt={6}>
              {product.type === '1' && (
                <Select placeholder='数量を選択してしてください'>
                  {[...Array(10)].map((num: string, index: number) => (
                    <option key={num} value={index}>
                      {index}
                    </option>
                  ))}
                </Select>
              )}
            </Box>
          </Box>
        </Box>
      ))}
      <Box mt={6} textAlign='center'>
        <Button colorScheme='facebook'>登録</Button>
      </Box>
    </Container>
  );
};

export default Measure;
