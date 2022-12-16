import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Box, Button, Flex, Input, Textarea } from "@chakra-ui/react";
import { NextPage } from "next";
import { loadingState } from "../../../store";
import { useSetRecoilState } from "recoil";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

type Props = {
  student: any;
  release: boolean;
};

const ConfMail: NextPage<Props> = ({ student, release }) => {
  const setLoading = useSetRecoilState(loadingState);
  const [send, setSend] = useState({
    email: "",
    title: "",
    content: "",
    studentNumber: "",
    lastName: "",
    firstName: "",
    sumTotal: "",
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
    let signature = student?.signature.split("\n");
    signature = `<div>${signature?.join("<br/>")}</div>`;
    setSend({ ...send, content: content.join("").trim(), signature });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.products]);

  // 確認メール関数
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!release) return;
    setLoading(true);
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
        updateStudent();
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
  const updateStudent = async () => {
    try {
      await updateDoc(
        doc(db, "schools", `${student.projectId}`, "students", `${student.id}`),
        {
          email: send.email,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      window.location.reload();
    }
  };

  return (
    <form ref={form} onSubmit={handleSendClick}>
      <label htmlFor="email">
        <Box fontSize="xs">確認メールを受け取る</Box>
      </label>
      <Flex gap={3}>
        <Box flex={1}>
          <Input
            size="sm"
            rounded="md"
            fontSize="sm"
            id="email"
            placeholder="emailを入力してください"
            type="email"
            name="email"
            value={send.email}
            onChange={handleInputChange}
          />
        </Box>
        <Button
          type="submit"
          colorScheme="facebook"
          isDisabled={!isValid(send.email)}
          size="sm"
        >
          送信
        </Button>

        <Input
          type="text"
          name="title"
          defaultValue={student.title}
          onChange={handleInputChange}
          display="none"
        />
        <Input
          type="text"
          name="studentNumber"
          defaultValue={student.studentNumber}
          onChange={handleInputChange}
          display="none"
        />
        <Input
          type="text"
          name="lastName"
          defaultValue={student.lastName}
          onChange={handleInputChange}
          display="none"
        />
        <Input
          type="text"
          name="firstName"
          defaultValue={student.firstName}
          onChange={handleInputChange}
          display="none"
        />
        <Input
          type="text"
          name="sumTotal"
          defaultValue={Math.round(student.sumTotal)}
          onChange={handleInputChange}
          display="none"
        />
        <Textarea name="content" defaultValue={send.content} display="none" />
        <Textarea
          name="signature"
          defaultValue={send.signature}
          display="none"
        />
      </Flex>
    </form>
  );
};

export default ConfMail;
