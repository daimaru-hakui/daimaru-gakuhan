import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit } from 'react-icons/fa';
import { db } from '../../firebase';

type Props = {
  productIndex: number;
  buttonDesign: string;
};

const InputModal: NextPage<Props> = ({ productIndex, buttonDesign }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState<any>();
  const [items, setItems] = useState<any>({
    productName: '',
    size: [],
  });

  const sizeData = [
    { id: 'F', label: 'F' },
    { id: 0, label: 'SS' },
    { id: 1, label: 'S' },
    { id: 2, label: 'M' },
    { id: 3, label: 'L' },
    { id: 4, label: 'LL' },
    { id: 5, label: '3L' },
    { id: 6, label: '4L' },
    { id: 7, label: '5L' },
  ];
  const sizeData2 = [
    { id: 8, label: '22.0cm' },
    { id: 9, label: '22.5cm' },
    { id: 10, label: '23.0cm' },
    { id: 11, label: '23.5cm' },
    { id: 12, label: '24.0cm' },
    { id: 13, label: '24.5cm' },
    { id: 14, label: '25.0cm' },
    { id: 15, label: '25.5cm' },
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleCheckedChange = (e: any) => {
    if (e.target.checked) {
      setItems({
        ...items,
        size: [...(items.size || ''), e.target.value],
      });
    } else {
      setItems({
        ...items,
        size: [
          ...items?.size.filter((size: string) => size !== e.target.value),
        ],
      });
    }
  };

  const handleRadioChange = (e: string, type: string) => {
    const value = e;
    setItems({ ...items, [type]: value });
  };

  // projectのproductsを取得
  useEffect(() => {
    const getProject = async () => {
      const unsub = onSnapshot(
        doc(db, 'projects', `${router.query.id}`),
        (doc) => {
          setProducts(doc.data()?.products);
          const product = doc.data()?.products[productIndex];
          setItems({
            productName: product?.productName,
            size: product?.size,
            quantity: product?.quantity,
            inseam: product?.inseam,
          });
        }
      );
    };
    getProject();
  }, [router.query.id, productIndex]);

  // 商品を登録
  const addProduct = async () => {
    const docRef = doc(db, 'projects', `${router.query.id}`);
    try {
      if (products[productIndex]) {
        const productsArray = products?.map((product: any, index: number) => {
          if (index === productIndex) {
            return items;
          } else {
            return product;
          }
        });
        await updateDoc(docRef, {
          products: [...productsArray],
        });
      } else {
        await updateDoc(docRef, {
          products: arrayUnion(items),
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      onClose();
    }
  };

  const onClear = () => {
    setItems({
      productName: '',
      size: [],
      quantity: '1',
      inseam: '1',
    });
  };

  return (
    <>
      <Flex justifyContent='center'>
        {buttonDesign === 'add' && (
          <FaPlusCircle
            size='25'
            onClick={() => {
              onOpen();
            }}
            cursor='pointer'
          />
        )}
        {buttonDesign === 'edit' && (
          <FaEdit size='25' onClick={onOpen} cursor='pointer' />
        )}
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        size='3xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>商品登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>商品名</Text>
            <Input
              mt={1}
              placeholder='商品名'
              name='productName'
              value={items.productName}
              onChange={(e) => handleInputChange(e)}
            />
            <Box mt={6}>
              <CheckboxGroup colorScheme='green' defaultValue={items?.size}>
                <Text>サイズ</Text>

                <Flex flexDirection='column'>
                  <Box>
                    <Stack
                      spacing={[1, 5]}
                      mt={1}
                      direction={['column', 'row']}
                    >
                      {sizeData.map((size) => (
                        <Checkbox
                          isChecked={true}
                          key={size.id}
                          value={size.label}
                          onChange={(e) => handleCheckedChange(e)}
                        >
                          {size.label}
                        </Checkbox>
                      ))}
                    </Stack>
                  </Box>
                  <Box>
                    <Stack
                      spacing={[1, 3]}
                      mt={1}
                      direction={['column', 'row']}
                    >
                      {sizeData2.map((size) => (
                        <Checkbox
                          isChecked={true}
                          key={size.id}
                          value={size.label}
                          onChange={(e) => handleCheckedChange(e)}
                        >
                          {size.label}
                        </Checkbox>
                      ))}
                    </Stack>
                  </Box>
                </Flex>
              </CheckboxGroup>
              {items?.size?.length > 0 && (
                <>
                  <Flex mt={2} p={1} bgColor='green.100'>
                    <Box mr={3}>表示順</Box>
                    {items.size.map((size: string) => (
                      <Text key={size} mr={3}>
                        {size}
                      </Text>
                    ))}
                  </Flex>
                </>
              )}
            </Box>
            <Box mt={4}>
              <RadioGroup onChange={(e) => handleRadioChange(e, 'quantity')}>
                <Text>数量入力値</Text>
                <Stack direction='row' mt={1}>
                  <Radio value='1'>あり</Radio>
                  <Radio value='2'>なし</Radio>
                </Stack>
              </RadioGroup>
            </Box>
            <Box mt={4}>
              <RadioGroup onChange={(e) => handleRadioChange(e, 'inseam')}>
                <Text>股下修理</Text>
                <Stack direction='row' mt={1}>
                  <Radio value='1'>あり</Radio>
                  <Radio value='2'>なし</Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              variant='ghost'
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>
            <Button
              disabled={!items.productName}
              colorScheme='facebook'
              onClick={addProduct}
            >
              登録
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InputModal;
