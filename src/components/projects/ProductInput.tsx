/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Divider,
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
} from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { BsXCircleFill } from "react-icons/bs";
import { db } from "../../../firebase";
import { useProjectInput } from "../../hooks/useProjectInput";
import { ColorType } from "../../types/ColorType";

type Props = {
  items: any;
  setItems: Function;
  productIndex: number;
  sizeFileUpload: any;
  setSizeFileUpload: Function;
  imageFileUpload: any;
  setImageFileUpload: Function;
  deleteImage: Function;

  productName: string;
  price: string;
  size: string;
  quantity: string;
  fixedQuantity: string;
  inseam: string;
  imageUrl: string;
  imagePath: string;
  sizeUrl: string;
  sizePath: string;
  color: string;
};

const ProductInput: NextPage<Props> = ({
  items,
  setItems,
  sizeFileUpload,
  setSizeFileUpload,
  imageFileUpload,
  setImageFileUpload,
  deleteImage,
  productName,
  price,
  size,
  quantity,
  fixedQuantity,
  inseam,
  imageUrl,
  imagePath,
  sizeUrl,
  sizePath,
  color,
}) => {
  const {
    handleInputChange,
    handleSwitchChange,
    handleNumberChange,
    handleCheckedChange,
  } = useProjectInput(items, setItems);
  const sizeData1 = ["別", "F", "WS", "WM", "WL", "3S", "SS"];
  const sizeData2 = ["S", "M", "L", "LL", "EL", "3L", "4L", "5L", "6L"];
  const sizeData3 = ["21.0cm", "21.5cm", "22.0cm", "22.5cm", "23.0cm"];
  const sizeData4 = ["23.5cm", "24.0cm", "24.5cm", "25.0cm", "25.5cm"];
  const sizeData5 = ["26.0cm", "26.5cm", "27.0cm", "27.5cm", "28.0cm"];
  const sizeData6 = ["28.5cm", "29.0cm", "30.0cm"];
  const [colors, setColors] = useState([] as ColorType[]);
  console.log(items);
  useEffect(() => {
    const getSColors = async () => {
      const q = query(collection(db, "colors"), orderBy("title", "asc"));

      onSnapshot(q, (querySnapshot) =>
        setColors(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as ColorType)
          )
        )
      );
    };
    getSColors();
  }, []);

  const productNameElement = (productName: string) => (
    <>
      <Text>商品名</Text>
      <Input
        mt={1}
        type="text"
        placeholder="商品名"
        name={productName}
        value={items[productName]}
        onChange={(e) => handleInputChange(e)}
      />
    </>
  );

  const priceElement = (price: string) => (
    <Box mt={6}>
      <Text>販売価格</Text>
      <Input
        mt={1}
        textAlign="right"
        maxW="100px"
        type="number"
        name={price}
        value={Number(items[price]) || 0}
        onChange={(e) => handleInputChange(e)}
      />
      <Box as="span" ml={1}>
        円
        <Box as="span" fontWeight="bold">
          （税込）
        </Box>
      </Box>
    </Box>
  );

  // サイズ選択表示
  const sizeList = (array: string[], size: string) => (
    <Box>
      <Stack spacing={[1, 3]} mt={1} direction={["column", "row"]}>
        {array.map((value, index) => (
          <Checkbox
            isChecked={true}
            key={index}
            value={value}
            onChange={(e) => handleCheckedChange(e, size)}
          >
            {value}
          </Checkbox>
        ))}
      </Stack>
    </Box>
  );

  const sizeElement = (size: string) => (
    <Box mt={6}>
      <CheckboxGroup colorScheme="green" defaultValue={items[size]}>
        <Text>■サイズ</Text>
        <Flex flexDirection="column">
          {sizeList(sizeData1, size)}
          {sizeList(sizeData2, size)}
          {sizeList(sizeData3, size)}
          {sizeList(sizeData4, size)}
          {sizeList(sizeData5, size)}
          {sizeList(sizeData6, size)}
        </Flex>
      </CheckboxGroup>
      {items[size]?.length > 0 && (
        <Flex mt={2} p={1} bgColor="gray.100" w="100%">
          <Box w="80px" mr={3}>
            表示順
          </Box>
          <Flex flexWrap="wrap" w="100%">
            {items[size].map((size: string) => (
              <Box key={size} mr={3}>
                {size}
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
  );

  // color選択表示
  const colorList = (array: ColorType[], color: string) => (
    <Box>
      <Flex
        mt={1}
        gap={3}
        flexWrap={{ base: "wrap", sm: "wrap" }}
        flexDirection={{ base: "column", sm: "row" }}
      >
        {array.map((value, index) => (
          <Checkbox
            isChecked={true}
            key={index}
            value={value.title}
            onChange={(e) => handleCheckedChange(e, color)}
          >
            {value.title}
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );

  const colorElement = (color: string) => (
    <Box mt={6}>
      <CheckboxGroup colorScheme="green" defaultValue={items[color]}>
        <Text>■カラー</Text>
        <Flex flexDirection="column">{colorList(colors, color)}</Flex>
      </CheckboxGroup>

      {items[color]?.length > 0 && (
        <Flex mt={2} p={1} bgColor="gray.100" w="100%">
          <Box w="80px" mr={3}>
            表示順
          </Box>
          <Flex flexWrap="wrap" w="100%">
            {items[color].map((value: string) => (
              <Box key={value} mr={3}>
                {value}
              </Box>
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
  );

  const quantityElement = (quantity: string, fixedQuantity: string) => (
    <Flex mt={6} justifyContent="flex-start" gap={6}>
      <FormControl display="flex" alignItems="center" w="auto">
        <FormLabel htmlFor={"quantityA"} w="80px" mb="0">
          数量入力値
        </FormLabel>
        <Switch
          id={quantity}
          isChecked={items[quantity]}
          onChange={() => handleSwitchChange(quantity)}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor={fixedQuantity} w="80px" mr="0" mb="0">
          固定数量
        </FormLabel>
        <NumberInput
          id={fixedQuantity}
          name={fixedQuantity}
          min={1}
          w="80px"
          value={items[fixedQuantity]}
          onChange={(e) => handleNumberChange(e, fixedQuantity)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </Flex>
  );

  const inseamElement = (inseam: string) => (
    <Box mt={6}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor={inseam} mb="0">
          股下修理
        </FormLabel>
        <Switch
          id={inseam}
          isChecked={items[inseam]}
          onChange={() => handleSwitchChange(inseam)}
        />
      </FormControl>
    </Box>
  );

  const imageElement = (
    title: string,
    imageUrl: string,
    imagePath: string,
    propUrl: string,
    propPath: string,
    fileUpload: any,
    setFileUpload: any
  ) => (
    <>
      <Box mt={6}>
        <Text>{title}</Text>
        {!items[imageUrl] && !fileUpload && (
          <FormControl mt={2}>
            <FormLabel htmlFor={propUrl} mb="0" w="150px" cursor="pointer">
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
              id={propUrl}
              display="none"
              type="file"
              accept="image/*"
              value={fileUpload ? fileUpload?.name : ""}
              onChange={(e) => setFileUpload(e.target.files)}
            />
          </FormControl>
        )}

        {(items[imageUrl] || fileUpload?.[0]) && (
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
                <BsXCircleFill
                  fontSize="30px"
                  onClick={() =>
                    deleteImage(
                      items[imageUrl],
                      items[imagePath],
                      propUrl,
                      propPath,
                      setFileUpload
                    )
                  }
                />
              </Box>

              {items[imageUrl] && (
                <img width="100%" src={items[imageUrl]} alt={items[imageUrl]} />
              )}
              {fileUpload?.[0] && (
                <>
                  <img
                    width="100%"
                    src={window.URL.createObjectURL(fileUpload[0])}
                    alt={fileUpload[0].name}
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

  return (
    <>
      {productNameElement(productName)}
      {priceElement(price)}
      {sizeElement(size)}
      {colorElement(color)}
      {quantityElement(quantity, fixedQuantity)}
      {inseamElement(inseam)}
      <>
        {imageElement(
          "サイズスペック画像",
          sizeUrl,
          sizePath,
          sizeUrl,
          sizePath,
          sizeFileUpload,
          setSizeFileUpload
        )}
        {imageElement(
          "イメージ画像",
          imageUrl,
          imagePath,
          imageUrl,
          imagePath,
          imageFileUpload,
          setImageFileUpload
        )}
      </>

      <Divider my={6} />
    </>
  );
};

export default ProductInput;
