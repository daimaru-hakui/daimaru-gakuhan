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

import { NextPage } from "next";
import React from "react";
import { BsXCircleFill } from "react-icons/bs";
import { useProjectInput } from "../../hooks/useProjectInput";

type Props = {
  items: any;
  setItems: Function;
  productIndex: number;
  sizeFileUpload: any;
  setSizeFileUpload: Function;
  imageFileUpload: any;
  setImageFileUpload: Function;
  deleteImage: Function;
};

const ProductInputMan: NextPage<Props> = ({
  items,
  setItems,
  sizeFileUpload,
  setSizeFileUpload,
  imageFileUpload,
  setImageFileUpload,
  deleteImage,
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

  // サイズ選択表示
  const sizeList = (array: string[]) => (
    <Box>
      <Stack spacing={[1, 3]} mt={1} direction={["column", "row"]}>
        {array.map((size, index) => (
          <Checkbox
            isChecked={true}
            key={index}
            value={size}
            onChange={(e) => handleCheckedChange(e, "size")}
          >
            {size}
          </Checkbox>
        ))}
      </Stack>
    </Box>
  );

  console.log(items);

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
        {!imageUrl && !fileUpload && (
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

        {(imageUrl || fileUpload?.[0]) && (
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
                      imageUrl,
                      imagePath,
                      propUrl,
                      propPath,
                      setFileUpload
                    )
                  }
                />
              </Box>

              {imageUrl && <img width="100%" src={imageUrl} alt={imageUrl} />}

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
      <Box my={6} p={1} color="white" textAlign="center" bg="facebook.300">
        {items.clothesType === "1" ? "男女兼用" : "男性用"}
      </Box>

      <Text>商品名</Text>
      <Input
        mt={1}
        type="text"
        placeholder="商品名"
        name={"productName"}
        value={items.productName}
        onChange={(e) => handleInputChange(e)}
      />
      <Box mt={6}>
        <Text>販売価格</Text>
        <Input
          mt={1}
          textAlign="right"
          maxW="100px"
          type="number"
          name={"price"}
          value={Number(items?.price) || 0}
          onChange={(e) => handleInputChange(e)}
        />
        <Box as="span" ml={1}>
          円
          <Box as="span" fontWeight="bold">
            （税込）
          </Box>
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

        <>
          {items?.size?.length > 0 && (
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
          )}
        </>
      </Box>

      <Flex mt={6} justifyContent="flex-start" gap={6}>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor={"quantityA"} w="80px" mb="0">
            数量入力値
          </FormLabel>
          <Switch
            id={"quantity"}
            isChecked={items.quantity}
            onChange={() => handleSwitchChange("quantity")}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor={"fixedqantity"} w="80px" mr="0" mb="0">
            固定数量
          </FormLabel>
          <NumberInput
            id={"fixedqantity"}
            name={"fixedqantity"}
            min={1}
            w="80px"
            value={items.fixedQuantity}
            onChange={(e) => handleNumberChange(e, "fixedQuantity")}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Flex>

      <Box mt={6}>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor={"inseam"} mb="0">
            股下修理
          </FormLabel>
          <Switch
            id="inseam"
            isChecked={items.inseam}
            onChange={() => handleSwitchChange("inseam")}
          />
        </FormControl>
      </Box>

      <>
        {imageElement(
          "サイズスペック画像",
          items.sizeUrl,
          items.sizePath,
          "sizeUrl",
          "sizePath",
          sizeFileUpload,
          setSizeFileUpload
        )}
        {imageElement(
          "イメージ画像",
          items.imageUrl,
          items.imagePath,
          "imageUrl",
          "imagePath",
          imageFileUpload,
          setImageFileUpload
        )}
      </>

      <Divider my={6} />
    </>
  );
};

export default ProductInputMan;
