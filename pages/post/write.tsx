import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { Modal } from "antd";
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";

import { userState } from "../../store/index";
import { writePost } from "../../lib/apis/post";
import { useMutation, useQueryClient } from "react-query";
import { GetServerSideProps } from "next";

export default function New(props: { cookies: string }) {
  const user = useRecoilValue(userState);
  const router = useRouter();
  const queryClient = useQueryClient();
  const cookie = props.cookies;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isModal, setIsModal] = useState(false);

  const inputRefTitle = useRef<HTMLInputElement | null>(null);
  const inputRefContent = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!user.logging) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/user/signin");
    }
  }, [user.logging]);

  const setPost = useMutation<string | void, unknown, FormData>((formData) => writePost(formData, cookie), {
    onError: (data, error, variables) => {
      alert("잠시 후 다시 시도해주세요.");
    },
    onSuccess: (data, variables) => {
      if (data === "Access") {
        queryClient.invalidateQueries("posts");
        router.push("/main");
      } else {
        alert("세션이 만료 되었거나 유효하지 않은 요청 입니다.");
        router.push("/user/signin");
      }
    },
  });

  const handleOnSubmit = async () => {
    const formData = new FormData();
    if (title === "") {
      return inputRefTitle?.current?.focus();
    } else if (content === "") {
      return inputRefContent?.current?.focus();
    }

    formData.append("id", user.id);
    formData.append("writer", user.nickname);
    formData.append("title", title);
    formData.append("content", content);
    images?.forEach((file) => formData.append("image", file));

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
