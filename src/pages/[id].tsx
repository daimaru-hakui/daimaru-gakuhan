import {
  Box,
  Button,
  Container,
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
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../store";

type ProjectType = {
  id: string;
  title: string;
  name: string;
  desc: string;
  schedule: string;
  gender: string;
  products: string[];
  release: boolean;
  createdAt: Timestamp;
};

const Measure = () => {
  const router = useRouter();
  const [project, setProject] = useState<ProjectType>();
  const [items, setItems] = useState<any>({});
  const array = Object.keys([...Array(10)]);
  const setLoading = useSetRecoilState(loadingState);

  // project（個別）を取得
  useEffect(() => {
    const getProject = async () => {
      const unsub = onSnapshot(
        doc(db, "projects", `${router.query.id}`),
        (doc) => {
          setProject({ ...doc.data(), id: doc.id } as ProjectType);
          if (doc.data()?.release === false) {
            router.push("404/notfound");
          }
        }
      );
    };
    getProject();
  }, [router.query.id, router]);

  // 商品登録用
  useEffect(() => {
    setItems({
      ...project,
      gender: "3",
      products: project?.products.map((product: any) => ({
        productName: product.productName,
      })),
    });
  }, [project]);

  // 採寸登録
  const addStudent = async () => {
    const result = window.confirm("登録して宜しいでしょうか");
    if (!result) return;
    setLoading(true);
    let docRef;
    try {
      docRef = await addDoc(
        collection(db, "schools", `${router.query.id}`, "students"),
        {
          ...items,
          title: project?.title,
          projectId: project?.id,
          createdAt: serverTimestamp(),
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      const jsonString = JSON.stringify({
        ...items,
        title: project?.title,
        projectId: project?.id,
      });
      localStorage.setItem(`${project?.id}`, jsonString);
      router.push(`/completion/${project?.id}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleRadioChange = (e: string) => {
    const value = e;
    setItems({ ...items, gender: value });
  };

  // 商品の値を追加・変更
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    rowIndex: number,
    productName: string
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setItems(() => {
      let newItems = [];

      if (items.products?.length > rowIndex) {
        // 値がある場合　更新
        newItems = items.products?.map((product: any, index: number) => {
          if (index === rowIndex) {
            return {
              ...product,
              [name]: value,
            };
          } else {
            return { ...product };
          }
        });
      }
      // } else {
      //   // 値がない場合　追加
      //   newItems = [
      //     ...(items.products || ''),
      //     { [name]: value, productName: productName },
      //   ];
      // }
      return { ...items, products: [...(newItems || "")] };
    });
  };

  return (
    <Container maxW="600px" py={6} minH="100vh">
      {project?.release && (
        <>
          {project?.title && (
            <Box
              p={6}
              fontSize="3xl"
              fontWeight="bold"
              bgColor="white"
              borderRadius={6}
              boxShadow="base"
            >
              {project?.title}
            </Box>
          )}
          <Box mt={6} p={6} bgColor="white" borderRadius={6} boxShadow="base">
            <Text>学籍番号</Text>
            <Input
              type="text"
              mt={2}
              name="studentNumber"
              value={items.studentNumber}
              onChange={handleInputChange}
            />
          </Box>

          <Box mt={6} p={6} bgColor="white" borderRadius={6} boxShadow="base">
            <Text>名前</Text>
            <Input
              type="text"
              mt={2}
              name="name"
              value={items.name}
              onChange={handleInputChange}
            />
          </Box>

          {Number(project?.gender) === 1 && ""}
          {Number(project?.gender) === 2 && (
            <Box mt={6} p={6} bgColor="white" borderRadius={6} boxShadow="base">
              <RadioGroup
                name="gender"
                value={items.gender}
                onChange={(e) => handleRadioChange(e)}
              >
                <Stack spacing={5} direction="row">
                  <Radio colorScheme="green" value="1">
                    男性
                  </Radio>
                  <Radio colorScheme="green" value="2">
                    女性
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          )}
          {Number(project?.gender) === 3 && (
            <Box mt={6} p={6} bgColor="white" borderRadius={6} boxShadow="base">
              <RadioGroup
                name="gender"
                value={items.gender}
                onChange={(e) => handleRadioChange(e)}
              >
                <Stack spacing={5} direction="row">
                  <Radio colorScheme="green" value="1">
                    男性
                  </Radio>
                  <Radio colorScheme="green" value="2">
                    女性
                  </Radio>
                  <Radio colorScheme="green" value="3">
                    その他
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          )}

          {project?.products.map((product: any, index: number) => (
            <Box
              key={product.productName}
              mt={6}
              p={6}
              bgColor="white"
              borderRadius={6}
              boxShadow="base"
            >
              <Box>{product.productName}</Box>
              <Box mt={6}>
                <Select
                  placeholder="サイズを選択してください"
                  name="size"
                  onChange={(e) =>
                    handleSelectChange(e, index, product.productName)
                  }
                >
                  {product.size.map((size: string) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Select>
                <Box mt={6}>
                  {product.quantity && (
                    <Select
                      name="quantity"
                      placeholder="数量を選択してしてください"
                      onChange={(e) =>
                        handleSelectChange(e, index, product.productName)
                      }
                    >
                      {array.map((num: string, index: number) => (
                        <option key={num?.toString()} value={index}>
                          {index}
                        </option>
                      ))}
                    </Select>
                  )}
                </Box>
                <Box mt={6}>
                  {product.inseam && (
                    <Select
                      name="inseam"
                      placeholder="裾上直しの長さを選択してください"
                      onChange={(e) =>
                        handleSelectChange(e, index, product.productName)
                      }
                    >
                      {Object.keys(["無し", ...Array(30)]).map(
                        (num: string, index: number) => (
                          <option key={num?.toString()} value={index + "cm"}>
                            {index}cm
                          </option>
                        )
                      )}
                    </Select>
                  )}
                </Box>
              </Box>
            </Box>
          ))}

          <Box mt={6} textAlign="center">
            <Button colorScheme="facebook" onClick={addStudent}>
              登録
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Measure;
