/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Flex,
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
  useDisclosure,
} from "@chakra-ui/react";
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
import { ProductType } from "../../types/ProductType";
import { useProjectInput } from "../../hooks/useProjectInput";

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
  const projectId = (router.isReady && router.query.id) || "";
  const [sizeFileUpload, setSizeFileUpload] = useState<any>();
  const [imageFileUpload, setImageFileUpload] = useState<any>();
  const [sizeFileUploadA, setSizeFileUploadA] = useState<any>();
  const [imageFileUploadA, setImageFileUploadA] = useState<any>();
  const initData = {
    clothesType: "1",
    productName: "",
    price: 0,
    size: [],
    color: [],
    inseam: false,
    quantity: false,
    sizeUrl: "",
    sizePath: "",
    imageUrl: "",
    imagePath: "",
    fixedQuantity: 1,
    productNameA: "",
    priceA: 0,
    sizeA: [],
    colorA: [],
    inseamA: false,
    quantityA: false,
    sizeUrlA: "",
    sizePathA: "",
    imageUrlA: "",
    imagePathA: "",
    fixedQuantityA: 1,
  };
  const [items, setItems] = useState(initData as ProductType);
  const { handleRadioChange } = useProjectInput(items, setItems);

  // projectのproductsを取得
  useEffect(() => {
    const getProject = async () => {
      onSnapshot(doc(db, "projects", `${projectId}`), (doc) => {
        setProducts(doc.data()?.products || items);
        const product = doc.data()?.products[productIndex] || items;
        setItems({
          clothesType: product?.clothesType,

          productName: product?.productName,
          price: product?.price,
          size: product?.size,
          color: product?.color,
          quantity: product?.quantity,
          fixedQuantity: product?.fixedQuantity,
          inseam: product?.inseam,
          sizeUrl: product?.sizeUrl,
          sizePath: product?.sizePath,
          imageUrl: product?.imageUrl,
          imagePath: product?.imagePath,

          productNameA: product?.productNameA,
          priceA: product?.priceA,
          sizeA: product?.sizeA,
          colorA: product?.colorA,
          quantityA: product?.quantityA,
          fixedQuantityA: product?.fixedQuantityA,
          inseamA: product?.inseamA,
          sizeUrlA: product?.sizeUrlA,
          sizePathA: product?.sizePathA,
          imageUrlA: product?.imageUrlA,
          imagePathA: product?.imagePathA,
        });
      });
    };
    getProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, productIndex]);

  // addProductに使う関数（画像を保存）
  const addImage = async (
    url: string,
    fileupload: any,
    setFileUpload: any,
    basePath: string
  ) => {
    if (!url) {
      if (fileupload) {
        const file = fileupload[0];
        const fileName = new Date().getTime() + "_" + file.name;
        const path = `${basePath}/${fileName}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        let downloadUrl = await getDownloadURL(ref(storage, path));
        let fullPath = storageRef.fullPath;
        setFileUpload("");
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
    let sizeUrl = items.sizeUrl || "";
    let sizePath = items.sizePath || "";
    let imageUrl = items.imageUrl || "";
    let imagePath = items.imagePath || "";
    let sizeUrlA = items.sizeUrlA || "";
    let sizePathA = items.sizePathA || "";
    let imageUrlA = items.imageUrlA || "";
    let imagePathA = items.imagePathA || "";

    // 画像が登録されてなければ画像を登録
    const sizeObj = await addImage(
      items.sizeUrl,
      sizeFileUpload,
      setSizeFileUpload,
      "sizes"
    );
    const imageObj = await addImage(
      items.imageUrl,
      imageFileUpload,
      setImageFileUpload,
      "images"
    );
    const sizeObjA = await addImage(
      items.sizeUrlA,
      sizeFileUploadA,
      setSizeFileUploadA,
      "sizes"
    );
    const imageObjA = await addImage(
      items.imageUrlA,
      imageFileUploadA,
      setImageFileUploadA,
      "images"
    );

    const docRef = doc(db, "projects", `${projectId}`);
    try {
      if (products[productIndex]) {
        const productsArray = products?.map(
          (product: ProductType, index: number) => {
            if (index === productIndex) {
              return {
                ...items,
                price: Number(items.price),
                priceA: Number(items.priceA),
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
          }
        );
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
            sizeUrlA,
            sizePathA,
            imageUrlA,
            imagePathA,
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

  // サイズスペック画像削除
  const deleteImage = async (
    imageUrl: string,
    imagePath: string,
    propUrl: string,
    propPath: string,
    setFileUpload: any
  ) => {
    if (imageUrl) {
      const result = window.confirm("画像を削除して宜しいでしょうか");
      if (!result) return;
    }
    setLoading(true);
    const imageRef = ref(storage, `${imagePath}`);
    const docRef = doc(db, "projects", `${projectId}`);
    try {
      await deleteObject(imageRef);
      if (products[productIndex]) {
        const productsArray = products?.map(
          (product: ProductType, index: number) => {
            if (index === productIndex) {
              return {
                ...items,
                [propUrl]: "",
                [propPath]: "",
              };
            } else {
              return product;
            }
          }
        );

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

  const onReset = () => {
    setItems({
      ...(products[productIndex] || initData),
    });
    setSizeFileUpload(null);
  };

  return (
    <>
      <Flex justifyContent="center">
        {buttonDesign === "add" && (
          <Button
            onClick={() => {
              onOpen();
            }}
            colorScheme="facebook"
            leftIcon={<FaPlusCircle size="25" cursor="pointer" />}
          >
            商品を追加
          </Button>
        )}
        {buttonDesign === "edit" && (
          <FaEdit size="25" onClick={onOpen} cursor="pointer" />
        )}
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          onReset();
        }}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>商品登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={6}>
              <RadioGroup
                value={Number(items.clothesType)}
                defaultValue="1"
                onChange={(e) => handleRadioChange(e, "clothesType")}
              >
                <Stack direction={["column", "row"]} mt={2}>
                  <Radio value={1} pr={6}>
                    男女兼用
                  </Radio>
                  <Radio value={2} pr={6}>
                    男性用・女性用
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>

            <Box my={6} p={1} color="white" textAlign="center" bg="facebook.300">
              {items.clothesType === "1" ? "男女兼用" : "男性用"}
            </Box>
            <ProductInput
              items={items}
              setItems={setItems}
              productIndex={productIndex}
              productName="productName"
              price="price"
              size="size"
              color="color"
              quantity="quantity"
              fixedQuantity="fixedQuantity"
              inseam="inseam"
              imageUrl="imageUrl"
              imagePath="imagePath"
              sizeUrl="sizeUrl"
              sizePath="sizePath"
              sizeFileUpload={sizeFileUpload}
              setSizeFileUpload={setSizeFileUpload}
              imageFileUpload={imageFileUpload}
              setImageFileUpload={setImageFileUpload}
              deleteImage={deleteImage}
            />
            {Number(items.clothesType) === 2 && (
              <>
                <Box my={6} p={1} textAlign="center" bg="red.200">
                  女性用
                </Box>
                <ProductInput
                  items={items}
                  setItems={setItems}
                  productIndex={productIndex}
                  productName="productNameA"
                  price="priceA"
                  size="sizeA"
                  color="colorA"
                  quantity="quantityA"
                  fixedQuantity="fixedQuantityA"
                  inseam="inseamA"
                  imageUrl="imageUrlA"
                  imagePath="imagePathA"
                  sizeUrl="sizeUrlA"
                  sizePath="sizePathA"
                  sizeFileUpload={sizeFileUploadA}
                  setSizeFileUpload={setSizeFileUploadA}
                  imageFileUpload={imageFileUploadA}
                  setImageFileUpload={setImageFileUploadA}
                  deleteImage={deleteImage}
                />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                onReset();
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
