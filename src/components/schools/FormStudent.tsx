import { Box, Button, Flex, Input } from "@chakra-ui/react";
import React, { useRef, useState, useEffect, FC } from "react";
import emailjs from "@emailjs/browser";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { StudentType } from "../../types/StudentType";

type Props = {
  student: StudentType;
};

export const FormStudent: FC<Props> = ({ student }) => {
  const setLoading = useSetRecoilState(loadingState);
  const [send, setSend] = useState({
    email: "",
    title: "",
    content: "",
    studentNumber: "",
    lastName: "",
    firstName: "",
    sumTotal: 0,
    signature: "",
  });
  const form = useRef<HTMLFormElement>(
    null
  ) as React.MutableRefObject<HTMLFormElement>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSend({ ...send, [name]: value });
  };

  // emailで送る内容をstateで管理
  useEffect(() => {
    let content: string[] = [];
    student?.products.forEach(
      (product: {
        productName: string;
        size: string;
        quantity: string;
        inseam: string;
      }) => {
        let row: string;
        row =
          "<div>" +
          (product.productName
            ? `<div>商品名 ${product.productName}</div>`
            : "") +
          (product.size ? `<div>サイズ ${product.size}</div>` : "") +
          (product.quantity ? `<div>数量 ${product.quantity}</div>` : "") +
          (product.inseam ? `<div>裾上げ ${product.inseam}</div>` : "") +
          "</div>";
        content.push(row + "<br/>");
      }
    );
    let array = [];
    array = student?.signature?.split("\n");
    let signature = `<div>${array?.join("<br/>")}</div>`;
    setSend({
      ...send,
      content: content.join("").trim(),
      signature,
      title: student?.title,
      studentNumber: student?.studentNumber,
      firstName: student?.firstName,
      lastName: student?.lastName,
      sumTotal: student?.sumTotal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.products]);

  // 確認メール関数
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (send.email === "" && student?.email) {
      setSend({ ...send, email: student.email });
    }
    const PUBLIC_KEY = "user_7yd9EbIQJSbzjqGUXUbJt";
    const SERVICE_ID = "service_764mpxv";
    const TEMPLATE_ID = "template_70iyw39";
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        (result) => {
          window.alert("確認メールを送信致しました。");
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      )
      .finally(() => {
        updateStudent(student);
        setLoading(false);
        setSend({ ...send, email: "" });
      });
  };

  // 確認メールを送る
  const handleSendClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = window.confirm(
      `以下のメールアドレス宛にお送りして宜しいでしょうか。\n${send?.email}`
    );
    if (!result) return;
    sendEmail(e);
  };

  // emailアドレス正規表現
  const isValid = (email: string) => {
    const regex =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    const result = regex.test(email);
    return result;
  };

  // emailアドレスを更新
  const updateStudent = async (student: StudentType) => {
    try {
      await updateDoc(
        doc(db, "schools", `${student.projectId}`, "students", `${student.id}`),
        {
          email: send.email,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form ref={form} onSubmit={handleSendClick}>
      <Box display="none">
        <Input name="title" defaultValue={send?.title} />
        <Input name="strudentNumber" defaultValue={send?.studentNumber} />
        <Input name="firstName" defaultValue={send?.firstName} />
        <Input name="lastName" defaultValue={send?.lastName} />
        <Input name="sumTotal" defaultValue={send?.sumTotal} />
        <Input name="signature" defaultValue={send?.signature} />
        <Input name="content" defaultValue={send?.content} />
      </Box>
      <Flex gap={2}>
        <Input
          maxW="300px"
          size="sm"
          rounded="md"
          fontSize="sm"
          id="email"
          placeholder="emailを追加・更新"
          type="email"
          name="email"
          value={send.email}
          onChange={handleInputChange}
        />
        {send.email ? (
          <Button
            type="submit"
            colorScheme="facebook"
            isDisabled={!isValid(send.email)}
            size="sm"
          >
            登録
          </Button>
        ) : (
          <Button
            type="submit"
            colorScheme="facebook"
            isDisabled={!student?.email}
            size="sm"
          >
            再送信
          </Button>
        )}
      </Flex>
    </form>
  );
};
