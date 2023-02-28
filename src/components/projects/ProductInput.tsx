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

type Props = {
  items: any;
  setItems: Function;
  productIndex: number;
  clothesSwitch: string;
  sizeFileUpload: any;
  setSizeFileUpload: Function;
  imageFileUpload: any;
  setImageFileUpload: Function;
  sizeFileUploadA: any;
  setSizeFileUploadA: Function;
  imageFileUploadA: any;
  setImageFileUploadA: Function;
  deleteImage: Function;
};

const ProductInput: NextPage<Props> = ({
  items,
  setItems,
  clothesSwitch,
  sizeFileUpload,
  setSizeFileUpload,
  imageFileUpload,
  setImageFileUpload,
  sizeFileUploadA,
  setSizeFileUploadA,
  imageFileUploadA,
  setImageFileUploadA,
  deleteImage,
}) => {
  const sizeData1 = [
    { id: "別", label: "別" },
    { id: "F", label: "F" },
    { id: "WS", label: "WS" },
    { id: "WM", label: "WM" },
    { id: "WL", label: "WL" },
    { id: "3S", label: "3S" },
    { id: "SS", label: "SS" },
  ];
  const sizeData2 = [
    { id: "S", label: "S" },
    { id: "M", label: "M" },
    { id: "L", label: "L" },
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
    { id: "26.0cm", label: "26.0cm" },
    { id: "26.5cm", label: "26.5cm" },
    { id: "27.0cm", label: "27.0cm" },
    { id: "27.5cm", label: "27.5cm" },
    { id: "28.0cm", label: "28.0cm" },
  ];
  const sizeData6 = [
    { id: "28.5cm", label: "28.5cm" },
    { id: "29.0cm", label: "29.0cm" },
    { id: "30.0cm", label: "30.0cm" },
  ];

  // サイズ選択表示
  const sizeList = (array: { id: string; label: string }[]) => (
    <Box>
      <Stack spacing={[1, 3]} mt={1} direction={["column", "row"]}>
        {array.map((size) => (
          <Checkbox
            isChecked={true}
            key={size.id}
            value={size.label}
            onChange={(e) => handleCheckedChange(e, clothesSwitch)}
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

  const handleCheckedChange = (e: any, type: string) => {
    const name = "size" + type;
    if (e.target.checked) {
      setItems({
        ...items,
        [name]: [...(items[name] || ""), e.target.value],
      });
    } else {
      setItems({
        ...items,
        [name]: [
          ...items[name]?.filter((size: string) => size !== e.target.value),
        ],
      });
    }
  };

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
      {Number(items.clothesType) === 2 &&
        (clothesSwitch === "" ? (
          <Box my={6} p={1} color="white" textAlign="center" bg="facebook.300">
            男性用
          </Box>
        ) : (
          <Box my={6} p={1} textAlign="center" bg="red.200">
            女性用
          </Box>
        ))}
      <Text>商品名</Text>
      <Input
        mt={1}
        type="text"
        placeholder="商品名"
        name={"productName" + clothesSwitch}
        value={clothesSwitch === "" ? items.productName : items.productNameA}
        onChange={(e) => handleInputChange(e)}
      />
      <Box mt={6}>
        <Text>販売価格</Text>
        <Input
          mt={1}
          textAlign="right"
          maxW="100px"
          type="number"
          name={"price" + clothesSwitch}
          value={
            clothesSwitch === ""
              ? Number(items?.price) || 0
              : Number(items?.priceA) || 0
          }
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
        <CheckboxGroup
          colorScheme="green"
          defaultValue={clothesSwitch === "" ? items?.size : items?.sizeA}
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
        {clothesSwitch === "" ? (
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
        ) : (
          <>
            {items?.sizeA?.length > 0 && (
              <Flex mt={2} p={1} bgColor="green.100" w="100%">
                <Box w="80px" mr={3}>
                  表示順
                </Box>
                <Flex flexWrap="wrap" w="100%">
                  {items.sizeA.map((size: string) => (
                    <Box key={size} mr={3}>
                      {size}
                    </Box>
                  ))}
                </Flex>
              </Flex>
            )}
          </>
        )}
      </Box>

      <Flex mt={6} justifyContent="flex-start" gap={6}>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor={"quantity" + clothesSwitch} w="80px" mb="0">
            数量入力値
          </FormLabel>
          <Switch
            id={"quantity" + clothesSwitch}
            isChecked={clothesSwitch === "" ? items.quantity : items.quantityA}
            onChange={() => handleSwitchChange("quantity" + clothesSwitch)}
          />
        </FormControl>
        {(clothesSwitch === "" ? !items.quantity : !items.quantityA) && (
          <FormControl display="flex" alignItems="center">
            <FormLabel
              htmlFor={"fixedqantity" + clothesSwitch}
              w="80px"
              mr="0"
              mb="0"
            >
              固定数量
            </FormLabel>
            <NumberInput
              id={"fixedqantity" + clothesSwitch}
              name={"fixedqantity" + clothesSwitch}
              min={1}
              w="80px"
              value={
                clothesSwitch === ""
                  ? items.fixedQuantity
                  : items.fixedQuantityA
              }
              onChange={(e) =>
                handleNumberChange(e, "fixedQuantity" + clothesSwitch)
              }
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
          <FormLabel htmlFor={"inseam" + clothesSwitch} mb="0">
            股下修理
          </FormLabel>
          <Switch
            id="inseam"
            isChecked={clothesSwitch === "" ? items.inseam : items.inseamA}
            onChange={() => handleSwitchChange("inseam" + clothesSwitch)}
          />
        </FormControl>
      </Box>

      {clothesSwitch === "" ? (
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
      ) : (
        <>
          {imageElement(
            "サイズスペック画像（女性用）",
            items.sizeUrlA,
            items.sizePathA,
            "sizeUrlA",
            "sizePathA",
            sizeFileUploadA,
            setSizeFileUploadA
          )}
          {imageElement(
            "イメージ画像（女性用）",
            items.imageUrlA,
            items.imagePathA,
            "imageUrlA",
            "imagePathA",
            imageFileUploadA,
            setImageFileUploadA
          )}
        </>
      )}

      <Divider my={6} />
    </>
  );
};

export default ProductInput;
