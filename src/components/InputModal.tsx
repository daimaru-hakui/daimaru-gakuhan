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
import { NextPage } from 'next';
import { prepareServerlessUrl } from 'next/dist/server/base-server';
import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

type Props = {
  index: number;
};

const InputModal: NextPage<Props> = ({ index }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [items, setItems] = useState<any>({
    productName: '',
    size: [],
    type: '',
  });

  const sizeData = [
    { id: 0, label: 'SS' },
    { id: 1, label: 'S' },
    { id: 2, label: 'M' },
    { id: 3, label: 'L' },
    { id: 4, label: 'LL' },
    { id: 5, label: '3L' },
    { id: 6, label: '4L' },
    { id: 7, label: '5L' },
  ];
  const handleCheckedChange = (e: any) => {
    if (e.target.checked) {
      setItems({ ...items, size: [...items.size, e.target.value] });
    } else {
      setItems({
        ...items,
        size: [...items.size.filter((size: string) => size !== e.target.value)],
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleRadioChange = (e: string) => {
    const value = e;
    setItems({ ...items, type: value });
  };

  console.log(items);
  return (
    <>
      <Flex justifyContent='center'>
        <Button onClick={onOpen}>
          <FaPlusCircle size='25' />
        </Button>
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setItems({
            productName: '',
            size: [],
          });
        }}
        size='2xl'
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
              <CheckboxGroup colorScheme='green'>
                <Text>サイズ</Text>
                <Stack spacing={[1, 5]} mt={1} direction={['column', 'row']}>
                  {sizeData.map((size) => (
                    <Checkbox
                      key={size.id}
                      value={size.label}
                      onChange={(e) => handleCheckedChange(e)}
                    >
                      {size.label}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
              {items.size.length > 0 && (
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
              <RadioGroup onChange={(e) => handleRadioChange(e)}>
                <Text>数量入力値</Text>
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
                setItems({
                  productName: '',
                  size: [],
                });
              }}
            >
              Close
            </Button>
            <Button colorScheme='facebook'>登録</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InputModal;
