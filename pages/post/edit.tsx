import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { Modal } from "antd";
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";

import { userState } from "../../store/index";
import { useQuery, useQueryClient } from "react-query";
import { IPost, Iimage } from "../../lib/interface/post";
import { detailPost } from "../../lib/apis/post";

export default function Edit() {
  const router = useRouter();
  const postId = router.query.id as string;
  const user = useRecoilValue(userState);

  const [title, setTitle] = useState<string>(""); // props 제목
  const [content, setContent] = useState<string>(""); // props 내용

  const [images, setImages] = useState<Iimage[]>([]); // 수정 전 이미지
  const [newImages, setNewimages] = useState<File[]>([]); // 수정 하려는 이미지
  const [preView, setPreView] = useState([]); // 업로드 전 미리보기 preview

  const [isModal, setIsModal] = useState(false);

  const formData = new FormData();
  const inputRefTitle = useRef(null);
  const inputRefContent = useRef(null);

  useEffect(() => {
    if (!user.logging) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/user/signin");
    }
  }, [user.logging]);

  const queryClient = useQueryClient();
  const detail = useQuery<IPost[]>(["detail"], async () => await detailPost(postId));
  const imgConfirm = detail.isSuccess && detail.data?.map((v) => v.img).every((i) => i === null);

  useEffect(() => {
    if (detail.isSuccess) {
      setTitle(detail.data[0].title);
      setContent(detail.data[0].content);
      setImages(detail.data[0].img);
    }
  }, []);

  const handleOnSubmit = async () => {
    // if (title === "") {
    //   return inputRefTitle.current.focus();
    // } else if (content === "") {
    //   return inputRefContent.current.focus();
    // } else {
    //   formData.append("title", title);
    //   formData.append("content", content);
    //   reuploadImages.forEach((file) => formData.append("imageFiles", file));
    //   formData.append("ImagesId", images[0] != null && images.map((i) => i.id));
    //   try {
    //     const res = await postEdit(router.query.id, formData);
    //     console.log(res);
    //     if (res.data.success) {
    //       alert(res.data.data);
    //       router.push(`/post/read?id=${router.query.id}`);
    //     } else {
    //       alert("게시글 수정에 실패했습니다. 다시 시도해 주세요");
    //     }
    //   } catch (err) {
    //     console.log(err);
    //     alert("잠시 후 다시 시도해주세요.");
    //   }
    // }
  };

  // 이미지 첨부 핸들러
  const handleOnChange = (e: any) => {
    const imageLists = e.target.files;
    const tmpFiles = Array.from(imageLists);
    const totalFiles = [...newImages, ...tmpFiles] as File[];

    let imageUrlLists: any = [...preView];

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
    }
    // if ([...reuploadImages, ...tmpArr].length + images.length < 5) {
    //   setReuploadImages([...reuploadImages, ...tmpArr]);
    //   setPreView(imageUrlLists);
    // } else {
    //   setIsModal(true);
    //   setReuploadImages([...reuploadImages, ...tmpArr].slice(0, 5 - images.length));
    //   setPreView(imageUrlLists.slice(0, 5 - images.length));
    // }
    // setImages([...images, tmpArr])
    setNewimages(totalFiles);
    setPreView(imageUrlLists);
  };

  console.log(images);
  console.log(newImages);
  console.log(preView);
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
              <button onClick={() => setImages(detail.data[0].img.filter((v) => i._id !== v._id))}>X</button>
              <Image src={`/../public/uploads/${i.filename}`} key={i._id} fill alt="게시글사진" />
            </div>
          ))}
        {preView?.map((image, id) => (
          <div className="post__preview-wrapper" key={id}>
            <button onClick={() => setPreView(preView.filter((i) => i !== image))}>X</button>
            <Image src={image} fill alt="게시글사진" />
          </div>
        ))}
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
{
  /* {isModal ? (
        <Modal
          open={isModal}
          centered
          onOk={() => setIsModal(false)}
          onCancel={() => setIsModal(false)}
          cancelButtonProps={{ style: { display: "none" } }}
          width="420px"
        >
          <p className="modal_content"> 첨부 이미지는 최대 5장까지 가능합니다.</p>
        </Modal>
      ) : null} */
}
