import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dropdown, Modal, Skeleton } from "antd";
import {
  EyeOutlined,
  FieldTimeOutlined,
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
  LikeFilled,
  MoreOutlined,
} from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";

import { userState } from "../../store/index";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { detailPost, dropPost, increaseLikes } from "../../lib/apis/post";
import CreateTime from "../../components/utils/createTime";
import { IPost } from "../../lib/interface/post";

const Comments = dynamic(() => import("./comments"));

export default function Details() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = router.query.id as string;
  const user = useRecoilValue(userState);

  const [isModal, setIsModal] = useState<boolean>(false);
  const detail = useQuery<IPost[]>(["detail"], async () => await detailPost(postId));
  const imgConfirm = detail.isSuccess && detail.data?.map((v) => v.img).every((i) => i === null);

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() =>
            router.push({
              pathname: "/post/edit",
              query: { id: postId },
            })
          }
        >
          수정
        </a>
      ),
    },
    {
      key: "2",
      label: <a onClick={() => setIsModal(true)}>삭제</a>,
    },
  ];

  // 게시글 공유
  const doCopy = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("클립보드에 복사되었습니다.");
        })
        .catch(() => {
          alert("잠시 후 다시 시도해주세요.");
        });
    }
  };

  // 게시글 좋아요
  const setLikes = useMutation(increaseLikes, {
    onError: (data, error, variables) => {
      alert("잠시 후 다시 시도해주세요.");
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("detail");
    },
  });

  // 게시글 좋아요
  const handleOnLike = async () => {
    if (user.id === "") {
      router.push("/user/signin");
    } else {
      const requset = {
        id: user.id,
        postId: postId,
      };
      setLikes.mutate(requset);
    }
  };

  // 게시글 삭제
  const setDelete = useMutation(dropPost, {
    onError: (data, error, variables) => {
      alert("잠시 후 다시 시도해주세요.");
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("detail");
    },
  });

  const handleOnDelete = async () => {
    const requset = {
      postId: postId,
    };
    await setDelete.mutate(requset);
    router.push("/main");
  };

  return (
    <div className="detailPostBox">
      <div className="detailPostBox_header">
        {detail.isSuccess ? <h2>{detail.data[0].title}</h2> : <Skeleton.Input active block />}
        <div className="detailPostBox-header__container">
          {detail.isSuccess ? (
            <div className="flex gap-5">
              <div className="detailPostBox-header__container-text">
                <FieldTimeOutlined />
                <span>{CreateTime(detail.data[0].createTime)}</span>
              </div>
              <div className="detailPostBox-header__container-text">
                <EyeOutlined />
                <span> {detail.data[0].view}</span>
              </div>
            </div>
          ) : (
            <Skeleton.Input active size="small" />
          )}
          {detail.isSuccess ? <p>{detail.data[0].writer.nickname}</p> : <Skeleton.Input active size="small" />}
        </div>
      </div>
      <div className="detailPostBox_contents">
        {detail.isSuccess ? <p>{detail.data[0].content}</p> : <Skeleton.Input active block />}
        {detail.isSuccess &&
          !imgConfirm &&
          detail.data.map((v) =>
            v.img?.map((i) => <Image src={`/../public/uploads/${i.filename}`} key={i._id} fill alt="게시글사진" />)
          )}
      </div>
      <div className="detail-footer">
        <div className="detail-footer__container">
          <button onClick={() => handleOnLike()} className="detail-footer__container like">
            {detail.isSuccess && detail.data[0].likes.includes(user.id) ? <LikeFilled /> : <LikeOutlined />}
            <span>{detail.isSuccess && detail.data[0].likes.length}</span>
          </button>
          <div className="detail-footer__container comment">
            <CommentOutlined />
            <span>{detail.isSuccess && detail.data[0].comments.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => doCopy(`https://fivebirdsilver/${router.asPath}`)}>
            <ShareAltOutlined className="detail-footer__container share" />
          </button>
          {detail.isSuccess && detail.data[0].writer.id === user.id ? (
            <Dropdown trigger={["click"]} menu={{ items }} placement="bottom">
              <MoreOutlined className="font-bold cursor-pointer" />
            </Dropdown>
          ) : null}
        </div>
      </div>
      {detail.isSuccess && <Comments data={detail.data[0].comments} />}
      <Modal
        title="게시글 삭제"
        open={isModal}
        centered
        okText="확인"
        cancelText="취소"
        onOk={() => handleOnDelete()}
        onCancel={() => setIsModal(false)}
        width={300}
      >
        <p>삭제하시겠습니까?</p>
      </Modal>
    </div>
  );
}
