/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
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
  Select,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BsXCircleFill } from "react-icons/bs";
import { useToast } from "@chakra-ui/react";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import { db, storage } from "../../../firebase";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store";
import ProductInput from "./ProductInput";

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
  const [sizeFileUpload, setSizeFileUpload] = useState<any>();
  const [imageFileUpload, setImageFileUpload] = useState<any>();
  const [items, setItems] = useState<any>({
    productName: "",
    price: "",
    size: [""],
    inseam: "",
    quantity: "",
    sizeUrl: "",
    sizePath: "",
    imageUrl: "",
    imagePath: "",
    fixedQuantity: "",
    productNameA: "",
    priceA: "",
    sizeA: [""],
    inseamA: "",
    quantityA: "",
    sizeUrlA: "",
    sizePathA: "",
    imageUrlA: "",
    imagePathA: "",
    fixedQuantityA: "",
  });

  console.log(items);

  // projectのproductsを取得
  useEffect(() => {
    const getProject = async () => {
      const unsub = onSnapshot(
        doc(db, "projects", `${router.query.id}`),
        (doc) => {
          setProducts(doc.data()?.products);
          const product = doc.data()?.products[productIndex];
          setItems({
            productName: product?.productName,
            price: product?.price || 0,
            size: product?.size || [],
            quantity: product?.quantity || false,
            fixedQuantity: product?.fixedQuantity || 1,
            inseam: product?.inseam || false,
            sizeUrl: product?.sizeUrl || "",
            sizePath: product?.sizePath || "",
            imageUrl: product?.imageUrl || "",
            imagePath: product?.imagePath || "",
            productNameA: product?.productNameA,
            priceA: product?.priceA || 0,
            sizeA: product?.sizeA || [],
            quantityA: product?.quantityA || false,
            fixedQuantityA: product?.fixedQuantityA || 1,
            inseamA: product?.inseamA || false,
            sizeUrlA: product?.sizeUrlA || "",
            sizePathA: product?.sizePathA || "",
            imageUrlA: product?.imageUrlA || "",
            imagePathA: product?.imagePathA || "",
          });
        }
      );
    };
    getProject();
  }, [router.query.id, productIndex]);

  // 商品を登録
  const addProduct = async () => {
    setLoading(true);
    let sizeUrl = items.sizeUrl || "";
    let sizePath = items.sizePath || "";
    let imageUrl = items.imageUrl || "";
    let imagePath = items.imagePath || "";

    // 画像が登録されてなければ画像を登録
    if (!items.sizeUrl) {
      if (sizeFileUpload) {
        const file = sizeFileUpload[0];
        const fileName = new Date().getTime() + "_" + file.name;
        const path = `size/${fileName}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        sizeUrl = await getDownloadURL(ref(storage, path));
        sizePath = storageRef.fullPath;
        setSizeFileUpload("");
      }
    }
    if (!items.imageUrl) {
      if (imageFileUpload) {
        const file = imageFileUpload[0];
        const fileName = new Date().getTime() + "_" + file.name;
        const path = `size/${fileName}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(ref(storage, path));
        imagePath = storageRef.fullPath;
        setImageFileUpload("");
      }
    }
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      if (products[productIndex]) {
        const productsArray = products?.map((product: any, index: number) => {
          if (index === productIndex) {
            return { ...items, sizeUrl, sizePath, imageUrl, imagePath };
          } else {
            return product;
          }
        });
        await updateDoc(docRef, {
          products: [...productsArray],
        });
        toast({
          title: "商品登録を更新しました",
          status: "success",
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
          }),
        });
        toast({
          title: "商品登録を登録しました",
          status: "success",
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

  const onClear = () => {
    setItems({
      ...products[productIndex],
    });
    setSizeFileUpload(null);
  };

  return (
    <>
      <Flex justifyContent="center">
        {buttonDesign === "add" && (
          <FaPlusCircle
            size="25"
            onClick={() => {
              onOpen();
            }}
            cursor="pointer"
          />
        )}
        {buttonDesign === "edit" && (
          <FaEdit size="25" onClick={onOpen} cursor="pointer" />
        )}
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onClear();
        }}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>商品登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductInput
              items={items}
              setItems={setItems}
              productIndex={productIndex}
              type={""}
            />
            {/* <ProductInput
              items={items}
              setItems={setItems}
              productIndex={productIndex}
              type={"A"}
            /> */}

            {/* <Text>商品名</Text>
            <Input
              mt={1}
              type='text'
              placeholder='商品名'
              name='productName'
              value={items.productName}
              onChange={(e) => handleInputChange(e)}
            />
            <Box mt={6}>
              <Text>金額（税抜き金額を入力してください）</Text>
              <Input
                mt={1}
                textAlign='right'
                maxW='100px'
                type='number'
                name='price'
                value={Number(items?.price) || 0}
                onChange={(e) => handleInputChange(e)}
              />
              <Box as='span' ml={1}>
                円
              </Box>
            </Box>

            <Box mt={6}>
              <CheckboxGroup colorScheme='green' defaultValue={items?.size}>
                <Text>サイズ</Text>
                <Flex flexDirection='column'>
                  {sizeList(sizeData1)}
                  {sizeList(sizeData2)}
                  {sizeList(sizeData3)}
                  {sizeList(sizeData4)}
                  {sizeList(sizeData5)}
                  {sizeList(sizeData6)}
                </Flex>
              </CheckboxGroup>
              {items?.size?.length > 0 && (
                <>
                  <Flex mt={2} p={1} bgColor='green.100' w='100%'>
                    <Box w='80px' mr={3}>
                      表示順
                    </Box>
                    <Flex flexWrap='wrap' w='100%'>
                      {items.size.map((size: string) => (
                        <Box key={size} mr={3}>
                          {size}
                        </Box>
                      ))}
                    </Flex>
                  </Flex>
                </>
              )}
            </Box>

            <Flex mt={6} justifyContent='flex-start' gap={6}>
              <FormControl display='flex' alignItems='center' w='auto'>
                <FormLabel htmlFor='quantity' w='80px' mb='0'>
                  数量入力値
                </FormLabel>
                <Switch
                  id='quantity'
                  isChecked={items.quantity}
                  onChange={() => handleSwitchChange('quantity')}
                />
              </FormControl>
              {!items.quantity && (
                <FormControl display='flex' alignItems='center'>
                  <FormLabel htmlFor='fixedqantity' w='80px' mr={0} mb='0'>
                    固定数量
                  </FormLabel>
                  <NumberInput
                    id='fixedqantity'
                    name='fixedQantity'
                    // defaultValue={1}
                    min={1}
                    w='80px'
                    value={items.fixedQuantity}
                    onChange={handleNumberChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              )}
            </Flex>

            <Box mt={6}>
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='inseam' mb='0'>
                  股下修理
                </FormLabel>
                <Switch
                  id='inseam'
                  isChecked={items.inseam}
                  onChange={() => handleSwitchChange('inseam')}
                />
              </FormControl>
            </Box>

            <Box mt={6}>
              <Text>サイズスペック画像</Text>
              {!items?.sizeUrl && !sizeFileUpload && (
                <FormControl mt={2}>
                  <FormLabel htmlFor='gazo' mb='0' w='150px' cursor='pointer'>
                    <Box
                      p={2}
                      textAlign='center'
                      color='white'
                      bg='#385898'
                      rounded='md'
                    >
                      アップロード
                    </Box>
                  </FormLabel>
                  <Input
                    mt={1}
                    id='gazo'
                    display='none'
                    type='file'
                    accept='image/*'
                    value={sizeFileUpload ? sizeFileUpload.name : ''}
                    onChange={(e) => setSizeFileUpload(e.target.files)}
                  />
                </FormControl>
              )}

              {(items?.sizeUrl || sizeFileUpload?.[0]) && (
                <>
                  <Box mt={2} position='relative' w='auto'>
                    <Box
                      position='absolute'
                      left='50%'
                      transform='translate(-50%,-50%)'
                      rounded='50%'
                      cursor='pointer'
                      bg='white'
                    >
                      <BsXCircleFill fontSize='30px' onClick={deleteSizeSpec} />
                    </Box>
                    {items?.sizeUrl && (
                      <img
                        width='100%'
                        src={items?.sizeUrl}
                        alt={items?.sizeUrl}
                      />
                    )}
                    {sizeFileUpload?.[0] && (
                      <>
                        <img
                          width='100%'
                          src={window.URL.createObjectURL(sizeFileUpload[0])}
                          alt={sizeFileUpload[0].name}
                        />
                        <Text mt={1} fontWeight='bold'>
                          ※プレビュー画像です。登録ボタンを押して確定してください。
                        </Text>
                      </>
                    )}
                  </Box>
                </>
              )}
            </Box>

            <Box mt={6}>
              <Text>イメージ画像</Text>
              {!items?.imageUrl && !imageFileUpload && (
                <FormControl mt={2}>
                  <FormLabel htmlFor='gazo' mb='0' w='150px' cursor='pointer'>
                    <Box
                      p={2}
                      textAlign='center'
                      color='white'
                      bg='#385898'
                      rounded='md'
                    >
                      アップロード
                    </Box>
                  </FormLabel>
                  <Input
                    mt={1}
                    id='gazo'
                    display='none'
                    type='file'
                    accept='image/*'
                    value={imageFileUpload ? imageFileUpload.name : ''}
                    onChange={(e) => setImageFileUpload(e.target.files)}
                  />
                </FormControl>
              )}

              {(items?.imageUrl || imageFileUpload?.[0]) && (
                <>
                  <Box mt={2} position='relative' w='auto'>
                    <Box
                      position='absolute'
                      left='50%'
                      transform='translate(-50%,-50%)'
                      rounded='50%'
                      cursor='pointer'
                      bg='white'
                    >
                      <BsXCircleFill
                        fontSize='30px'
                        onClick={deleteImageGazo}
                      />
                    </Box>
                    {items?.imageUrl && (
                      <img
                        width='100%'
                        src={items?.imageUrl}
                        alt={items?.imageUrl}
                      />
                    )}
                    {imageFileUpload?.[0] && (
                      <>
                        <img
                          width='100%'
                          src={window.URL.createObjectURL(imageFileUpload[0])}
                          alt={imageFileUpload[0].name}
                        />
                        <Text mt={1} fontWeight='bold'>
                          ※プレビュー画像です。登録ボタンを押して確定してください。
                        </Text>
                      </>
                    )}
                  </Box>
                </>
              )}
            </Box> */}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
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
              colorScheme="facebook"
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
