import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Modal } from "antd";
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";

import { userState } from "../../store/index";

export default function New() {
  const user = useRecoilValue(userState);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const inputRefTitle = useRef<HTMLInputElement | null>(null);
  const inputRefContent = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!user.logging) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/user/signin");
    }
  }, []);

  const handleOnSubmit = async () => {
    const formData = new FormData();

    if (title === "") {
      return inputRefTitle?.current?.focus();
    } else if (content === "") {
      return inputRefContent?.current?.focus();
    } else {
      formData.append("title", title);
      formData.append("content", content);

      images.forEach((file) => formData.append("imageFiles", file));

      // try {
      //   const res = await postNew(formData);

      //   if (res.data.success) {
      //     alert(res.data.data);
      //     PageHandler(1);
      //     router.push("/main", undefined, { shallow: true });
      //   } else {
      //     alert("게시글 등록에 실패했습니다. 다시 시도해 주세요");
      //   }
      // } catch (err) {
      //   console.log(err);
      //   alert(err.data.data);
      // }
    }
  };

  // 이미지 첨부 핸들러
  const handleOnChange = (e: any) => {
    // const tmpFiles = Array.from(e.target.files);
    // if ([...images, ...tmpFiles].length < 5) setImages([...images, ...tmpFiles]);
    // else {
    //   setIsModal(true);
    //   setImages([...images, ...tmpFiles].slice(0, 5));
    // }
  };

  const handleOnCancle = () => {
    setTitle("");
    setContent("");
    // setImages(null);
  };

  // const deleteOnFile = (key) => {
  //   setImages(images.filter((i) => i.lastModified !== key));
  // };

  return (
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
        rows={20}
        className="post__contents"
      />
      <form className="post__file">
        <label>
          <InboxOutlined className="post__file-icon" />
          <p>이미지 첨부</p>
          <input type="file" accept="image/jpg,impge/png,image/jpeg,image/gif" onChange={handleOnChange} multiple />
        </label>
      </form>
      {/* <div className="postFileList">
        {images?.map((i) => (
          <div className="postFileList_wrap" key={i.lastModified}>
            <p>{i.name}</p>
            <DeleteFilled onClick={() => deleteOnFile(i.lastModified)} />
          </div>
        ))}
      </div> */}
      <div className="post-submit">
        <button className="cancle" onClick={() => handleOnCancle()}>
          취소
        </button>
        <button onClick={() => handleOnSubmit()}>등록</button>
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
    </div>
  );
}
