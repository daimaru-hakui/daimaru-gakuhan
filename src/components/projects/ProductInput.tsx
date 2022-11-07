/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsXCircleFill } from "react-icons/bs";
import { useSetRecoilState } from "recoil";
import { db, storage } from "../../../firebase";
import { loadingState } from "../../../store";

type Props = {
  items: any;
  setItems: Function;
  productIndex: number;
  type: string;
};

const ProductInput: NextPage<Props> = ({
  items,
  setItems,
  productIndex,
  type,
}) => {
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingState);
  const [products, setProducts] = useState<any>();
  const [sizeFileUpload, setSizeFileUpload] = useState<any>();
  const [imageFileUpload, setImageFileUpload] = useState<any>();

  const sizeData1 = [
    { id: "F", label: "F" },
    { id: "3S", label: "3S" },
    { id: "SS", label: "SS" },
    { id: "S", label: "S" },
    { id: "M", label: "M" },
    { id: "L", label: "L" },
  ];
  const sizeData2 = [
    { id: "LL", label: "LL" },
    { id: "EL", label: "EL" },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleSwitchChange = (type: string) => {
    const value = items[type] ? false : true;
    setItems({ ...items, [type]: value });
  };

  const handleRadioChange = (e: string, type: string) => {
    const value = e;
    setItems({ ...items, [type]: value });
  };

  const handleNumberChange = (e: any, type: string) => {
    const value = e;
    const name = type;
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

  // サイズスペック画像削除
  const deleteSizeSpec = async () => {
    if (items.sizeUrl) {
      const result = window.confirm("画像を削除して宜しいでしょうか");
      if (!result) return;
    }
    setLoading(true);
    const sizeRef = ref(storage, `${items.sizePath}`);
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      await deleteObject(sizeRef);
      if (products[productIndex]) {
        const productsArray = products?.map((product: any, index: number) => {
          if (index === productIndex) {
            return {
              ...items,
              sizeUrl: "",
              sizePath: "",
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
      setSizeFileUpload(null);
      setLoading(false);
    }
  };

  // イメージ画像削除
  const deleteImageGazo = async () => {
    if (items.sizeUrl) {
      const result = window.confirm("画像を削除して宜しいでしょうか");
      if (!result) return;
    }
    setLoading(true);
    const imageRef = ref(storage, `${items.imagePath}`);
    const docRef = doc(db, "projects", `${router.query.id}`);
    try {
      await deleteObject(imageRef);
      if (products[productIndex]) {
        const productsArray = products?.map((product: any, index: number) => {
          if (index === productIndex) {
            return {
              ...items,
              imageUrl: "",
              imagePath: "",
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
      setImageFileUpload(null);
      setLoading(false);
    }
  };

  return (
    <>
      <Text>商品名</Text>
      <Input
        mt={1}
        type="text"
        placeholder="商品名"
        name={"productName" + type}
        value={type === "" ? items.productName : items.productNameA}
        onChange={(e) => handleInputChange(e)}
      />
      <Box mt={6}>
        <Text>金額（税抜き金額を入力してください）</Text>
        <Input
          mt={1}
          textAlign="right"
          maxW="100px"
          type="number"
          name={"price" + type}
          value={
            type === "" ? Number(items?.price) || 0 : Number(items?.priceA) || 0
          }
          onChange={(e) => handleInputChange(e)}
        />
        <Box as="span" ml={1}>
          円
        </Box>
      </Box>

      <Box mt={6}>
        <CheckboxGroup
          colorScheme="green"
          defaultValue={type === "" ? items?.size : items?.sizeA}
        >
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

      <Flex mt={6} justifyContent="flex-start" gap={6}>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor={"quantity" + type} w="80px" mb="0">
            数量入力値
          </FormLabel>
          <Switch
            id={"quantity" + type}
            isChecked={type === "" ? items.quantity : items.quantityA}
            onChange={() => handleSwitchChange("quantity" + type)}
          />
        </FormControl>
        {(type === "" ? !items.quantity : !items.quantityA) && (
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor={"fixedqantity" + type} w="80px" mr={0} mb="0">
              固定数量
            </FormLabel>
            <NumberInput
              id={"fixedqantity" + type}
              name={"fixedqantity" + type}
              min={1}
              w="80px"
              value={type === "" ? items.fixedQuantity : items.fixedQuantityA}
              onChange={(e) => handleNumberChange(e, "fixedQuantity" + type)}
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
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor={"inseam" + type} mb="0">
            股下修理
          </FormLabel>
          <Switch
            id="inseam"
            isChecked={type === "" ? items.inseam : items.inseamA}
            onChange={() => handleSwitchChange("inseam" + type)}
          />
        </FormControl>
      </Box>

      <Box mt={6}>
        <Text>サイズスペック画像</Text>
        {!items?.sizeUrl && !sizeFileUpload && (
          <FormControl mt={2}>
            <FormLabel htmlFor="gazo" mb="0" w="150px" cursor="pointer">
              <Box
                p={2}
                textAlign="center"
                color="white"
                bg="#385898"
                rounded="md"
              >
                アップロード
              </Box>
            </FormLabel>
            <Input
              mt={1}
              id="gazo"
              display="none"
              type="file"
              accept="image/*"
              value={sizeFileUpload ? sizeFileUpload.name : ""}
              onChange={(e) => setSizeFileUpload(e.target.files)}
            />
          </FormControl>
        )}

        {(items?.sizeUrl || sizeFileUpload?.[0]) && (
          <>
            <Box mt={2} position="relative" w="auto">
              <Box
                position="absolute"
                left="50%"
                transform="translate(-50%,-50%)"
                rounded="50%"
                cursor="pointer"
                bg="white"
              >
                <BsXCircleFill fontSize="30px" onClick={deleteSizeSpec} />
              </Box>
              {items?.sizeUrl && (
                <img width="100%" src={items?.sizeUrl} alt={items?.sizeUrl} />
              )}
              {sizeFileUpload?.[0] && (
                <>
                  <img
                    width="100%"
                    src={window.URL.createObjectURL(sizeFileUpload[0])}
                    alt={sizeFileUpload[0].name}
                  />
                  <Text mt={1} fontWeight="bold">
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
            <FormLabel htmlFor="gazo" mb="0" w="150px" cursor="pointer">
              <Box
                p={2}
                textAlign="center"
                color="white"
                bg="#385898"
                rounded="md"
              >
                アップロード
              </Box>
            </FormLabel>
            <Input
              mt={1}
              id="gazo"
              display="none"
              type="file"
              accept="image/*"
              value={imageFileUpload ? imageFileUpload.name : ""}
              onChange={(e) => setImageFileUpload(e.target.files)}
            />
          </FormControl>
        )}

        {(items?.imageUrl || imageFileUpload?.[0]) && (
          <>
            <Box mt={2} position="relative" w="auto">
              <Box
                position="absolute"
                left="50%"
                transform="translate(-50%,-50%)"
                rounded="50%"
                cursor="pointer"
                bg="white"
              >
                <BsXCircleFill fontSize="30px" onClick={deleteImageGazo} />
              </Box>
              {items?.imageUrl && (
                <img width="100%" src={items?.imageUrl} alt={items?.imageUrl} />
              )}
              {imageFileUpload?.[0] && (
                <>
                  <img
                    width="100%"
                    src={window.URL.createObjectURL(imageFileUpload[0])}
                    alt={imageFileUpload[0].name}
                  />
                  <Text mt={1} fontWeight="bold">
                    ※プレビュー画像です。登録ボタンを押して確定してください。
                  </Text>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default ProductInput;
