/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BsXCircleFill } from 'react-icons/bs';
import { useToast } from '@chakra-ui/react';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaEdit } from 'react-icons/fa';
import { db, storage } from '../../../firebase';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../../store';
import ProductInput from './ProductInput';

type Props = {
  productIndex: number;
  buttonDesign: string;
};

const InputModal: NextPage<Props> = ({ productIndex, buttonDesign }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setLoading = useSetRecoilState(loadingState);
  const [products, setProducts] = useState<any>();
  const projectId = router.query.id;
  const [sizeFileUpload, setSizeFileUpload] = useState<any>();
  const [imageFileUpload, setImageFileUpload] = useState<any>();
  const [sizeFileUploadA, setSizeFileUploadA] = useState<any>();
  const [imageFileUploadA, setImageFileUploadA] = useState<any>();
  const [items, setItems] = useState<any>({
    clothesType: '',
    productName: '',
    price: '',
    size: [''],
    inseam: '',
    quantity: '',
    sizeUrl: '',
    sizePath: '',
    imageUrl: '',
    imagePath: '',
    fixedQuantity: '',

    productNameA: '',
    priceA: '',
    sizeA: [''],
    inseamA: '',
    quantityA: '',
    sizeUrlA: '',
    sizePathA: '',
    imageUrlA: '',
    imagePathA: '',
    fixedQuantityA: '',
  });

  // projectのproductsを取得
  useEffect(() => {
    const getProject = async () => {
      onSnapshot(doc(db, 'projects', `${projectId}`), (doc) => {
        setProducts(doc.data()?.products);
        const product = doc.data()?.products[productIndex];
        setItems({
          clothesType: product?.clothesType || 1,

          productName: product?.productName || '',
          price: product?.price || 0,
          size: product?.size || [],
          quantity: product?.quantity || false,
          fixedQuantity: product?.fixedQuantity || 1,
          inseam: product?.inseam || false,
          sizeUrl: product?.sizeUrl || '',
          sizePath: product?.sizePath || '',
          imageUrl: product?.imageUrl || '',
          imagePath: product?.imagePath || '',

          productNameA: product?.productNameA || '',
          priceA: product?.priceA || 0,
          sizeA: product?.sizeA || [],
          quantityA: product?.quantityA || false,
          fixedQuantityA: product?.fixedQuantityA || 1,
          inseamA: product?.inseamA || false,
          sizeUrlA: product?.sizeUrlA || '',
          sizePathA: product?.sizePathA || '',
          imageUrlA: product?.imageUrlA || '',
          imagePathA: product?.imagePathA || '',
        });
      });
    };
    getProject();
  }, [projectId, productIndex]);

  // addProductに使う関数（画像を保存）
  const addImage = async (
    url: any,
    fileupload: any,
    setFileUpload: any,
    basePath: any
  ) => {
    if (!url) {
      if (fileupload) {
        const file = fileupload[0];
        const fileName = new Date().getTime() + '_' + file.name;
        const path = `${basePath}/${fileName}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        let downloadUrl = await getDownloadURL(ref(storage, path));
        let fullPath = storageRef.fullPath;
        setFileUpload('');
        return {
          downloadUrl,
          fullPath,
        };
      }
    }
    return;
  };

  // 商品を登録
  const addProduct = async () => {
    setLoading(true);
    let sizeUrl = items.sizeUrl || '';
    let sizePath = items.sizePath || '';
    let imageUrl = items.imageUrl || '';
    let imagePath = items.imagePath || '';
    let sizeUrlA = items.sizeUrlA || '';
    let sizePathA = items.sizePathA || '';
    let imageUrlA = items.imageUrlA || '';
    let imagePathA = items.imagePathA || '';

    // 画像が登録されてなければ画像を登録
    const sizeObj = await addImage(
      items.sizeUrl,
      sizeFileUpload,
      setSizeFileUpload,
      'sizes'
    );
    const imageObj = await addImage(
      items.imageUrl,
      imageFileUpload,
      setImageFileUpload,
      'images'
    );
    const sizeObjA = await addImage(
      items.sizeUrlA,
      sizeFileUploadA,
      setSizeFileUploadA,
      'sizes'
    );
    const imageObjA = await addImage(
      items.imageUrlA,
      imageFileUploadA,
      setImageFileUploadA,
      'images'
    );

    // if (!items.imageUrl) {
    //   if (imageFileUpload) {
    //     const file = imageFileUpload[0];
    //     const fileName = new Date().getTime() + '_' + file.name;
    //     const path = `images/${fileName}`;
    //     const storageRef = ref(storage, path);
    //     await uploadBytes(storageRef, file);
    //     imageUrl = await getDownloadURL(ref(storage, path));
    //     imagePath = storageRef.fullPath;
    //   }
    // }
    // if (!items.sizeUrlA) {
    //   if (sizeFileUploadA) {
    //     const file = sizeFileUploadA[0];
    //     const fileName = new Date().getTime() + '_' + file.name;
    //     const path = `sizes/${fileName}`;
    //     const storageRef = ref(storage, path);
    //     await uploadBytes(storageRef, file);
    //     sizeUrlA = await getDownloadURL(ref(storage, path));
    //     sizePathA = storageRef.fullPath;
    //     setSizeFileUploadA('');
    //   }
    // }
    // if (!items.imageUrlA) {
    //   if (imageFileUploadA) {
    //     const file = imageFileUploadA[0];
    //     const fileName = new Date().getTime() + '_' + file.name;
    //     const path = `images/${fileName}`;
    //     const storageRef = ref(storage, path);
    //     await uploadBytes(storageRef, file);
    //     imageUrlA = await getDownloadURL(ref(storage, path));
    //     imagePathA = storageRef.fullPath;
    //     setImageFileUploadA('');
    //   }
    // }
    const docRef = doc(db, 'projects', `${projectId}`);
    try {
      if (products[productIndex]) {
        const productsArray = products?.map((product: any, index: number) => {
          if (index === productIndex) {
            return {
              ...items,
              sizeUrl: sizeObj?.downloadUrl || sizeUrl,
              sizePath: sizeObj?.fullPath || sizePath,
              imageUrl: imageObj?.downloadUrl || imageUrl,
              imagePath: imageObj?.fullPath || imagePath,
              sizeUrlA: sizeObjA?.downloadUrl || sizeUrlA,
              sizePathA: sizeObjA?.fullPath || sizePathA,
              imageUrlA: imageObjA?.downloadUrl || imageUrlA,
              imagePathA: imageObjA?.fullPath || imagePathA,
            };
          } else {
            return product;
          }
        });
        await updateDoc(docRef, {
          products: [...productsArray],
        });
        toast({
          title: '商品登録を更新しました',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        await updateDoc(docRef, {
          products: arrayUnion({
            ...items,
            sizeUrl,
            sizePath,
            imageUrl,
            imagePath,
            sizeUrlA,
            sizePathA,
            imageUrlA,
            imagePathA,
          }),
        });
        toast({
          title: '商品登録を登録しました',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // サイズスペック画像削除
  const deleteImage = async (
    imageUrl: string,
    imagePath: string,
    propUrl: string,
    propPath: string,
    setFileUpload: any
  ) => {
    if (imageUrl) {
      const result = window.confirm('画像を削除して宜しいでしょうか');
      if (!result) return;
    }
    setLoading(true);
    const imageRef = ref(storage, `${imagePath}`);
    const docRef = doc(db, 'projects', `${projectId}`);
    try {
      await deleteObject(imageRef);
      if (products[productIndex]) {
        const productsArray = products?.map((product: any, index: number) => {
          if (index === productIndex) {
            return {
              ...items,
              [propUrl]: '',
              [propPath]: '',
            };
          } else {
            return product;
          }
        });

        await updateDoc(docRef, {
          products: [...productsArray],
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFileUpload(null);
      setLoading(false);
    }
  };

  const handleRadioChange = (e: string, type: string) => {
    const value = e;
    const name = type;
    setItems({ ...items, [name]: value });
  };

  const onClear = () => {
    setItems({
      ...products[productIndex],
    });
    setSizeFileUpload(null);
  };

  return (
    <>
      <Flex justifyContent='center'>
        {buttonDesign === 'add' && (
          <Button
            onClick={() => {
              onOpen();
            }}
            colorScheme='facebook'
            leftIcon={<FaPlusCircle size='25' cursor='pointer' />}
          >
            商品を追加
          </Button>
        )}
        {buttonDesign === 'edit' && (
          <FaEdit size='25' onClick={onOpen} cursor='pointer' />
        )}
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onClear();
        }}
        size='3xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>商品登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={6}>
              <RadioGroup
                value={Number(items.clothesType)}
                defaultValue='1'
                onChange={(e) => handleRadioChange(e, 'clothesType')}
              >
                <Box fontWeight='bold'></Box>
                <Stack direction={['column', 'row']} mt={2}>
                  <Radio value={1} pr={6}>
                    男女兼用
                  </Radio>
                  <Radio value={2} pr={6}>
                    男性用・女性用
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
            <ProductInput
              items={items}
              setItems={setItems}
              productIndex={productIndex}
              clothesSwitch={''}
              sizeFileUpload={sizeFileUpload}
              setSizeFileUpload={setSizeFileUpload}
              imageFileUpload={imageFileUpload}
              setImageFileUpload={setImageFileUpload}
              sizeFileUploadA={sizeFileUploadA}
              imageFileUploadA={imageFileUploadA}
              setSizeFileUploadA={setSizeFileUploadA}
              setImageFileUploadA={setImageFileUploadA}
              deleteImage={deleteImage}
            />
            {Number(items.clothesType) === 2 && (
              <>
                <ProductInput
                  items={items}
                  setItems={setItems}
                  productIndex={productIndex}
                  clothesSwitch={'A'}
                  sizeFileUpload={sizeFileUpload}
                  setSizeFileUpload={setSizeFileUpload}
                  imageFileUpload={imageFileUpload}
                  setImageFileUpload={setImageFileUpload}
                  sizeFileUploadA={sizeFileUploadA}
                  imageFileUploadA={imageFileUploadA}
                  setSizeFileUploadA={setSizeFileUploadA}
                  setImageFileUploadA={setImageFileUploadA}
                  deleteImage={deleteImage}
                />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant='ghost'
              mr={3}
              onClick={() => {
                onClear();
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
