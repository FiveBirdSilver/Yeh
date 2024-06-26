import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Modal } from "antd";
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";
import Cookies from "js-cookie";

import { writePost } from "../../lib/apis/post";
import { useMutation, useQueryClient } from "react-query";
import { GetServerSideProps } from "next";
import { AxiosError } from "axios";
import { toastAlert } from "../../components/utils/toastAlert";

export default function New(props: { cookies: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const cookie = props.cookies;
  const uid = Cookies.get("uid") as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isModal, setIsModal] = useState(false);

  const inputRefTitle = useRef<HTMLInputElement | null>(null);
  const inputRefContent = useRef<HTMLTextAreaElement | null>(null);

  const setPost = useMutation<string | void, unknown, FormData>((formData) => writePost(formData, cookie), {
    onError: (error) => {
      const { response } = error as unknown as AxiosError;
      toastAlert({ status: response?.status });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("posts");
      router.push("/main");
    },
  });

  const handleOnSubmit = async () => {
    const formData = new FormData();
    if (title === "") {
      return inputRefTitle?.current?.focus();
    } else if (content === "") {
      return inputRefContent?.current?.focus();
    }

    formData.append("writer", uid);
    formData.append("title", title);
    formData.append("content", content);
    images?.forEach((file) => formData.append("image", file));
    for (const value of formData.values()) {
      console.log(value);
    }

    setPost.mutate(formData);
  };

  // 이미지 첨부 핸들러
  const handleOnImageUpload = (e: any) => {
    const tmpFiles = Array.from(e.target.files);

    const totalFiles = [...images, ...tmpFiles] as File[];

    if (totalFiles.length < 5) setImages(totalFiles);
    else {
      setIsModal(true);
      setImages(totalFiles.slice(0, 5));
    }
  };

  const handleOnCancle = () => {
    setTitle("");
    setContent("");
    setImages([]);
  };

  const deleteOnFile = (key: number) => {
    setImages(images.filter((i) => i.lastModified !== key));
  };

  return (
    <>
      <div className="post">
        <input
          type="text"
          placeholder="제목을 입력해 주세요"
          name="title"
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputRefTitle}
          className="post__title"
        />
        <textarea
          placeholder="내용을 입력해 주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          ref={inputRefContent}
          rows={15}
          className="post__contents"
        />
        <form className="post__file">
          <label>
            <InboxOutlined className="post__file-icon" />
            <p>이미지 첨부</p>
            <input
              type="file"
              accept="image/jpg,impge/png,image/jpeg,image/gif"
              onChange={handleOnImageUpload}
              multiple
            />
          </label>
        </form>
        <div className="postFileList">
          {images?.map((v, index) => (
            <div className="postFileList_wrap" key={index}>
              <p>{v.name}</p>
              <DeleteFilled onClick={() => deleteOnFile(v.lastModified)} />
            </div>
          ))}
        </div>
        <div className="post-submit">
          <button className="cancle" onClick={() => handleOnCancle()}>
            취소
          </button>
          <button onClick={() => handleOnSubmit()}>등록</button>
        </div>
      </div>

      {isModal ? (
        <Modal
          open={isModal}
          centered
          onOk={() => setIsModal(false)}
          onCancel={() => setIsModal(false)}
          cancelButtonProps={{ style: { display: "none" } }}
          width="420px"
        >
          <p className="post__file-modal">첨부 이미지는 최대 5장까지 가능합니다.</p>
        </Modal>
      ) : null}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.cookies?.accessToken || "";
  return {
    props: {
      cookies: cookies,
    },
  };
};
