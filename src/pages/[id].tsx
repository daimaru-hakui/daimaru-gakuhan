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
import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

type ProjectType = {
  id: string;
  title: string;
  desc: string;
  schedule: string;
  products: string[];
  createdAt: Timestamp;
};

const Measure = () => {
  const router = useRouter();
  const [project, setProject] = useState<ProjectType>();
  const [items, setItems] = useState<any>({
    gender: "3",
  });

  // project（個別）を取得
  useEffect(() => {
    const getProject = async () => {
      const docRef = doc(db, "projects", `${router.query.id}`);
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ ...docSnap?.data(), id: docSnap.id } as ProjectType);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getProject();
  }, [router.query.id]);

  const addStudent = async () => {
    const docRef = collection(db, "schools", `${router.query.id}`, "students");
    try {
      await addDoc(docRef, {
        ...items,
        title: project?.title,
        projectId: project?.id,
      });
    } catch (err) {
      console.log(err);
    } finally {
      window.alert("登録しました");
      setItems({});
    }
    console.log(items);
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

  // selectの値を追加・変更
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
      } else {
        // 値がない場合　追加
        newItems = [
          ...(items.products || ""),
          { [name]: value, productName: productName },
        ];
      }
      return { ...items, products: [...(newItems || "")] };
    });
  };

  return (
    <Container maxW="600px" py={6}>
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

      <Box mt={6} p={6} bgColor="white" borderRadius={6} boxShadow="base">
        <RadioGroup
          defaultValue="3"
          name="gender"
          value={items.gender || "3"}
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
              未記入
            </Radio>
          </Stack>
        </RadioGroup>
      </Box>
      {project?.products.map((product: any, index: number) => (
        <Box
          key={product.id}
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
              {product.type === "1" && (
                <Select
                  name="quantity"
                  placeholder="数量を選択してしてください"
                  onChange={(e) =>
                    handleSelectChange(e, index, product.productName)
                  }
                >
                  {[...Array(10)].map((num: string, index: number) => (
                    <option key={num?.toString()} value={index}>
                      {index}
                    </option>
                  ))}
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
    </Container>
  );
};

export default Measure;
