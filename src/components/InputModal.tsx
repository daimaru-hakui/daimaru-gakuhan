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
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BsXCircleFill } from "react-icons/bs";
import { useToast } from "@chakra-ui/react";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import { db, storage } from "../../firebase";

type Props = {
  productIndex: number;
  buttonDesign: string;
};

const InputModal: NextPage<Props> = ({ productIndex, buttonDesign }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [products, setProducts] = useState<any>();
  const [fileUpload, setFileUpload] = useState<any>();
  const [items, setItems] = useState<any>({
    productName: "",
    size: [],
    inseam: "",
    quantiry: "",
  });

  const sizeData1 = [
    { id: "F", label: "F" },
    { id: "3s", label: "3S" },
    { id: "SS", label: "SS" },
    { id: "S", label: "S" },
    { id: "M", label: "M" },
    { id: "L", label: "L" },
  ];
  const sizeData2 = [
    { id: "LL", label: "LL" },
    { id: "3L", label: "3L" },
    { id: "4L", label: "4L" },
    { id: "5L", label: "5L" },
    { id: "6L", label: "6L" },
  ];
  const sizeData3 = [
    { id: "21.0cm", label: "21.0cm" },
    { id: "21.5cm", label: "21.5cm" },
    { id: "22.0cm", label: "22.0cm" },
    { id: "22.5cm", label: "22.5cm" },
    { id: "23.0cm", label: "23.0cm" },
  ];
  const sizeData4 = [
    { id: "23.5cm", label: "23.5cm" },
    { id: "24.0cm", label: "24.0cm" },
    { id: "24.5cm", label: "24.5cm" },
    { id: "25.0cm", label: "25.0cm" },
    { id: "25.5cm", label: "25.5cm" },
  ];

  const sizeData5 = [
    { id: "26.5cm", label: "26.5cm" },
    { id: "27.0cm", label: "27.0cm" },
    { id: "27.5cm", label: "27.5cm" },
    { id: "28.0cm", label: "28.0cm" },
    { id: "29.0cm", label: "29.0cm" },
  ];
  const sizeData6 = [{ id: "30.0cm", label: "30.0cm" }];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleCheckedChange = (e: any) => {
    if (e.target.checked) {
      setItems({
        ...items,
        size: [...(items.size || ""), e.target.value],
      });
    } else {
      setItems({
        ...items,
        size: [
          ...items?.size?.filter((size: string) => size !== e.target.value),
        ],
      });
    }
  };

  const handleRadioChange = (e: string, type: string) => {
    const value = e;
    setItems({ ...items, [type]: value });
  };

  const handleSwitchChange = (type: string) => {
    const value = items[type] ? false : true;
    setItems({ ...items, [type]: value });
  };

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
            price: product?.price,
            size: product?.size,
            quantity: product?.quantity || false,
            inseam: product?.inseam || false,
          });
        }
      );
    };
    getProject();
  }, [router.query.id, productIndex]);

  // 商品を登録
  const addProduct = async () => {
    const docRef = doc(db, "projects", `${router.query.id}`);
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

        toast({
          title: "商品登録を更新しました",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await updateDoc(docRef, {
          products: arrayUnion(items),
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
      onClose();
    }
  };

  const onClear = () => {
    setItems({
      ...products[productIndex],
    });
  };

  // サイズ選択表示
  const sizeList = (array: { id: string; label: string }[]) => (
    <Box>
      <Stack spacing={[1, 3]} mt={1} direction={["column", "row"]}>
        {array.map((size) => (
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
  );

  // 画像をアップロード;
  const onFileUpload = (files: any) => {
    if (!files) return;
    const file = files[0];
    const fileName = new Date().getTime() + "_" + file.name;
    const imagePath = `products/${fileName}`;
    const storageRef = ref(storage, imagePath);
    uploadBytes(storageRef, file).then((snapshot: any) => {
      getDownloadURL(ref(storage, imagePath)).then((url) => {
        const docRef = doc(db, "projects", `${router.query.id}`);
        updateDoc(docRef, {
          products: {
            ["imageUrl"]: url,
            ["imagePath"]: storageRef.fullPath,
          },
        });
      });
    });
  };

  const onDeleteFile = () => {
    setFileUpload("");
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
        }}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>商品登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>商品名</Text>
            <Input
              mt={1}
              type="text"
              placeholder="商品名"
              name="productName"
              value={items.productName}
              onChange={(e) => handleInputChange(e)}
            />
            <Box mt={6}>
              <Text>金額（税抜き金額を入力してください）</Text>
              <Input
                mt={1}
                textAlign="right"
                maxW="100px"
                type="number"
                name="price"
                value={Number(items?.price) || 0}
                onChange={(e) => handleInputChange(e)}
              />
              <Box as="span" ml={1}>
                円
              </Box>
            </Box>

            <Box mt={6}>
              <CheckboxGroup colorScheme="green" defaultValue={items?.size}>
                <Text>サイズ</Text>
                <Flex flexDirection="column">
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
                  <Flex mt={2} p={1} bgColor="green.100" w="100%">
                    <Box w="80px" mr={3}>
                      表示順
                    </Box>
                    <Flex flexWrap="wrap" w="100%">
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

            <Box mt={6}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="quantity" mb="0">
                  数量入力値
                </FormLabel>
                <Switch
                  id="quantity"
                  isChecked={items.quantity}
                  onChange={() => handleSwitchChange("quantity")}
                />
              </FormControl>
            </Box>

            <Box mt={6}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="inseam" mb="0">
                  股下修理
                </FormLabel>
                <Switch
                  id="inseam"
                  isChecked={items.inseam}
                  onChange={() => handleSwitchChange("inseam")}
                />
              </FormControl>
            </Box>

            <Box mt={6}>
              <Text>画像</Text>
              {!fileUpload?.length && (
                <FormControl mt={2}>
                  <FormLabel htmlFor="gazo" mb="0" w="100px" cursor="pointer">
                    <Box
                      p={2}
                      textAlign="center"
                      color="white"
                      bg="#385898"
                      rounded="md"
                    >
                      画像登録
                    </Box>
                  </FormLabel>
                  <Input
                    mt={1}
                    id="gazo"
                    display="none"
                    type="file"
                    accept="image/*"
                    value={fileUpload ? fileUpload.name : ""}
                    onChange={(e) => setFileUpload(e.target.files)}
                  />
                </FormControl>
              )}

              {fileUpload?.length > 0 && (
                <>
                  <Box mt={2} position="relative" w="auto">
                    <Box
                      position="absolute"
                      left="50%"
                      transform="translate(-50%,-50%)"
                      bg="white"
                      rounded="50%"
                      cursor="pointer"
                    >
                      <BsXCircleFill fontSize="30px" onClick={onDeleteFile} />
                    </Box>
                    <img
                      width="100%"
                      src={window.URL.createObjectURL(fileUpload[0])}
                      alt={fileUpload[0].name}
                    />
                  </Box>
                </>
              )}
            </Box>
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
