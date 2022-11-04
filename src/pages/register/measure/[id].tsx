/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../../../store';
import SizeSpecModal from '../../../components/register/SizeSpecModal';

const MeasureId = () => {
  const router = useRouter();
  const [student, setStudent] = useState<any>();
  const [project, setProject] = useState<any>();
  const [items, setItems] = useState<any>({});
  const [sumTotal, setSumTotal] = useState(0);
  const array = Object.keys([...Array(10)]);
  const setLoading = useSetRecoilState(loadingState);
  const TAX = 1.1; // 税金

  // student（個別）を取得
  useEffect(() => {
    const getStudent = async () => {
      const docRef = doc(
        db,
        'schools',
        `${router.query.projectId}`,
        'students',
        `${router.query.id}`
      );
      const getSnap = await getDoc(docRef);
      if (getSnap.exists()) {
        setStudent({ ...getSnap.data(), id: getSnap.id });
        if (getSnap?.data().release === false) {
          console.log(getSnap?.data().release);
        }
      }
    };

    let i = 0;
    while (i <= 20) {
      history.pushState(null, 'null', null);
      i++;
    }

    getStudent();
  }, [router.query.id, router.query.projectId]);

  // productを取得
  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, 'projects', `${router.query.projectId}`);
      const getSnap = await getDoc(docRef);
      if (getSnap.exists()) {
        setProject({ ...getSnap.data(), id: getSnap.id });
        if (getSnap?.data().release === false) {
          console.log(getSnap?.data().release);
        }
      }
    };
    getProject();
  }, [router.query.id, router.query.projectId]);

  // 商品登録用 初期値入力
  useEffect(() => {
    setItems({
      ...student,
      products: project?.products?.map((product: any) => {
        const productName = product.productName ? product.productName : null;
        const price = product.price ? product.price : null;

        let size = product.size ? product.size : null;
        size = product.size.length === 1 ? product.size[0] : '未記入';

        const quantity = product.quantity ? '0' : product.fixedQuantity;
        const inseam = product.inseam ? 'なし' : null;
        const sizeUrl = product.sizeUrl ? product.sizeUrl : '';
        const imageUrl = product.imageUrl ? product.imageUrl : '';
        return {
          productName,
          price,
          size,
          quantity,
          inseam,
          sizeUrl,
          imageUrl,
        };
      }),
    });
  }, [project, student]);

  // 採寸登録
  const addStudent = async () => {
    const result = window.confirm('登録して宜しいでしょうか');
    if (!result) return;
    setLoading(true);
    try {
      await updateDoc(
        doc(
          db,
          'schools',
          `${router.query.projectId}`,
          'students',
          `${router.query.id}`
        ),
        {
          ...items,
          sumTotal,
          updatedAt: serverTimestamp(),
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      const jsonString = JSON.stringify({
        ...items,
        sumTotal,
      });
      localStorage.setItem(`${student.id}`, jsonString);
      router.push(`/completion/${student?.id}`);
    }
  };

  // 学籍番号・名前の変更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  //　性別の変更
  const handleRadioChange = (e: string) => {
    const value = e;
    setItems({ ...items, gender: value });
  };

  // 商品の値を追加・変更
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    rowIndex: number
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setItems(() => {
      let newItems = [];
      if (items.products?.length > rowIndex) {
        // 値がある場合　更新
        newItems = items.products?.map((product: any, index: number) => {
          if (index === rowIndex) {
            return {
              ...product,
              [name]: value,
            };
          } else {
            return { ...product };
          }
        });
      }
      return { ...items, products: [...(newItems || '')] };
    });
  };

  // 合計金額
  useEffect(() => {
    let sum = 0;
    items?.products
      ?.map((product: any) => ({
        price: product.price,
        quantity: product.quantity,
      }))
      .forEach((product: any) => {
        sum += Number(product.price) * Number(product.quantity);
      });
    setSumTotal(sum);
  }, [items.products]);

  return (
    <Container maxW='600px' py={6} minH='100vh'>
      {student?.release && (
        <>
          {items?.title && (
            <Box
              p={6}
              fontSize='3xl'
              fontWeight='bold'
              bg='white'
              rounded={6}
              boxShadow='base'
            >
              {items?.title}
            </Box>
          )}
          <Box mt={6} p={6} bg='white' rounded={6} boxShadow='base'>
            <Text>学籍番号</Text>
            <Input
              type='text'
              mt={2}
              name='studentNumber'
              value={items.studentNumber}
              onChange={handleInputChange}
            />
          </Box>

          <Box mt={6} p={6} bg='white' rounded={6} boxShadow='base'>
            <Text>名前</Text>
            <Input
              type='text'
              mt={2}
              name='name'
              value={items.name}
              onChange={handleInputChange}
            />
          </Box>

          {Number(project?.gender) === 1 && ''}
          {Number(project?.gender) === 2 && (
            <Box mt={6} p={6} bg='white' rounded={6} boxShadow='base'>
              <RadioGroup
                name='gender'
                value={items.gender}
                onChange={(e) => handleRadioChange(e)}
              >
                <Stack spacing={5} direction='row'>
                  <Radio colorScheme='green' value='1'>
                    男性
                  </Radio>
                  <Radio colorScheme='green' value='2'>
                    女性
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          )}
          {Number(project?.gender) === 3 && (
            <Box mt={6} p={6} bg='white' rounded={6} boxShadow='base'>
              <RadioGroup
                name='gender'
                value={items.gender}
                onChange={(e) => handleRadioChange(e)}
              >
                <Stack spacing={5} direction='row'>
                  <Radio colorScheme='green' value='1'>
                    男性
                  </Radio>
                  <Radio colorScheme='green' value='2'>
                    女性
                  </Radio>
                  <Radio colorScheme='green' value='3'>
                    その他
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          )}

          {project?.products.map((product: any, index: number) => (
            <Box
              key={product.productName}
              mt={6}
              p={6}
              bg='white'
              rounded={6}
              boxShadow='base'
            >
              <Box fontSize='xl'>{product.productName}</Box>
              {Number(product?.price) !== 0 && (
                <Box mt={2}>
                  価格{' '}
                  {Math.round(Number(product.price) * TAX).toLocaleString()}
                  円（税込）
                </Box>
              )}
              {product?.imageUrl && (
                <Flex mt={6} justifyContent='center'>
                  <img src={product?.imageUrl} alt={product?.imageUrl} />
                </Flex>
              )}

              {product?.size.length >= 1 && (
                <Box mt={6}>
                  <Flex
                    mb={2}
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Text>サイズ</Text>
                    {product?.sizeUrl && (
                      <SizeSpecModal sizeUrl={product?.sizeUrl} />
                    )}
                  </Flex>
                  {product?.size.length === 1 ? (
                    <Box>
                      {product?.size.map((size: string) => (
                        <Input name='size' key={size} value={size} />
                      ))}
                    </Box>
                  ) : (
                    <Select
                      placeholder='サイズを選択してください'
                      name='size'
                      onChange={(e) => handleSelectChange(e, index)}
                    >
                      {product?.size.map((size: string) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </Select>
                  )}
                </Box>
              )}

              <Box mt={6}>
                {product.quantity ? (
                  <>
                    <Text>数量</Text>
                    <Select
                      mt={2}
                      name='quantity'
                      placeholder='数量を選択してしてください'
                      onChange={(e) => handleSelectChange(e, index)}
                    >
                      {array.map((num: string, index: number) => (
                        <option key={num?.toString()} value={index}>
                          {index}
                        </option>
                      ))}
                    </Select>
                  </>
                ) : (
                  <Flex gap={3}>
                    <Text>数量</Text>
                    <Box>{product.fixedQuantity}</Box>
                  </Flex>
                )}
              </Box>
              <Box mt={6}>
                {product.inseam && (
                  <>
                    <Text>裾上げ</Text>
                    <Select
                      mt={1}
                      name='inseam'
                      placeholder='裾上直しの長さを選択してください'
                      onChange={(e) => handleSelectChange(e, index)}
                    >
                      {Object.keys(['無し', ...Array(30)]).map(
                        (num: string, index: number) => (
                          <option key={num?.toString()} value={index + 'cm'}>
                            {index}cm
                          </option>
                        )
                      )}
                    </Select>
                  </>
                )}
              </Box>
            </Box>
          ))}

          <Box mt={6} textAlign='center'>
            <Button
              colorScheme='facebook'
              onClick={addStudent}
              disabled={items?.products?.some(
                (product: any) => Number(product.quantity) === 0
              )}
            >
              登録
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default MeasureId;
