/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../store";
import SizeSpecModal from "../../../components/register/SizeSpecModal";
import InputEditModal from "../../../components/register/InputEditModal";
import { ProjectType } from "../../../types/ProjectType";

const MeasureId = () => {
  const router = useRouter();
  const projectId = router.query.id;
  const studentId = router.query.studentId;
  const [student, setStudent] = useState<any>();
  const [project, setProject] = useState({} as ProjectType);
  const [items, setItems] = useState<any>({});
  const [sumTotal, setSumTotal] = useState(0);
  const array = Object.keys([...Array(10)]);
  const setLoading = useSetRecoilState(loadingState);

  // student（個別）を取得
  useEffect(() => {
    const getStudent = async () => {
      onSnapshot(
        doc(db, "schools", `${projectId}`, "students", `${studentId}`),
        (doc) => {
          setStudent({ ...doc.data(), id: doc.id });
        }
      );
    };

    let i = 0;
    while (i <= 20) {
      history.pushState(null, "null", null);
      i++;
    }

    getStudent();
  }, [projectId, studentId]);

  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, "projects", `${projectId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap?.data().release === false) {
          router.push("/register");
          return;
        }
        setProject({ ...docSnap.data(), id: docSnap.id } as ProjectType);
      }
    };
    getProject();
  }, [projectId, router]);

  // 商品登録用 初期値入力
  useEffect(() => {
    setItems({
      ...student,
      products: project?.products?.map((product: any) => {
        let productName;
        let price;
        let quantity;
        let size;
        let color;
        let inseam;
        let sizeUrl;
        let imageUrl;

        // 男女兼用・女性を選択した場合
        if (
          student?.gender === "2" && // 女性
          project?.gender === "2" && //男女兼用(性別）
          product?.clothesType === "2" //男女兼用（服）
        ) {
          productName = product?.productNameA || "";
          price = product?.priceA || null;
          quantity = product?.quantityA ? "" : product?.fixedQuantityA;
          sizeUrl = product?.sizeUrlA ? product?.sizeUrlA : "";
          imageUrl = product.imageUrlA ? product.imageUrlA : "";
          size = product?.sizeA[0] ? "" : "未設定";
          if (product?.sizeA.length === 1 && product?.sizeA[0] !== "未設定")
            size = product?.sizeA[0];
          if (product?.colorA.length === 1) color = product?.colorA[0];
          if (product?.colorA === 0) color = null;
          if (product?.colorA.length > 1) color = product?.colorA;
        } else {
          productName = product?.productName || "";
          price = product?.price || null;
          quantity = product?.quantity ? "" : product.fixedQuantity;
          sizeUrl = product?.sizeUrl ? product?.sizeUrl : "";
          imageUrl = product.imageUrl ? product.imageUrl : "";
          size = product?.size[0] ? "" : "未設定";
          if (product?.size.length === 1 && product?.size[0] !== "未設定")
            size = product?.size[0];
          if (product?.color.length === 1) color = product?.color[0];
          if (product?.color.length === 0) color = null;
          if (product?.color.length > 1) color = product?.color;
        }

        //裾上げ設定
        inseam = product?.inseam || product?.inseamA ? "なし" : null;
        if (inseam) {
          if (
            product?.clothesType === "2" &&
            student?.gender === "1" &&
            product?.inseam
          )
            inseam = "";

          if (
            product?.clothesType === "2" &&
            student?.gender === "2" &&
            product?.inseamA
          )
            inseam = "";

          if (product?.clothesType === 1 && product?.inseam) inseam = "";
        }

        // カラーの設定
        if (product?.color === null && product?.colorA === null) color = null; //両方ともnullなら項目なし
        if (product?.color || product?.colorA) {
          if (!color) color = "なし";
          if (typeof color === "object" && color?.length > 1) color = "なし";
        }

        if (color === "なし") {
          if (
            product?.clothesType === "2" &&
            student?.gender === "1" &&
            product?.color &&
            product?.color.length > 1
          )
            color = "";

          if (
            product?.clothesType === "2" &&
            student?.gender === "2" &&
            product?.colorA &&
            product?.colorA.length > 1
          )
            color = "";

          if (product?.clothesType === 1 && product?.color) color = "";
        }

        return {
          productName,
          price,
          size,
          color,
          quantity,
          inseam,
          sizeUrl,
          imageUrl,
        };
      }),
    });
  }, [project, student]);

  console.log(items);

  // 採寸登録
  const updateStudent = async () => {
    const result = window.confirm("登録して宜しいでしょうか");
    if (!result) return;
    setLoading(true);
    try {
      await updateDoc(
        doc(db, "schools", `${projectId}`, "students", `${studentId}`),
        {
          ...items,
          // inseam:
          //   items.inseam === null ? null : items.inseam ? items.inseam : "なし",
          sumTotal,
          updatedAt: serverTimestamp(),
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      const jsonString = JSON.stringify({
        ...items,
        sumTotal,
      });
      localStorage.setItem(`${studentId}`, jsonString);
      router.push(`/completion/${studentId}`);
    }
  };

  // 商品の値を追加・変更
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    rowIndex: number
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setItems(() => {
      let newItems = [];
      // 選択した商品の数量やサイズがproductsにあれば更新
      if (items.products?.length >= rowIndex + 1) {
        // 値がある場合　更新
        newItems = items.products?.map((product: any, index: number) =>
          index === rowIndex ? { ...product, [name]: value } : { ...product }
        );
      }
      return { ...items, products: [...(newItems || "")] };
    });
  };

  // 合計金額
  useEffect(() => {
    let sum = 0;
    items?.products
      ?.map((product: any) => ({
        price: product.price,
        quantity: product.quantity,
      }))
      .forEach((product: any) => {
        sum += Number(product.price) * Number(product.quantity);
      });
    setSumTotal(sum);
  }, [items.products]);

  //性別を表示
  const genderDisp = (gender: string) => {
    switch (gender) {
      case "1":
        return "男性";
      case "2":
        return "女性";
      default:
        return "";
    }
  };

  const priceElement = (price: string) => (
    <>
      {Number(price) !== 0 && (
        <Box mt={2}>
          価格 {Math.round(Number(price)).toLocaleString()}
          円（税込）
        </Box>
      )}
    </>
  );

  const imageUrlElement = (imageUrl: string) => (
    <>
      {imageUrl && (
        <Flex mt={6} justifyContent="center">
          <img src={imageUrl} alt={imageUrl} />
        </Flex>
      )}
    </>
  );

  const sizeElement = (size: any, sizeUrl: string, index: number) => (
    <>
      {size.length >= 1 && (
        <Box mt={6}>
          <Flex mb={2} alignItems="center" justifyContent="space-between">
            <Text>サイズ</Text>
            {sizeUrl && <SizeSpecModal sizeUrl={sizeUrl} />}
          </Flex>
          {size.length === 1 ? (
            <Box>
              {size.map((size: string) => (
                <Input name="size" key={size} defaultValue={size} isReadOnly />
              ))}
            </Box>
          ) : (
            <Select
              placeholder="サイズを選択してください"
              name="size"
              onChange={(e) => handleSelectChange(e, index)}
            >
              {size.map((size: string) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          )}
        </Box>
      )}
    </>
  );

  const colorElement = (color: any, index: number) => (
    <>
      {color?.length >= 1 && (
        <Box mt={6}>
          <Flex mb={2} alignItems="center" justifyContent="space-between">
            <Text>カラー</Text>
          </Flex>
          {color?.length === 1 ? (
            <Box>
              {color.map((c: string) => (
                <Input name="color" key={c} defaultValue={c} isReadOnly />
              ))}
            </Box>
          ) : (
            <Select
              placeholder="カラーを選択してください"
              name="color"
              onChange={(e) => handleSelectChange(e, index)}
            >
              {color.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          )}
        </Box>
      )}
    </>
  );

  const quantityElement = (
    qantity: string,
    fixedQuantity: string,
    index: number
  ) => (
    <Box mt={6}>
      {qantity ? (
        <>
          <Text>数量</Text>
          <Select
            mt={2}
            name="quantity"
            placeholder="数量を選択してしてください"
            onChange={(e) => handleSelectChange(e, index)}
          >
            {array.map((num: string, i: number) => (
              <option key={num?.toString()} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </>
      ) : (
        <Flex gap={3}>
          <Text>数量</Text>
          <Box>{fixedQuantity}</Box>
        </Flex>
      )}
    </Box>
  );

  const inseamElement = (inseam: string, index: number) => (
    <Box mt={6}>
      {inseam && (
        <>
          <Text>裾上げ</Text>
          <Select
            mt={1}
            name="inseam"
            placeholder="裾上直しの長さを選択してください"
            onChange={(e) => handleSelectChange(e, index)}
          >
            {Object.keys(["無し", ...Array(30)]).map(
              (num: string, i: number) => (
                <option key={num?.toString()} value={i + "cm"}>
                  {i}cm
                </option>
              )
            )}
          </Select>
        </>
      )}
    </Box>
  );

  return (
    <Container maxW="600px" py={6} minH="100vh">
      {project?.release && (
        <>
          {items?.title && (
            <Box
              p={6}
              fontSize="3xl"
              fontWeight="bold"
              bg="white"
              rounded={6}
              boxShadow="base"
            >
              {items?.title}
            </Box>
          )}
          <Flex
            mt={6}
            p={6}
            justifyContent="space-between"
            bg="white"
            rounded={6}
            boxShadow="base"
          >
            <Box flex={1}>
              <Box>
                <Text>学籍番号</Text>
                <Box mt={1} ml={3}>
                  {items.studentNumber}
                </Box>
              </Box>
              <Box mt={3}>
                <Text>名前</Text>
                <Box mt={1} ml={3}>
                  {items.lastName} {items.firstName}
                </Box>
              </Box>
              {Number(project.gender) === 2 && (
                <Box mt={3}>
                  <Text>性別</Text>
                  <Box mt={1} ml={3}>
                    {genderDisp(items.gender)}
                  </Box>
                </Box>
              )}
            </Box>
            <InputEditModal
              items={items}
              setItems={setItems}
              student={student}
              project={project}
              router={router}
            />
          </Flex>
          {project?.desc && (
            <Box mt={6} p={6} bg="white" rounded={6} boxShadow="base">
              <Box fontWeight="bold" fontSize="xl">
                説明
              </Box>
              <Box mt={2} whiteSpace="pre-wrap">
                {project.desc}
              </Box>
            </Box>
          )}

          {project?.products.map((product: any, index: number) => (
            <Box
              key={index}
              mt={6}
              p={6}
              bg="white"
              rounded={6}
              boxShadow="base"
              borderWidth="3px"
              borderColor={
                items?.products?.[index].size === "" ||
                items.products?.[index]?.quantity === "" ||
                (product?.inseam && items.products?.[index]?.inseam === "")
                  ? "white"
                  : "blue.200"
              }
              boxSizing="border-box"
            >
              {project?.gender === "2" &&
              student?.gender === "2" &&
              product.clothesType === "2" ? (
                <>
                  <Box fontSize="xl">{product.productNameA}</Box>
                  {priceElement(product.priceA)}
                  {imageUrlElement(product.imageUrlA)}
                  {colorElement(product.colorA, index)}
                  {sizeElement(product.sizeA, product.sizeUrlA, index)}
                  {quantityElement(
                    product.quantityA,
                    product.fixedQuantityA,
                    index
                  )}
                  {inseamElement(product.inseamA, index)}
                </>
              ) : (
                <>
                  <Box fontSize="xl">{product.productName}</Box>
                  {priceElement(product.price)}
                  {imageUrlElement(product.imageUrl)}
                  {colorElement(product.color, index)}
                  {sizeElement(product.size, product.sizeUrl, index)}
                  {quantityElement(
                    product.quantity,
                    product.fixedQuantity,
                    index
                  )}
                  {inseamElement(product.inseam, index)}
                </>
              )}
            </Box>
          ))}

          <Box mt={6} textAlign="center">
            <Button
              colorScheme="facebook"
              onClick={updateStudent}
              disabled={
                items?.products?.some(
                  (product: { quantity: string }) => product.quantity === ""
                ) ||
                items?.products?.some(
                  (product: { size: string }) => product.size === ""
                ) ||
                items?.products?.some(
                  (product: { color: string }) => product.color === ""
                ) ||
                items?.products?.some(
                  (product: { inseam: string }) => product.inseam === ""
                )
              }
            >
              登録
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default MeasureId;
