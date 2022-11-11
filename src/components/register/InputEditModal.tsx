/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import { NextRouter } from 'next/router';
import React from 'react';
import { db } from '../../../firebase';

type Props = {
  items: any;
  setItems: Function;
  student: any;
  project: any;
  router: NextRouter;
};

const InputEditModal: NextPage<Props> = ({
  items,
  setItems,
  student,
  project,
  router,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const studentId = router.query.studentId;

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

  //学籍番号の数字を抜き出す
  const serialNumber = (str: string) => {
    const regex = /[^0-9]/g;
    const result = str.replace(regex, '');
    const number = parseInt(result);
    return number;
  };

  // 学籍番号と名前と性別を更新
  const updateStudent = async () => {
    try {
      await updateDoc(
        doc(db, 'schools', `${project.id}`, 'students', `${studentId}`),
        {
          studentNumber: items.studentNumber,
          serialNumber: serialNumber(items?.studentNumber) || '',
          firstName: items.firstName,
          lastName: items.lastName,
          gender: items.gender,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      window.location.reload();
    }
  };

  // 編集をキャンセル
  const cancel = () => {
    const getStudent = async () => {
      const docRef = doc(
        db,
        'schools',
        `${project.id}`,
        'students',
        `${studentId}`
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItems({
          ...items,
          studentNumber: docSnap?.data().studentNumber,
          firstName: docSnap?.data().firstName,
          lastName: docSnap?.data().lastName,
          gender: docSnap?.data().gender,
        });
      }
    };
    getStudent();
  };
  return (
    <>
      <Button size='xs' onClick={onOpen}>
        編集
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Box mt={6} p={6} bg='white' rounded={6} boxShadow='base'>
                <Text>学籍番号</Text>
                <Input
                  type='text'
                  mt={2}
                  name='studentNumber'
                  value={items.studentNumber || ''}
                  onChange={handleInputChange}
                />
              </Box>

              <Box mt={6} p={6} bg='white' rounded={6} boxShadow='base'>
                <Text>名前</Text>
                <Flex gap={2}>
                  <Input
                    type='text'
                    mt={2}
                    name='lastName'
                    value={items.lastName || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    type='text'
                    mt={2}
                    name='firstName'
                    value={items.firstName || ''}
                    onChange={handleInputChange}
                  />
                </Flex>
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
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                cancel();
                onClose();
              }}
            >
              キャンセル
            </Button>
            <Button
              colorScheme='blue'
              onClick={() => {
                updateStudent();
                onClose();
              }}
            >
              更新する
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InputEditModal;
