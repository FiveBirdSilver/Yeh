import Image from "next/image";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { GetServerSideProps } from "next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { IPost, Iimage } from "../../lib/interface/post";
import { detailPost, updatePost } from "../../lib/apis/post";
import { toastAlert } from "../../components/utils/toastAlert";

export default function Edit(props: { cookies: string }) {
  const router = useRouter();
  const postId = router.query.id as string;
  const cookie = props.cookies;

  const [title, setTitle] = useState<string>(""); // props 제목
  const [content, setContent] = useState<string>(""); // props 내용

  const [images, setImages] = useState<Iimage[]>([]); // 수정 전 이미지
  const [newImages, setNewimages] = useState<File[]>([]); // 수정 하려는 이미지

  const [isModal, setIsModal] = useState(false);

  const formData = new FormData();
  const inputRefTitle = useRef<HTMLInputElement | null>(null);
  const inputRefContent = useRef<HTMLTextAreaElement | null>(null);

  const queryClient = useQueryClient();
  const detail = useQuery<IPost[]>(["detail"], async () => await detailPost(postId), {
    useErrorBoundary: true,
    retry: 0,
  });
  const imgConfirm = detail.isSuccess && detail.data?.map((v) => v.img).every((i) => i === null);

  useEffect(() => {
    if (!cookie) router.push("/user/signin");
  }, [cookie]);

  useEffect(() => {
    if (detail.isSuccess) {
      setTitle(detail.data[0].title);
      setContent(detail.data[0].content);
      setImages(detail.data[0].img);
    }
  }, []);

  // 게시글 수정
  const setUpdate = useMutation<string | void, unknown, FormData>((formData) => updatePost(formData, cookie), {
    onError: (data, error, variables) => {
      const { response } = error as unknown as AxiosError;
      toastAlert({ status: response?.status });
    },
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries("posts");
    },
  });

  const handleOnSubmit = async () => {
    if (title === "") {
      return inputRefTitle?.current?.focus();
    } else if (content === "") {
      return inputRefContent?.current?.focus();
    } else {
      formData.append("postId", postId);
      formData.append("title", title);
      formData.append("content", content);
      images?.forEach((file) => formData.append("image", file._id));
      newImages?.forEach((file) => formData.append("newImage", file));
    }
    await setUpdate.mutate(formData);
    router.push(`/post/read?id=${router.query.id}`);
  };

  // 이미지 첨부 핸들러
  const handleOnChange = (e: any) => {
    const files = e.target.files;
    const allFiles = [...newImages, ...Array.from(files)] as File[];

    setNewimages(allFiles);
  };

  // 기존 이미지 삭제 핸들러
  const handleOnImageDelete = (id: string) => {
    if (detail.isSuccess) {
      const existingImg = images.filter((v) => v._id !== id);
      setImages(existingImg);
    }
  };

  //새 이미지 미리보기 핸들러
  const handleOnPreview = (img: File) => {
    const imgUrl = URL.createObjectURL(img);
    return (
      <div className="post__preview-wrapper">
        <button onClick={() => setNewimages(newImages.filter((v) => v.name !== img.name))}>X</button>
        <Image src={imgUrl} fill alt="게시글사진" />
      </div>
    );
  };

  return (
    <div className="post">
      <input
        type="text"
        name="title"
        autoComplete="off"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="post__title"
        ref={inputRefTitle}
        autoFocus
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="post__contents"
        ref={inputRefContent}
        style={{ height: "auto", overflowY: "hidden" }}
        rows={15}
      />
      <form className="post__file">
        <label>
          <InboxOutlined className="post__file-icon" />
          <p>이미지 첨부</p>
          <input type="file" accept="image/jpg,impge/png,image/jpeg,image/gif" onChange={handleOnChange} multiple />
        </label>
      </form>

      <div className="post__preview">
        {detail.isSuccess &&
          !imgConfirm &&
          images.map((i) => (
            <div className="post__preview-wrapper" key={i._id}>
              <button onClick={() => handleOnImageDelete(i._id)}>X</button>
              <Image src={`/uploads/${i.filename}`} key={i._id} fill alt="게시글사진" />
            </div>
          ))}
        {newImages?.map((img) => handleOnPreview(img))}
      </div>
      <div className="post-submit">
        <button className="cancle" onClick={() => router.push(`/post/read?id=${router.query.id}`)}>
          취소
        </button>
        <button onClick={() => handleOnSubmit()}>등록</button>
      </div>
    </div>
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
