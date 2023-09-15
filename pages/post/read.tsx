import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dropdown, Modal, Skeleton } from "antd";

import {
  EyeOutlined,
  FieldTimeOutlined,
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaPen, FaCommentDots } from "react-icons/fa";

import CreateTime from "../../components/utils/createTime";
import { userState } from "../../store/index";
import { useGrid } from "../../components/utils/responsive";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { detailPost, writeComments } from "../../lib/apis/post";
import { IPost } from "../../lib/interface/post";

const Comments = dynamic(() => import("./comments"));

export default function Details() {
  const router = useRouter();
  const postId = router.query.id as string;
  const user = useRecoilValue(userState);
  const { isMobile, isTablet, isDesktop } = useGrid();

  const [comments, setCommnets] = useState("");
  const [isModal, setIsModal] = useState(false);

  const queryClient = useQueryClient();

  // const items = [
  //   {
  //     key: "1",
  //     label: (
  //       <a
  //         onClick={() =>
  //           router.push({
  //             pathname: "/post/edit",
  //             query: { id: detail.id },
  //           })
  //         }
  //       >
  //         수정
  //       </a>
  //     ),
  //   },
  //   {
  //     key: "2",
  //     label: <a onClick={() => setIsModal(true)}>삭제</a>,
  //   },
  // ];
  // const [detail, setDetail] = useState<any>([]);
  // const test = async () => {
  //   await detailPost(postId).then((res) => setDetail(res))
  // }
  const detail = useQuery<IPost[]>(["detail"], async () => await detailPost(postId));

  const imgConfirm = detail.isSuccess && detail.data?.map((v) => v.img).every((i) => i === null);

  // console.log(detail.data?.map((v) => v.img));
  useEffect(() => {
    // try {
    //   if (user === undefined || user?.name === null) {
    //     alert("로그인 후 이용 가능합니다.");
    //     router.push("/user/signin", undefined, { shallow: true });
    //   } else if (user?.loggin) {
    //     setToken().then((res) => {
    //       if (res === "userLogin") userConfirm();
    //     });
    //   } else return;
    // } catch (e) {
    //   console.log(e);
    //   alert("잠시 후 다시 시도해주세요");
    // }
  }, [postId, user?.logging]);

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

  // 대댓글까지의 총 개수
  const handleOnComments = (data: any) => {
    // let CommentsLength = 0;
    // CommentsLength =
    //   data
    //     ?.map((i) => i.children)
    //     .map((v) => v.length)
    //     .reduce((cum, n) => cum + n) + data?.length;
    // if (CommentsLength > 0) return CommentsLength;
    // else return 0;
  };

  // 게시글 좋아요
  const handleOnLike = async () => {
    // try {
    //   const res = await postLike(detail.id);
    //   if (res.data.success) {}
    //   else alert("잠시 후 다시 시도해주세요");
    // } catch (e) {
    //   console.log(e);
    //   alert("잠시 후 다시 시도해주세요");
    // }
  };

  const setComments = useMutation(writeComments, {
    onError: (data, error, variables) => {
      alert("잠시 후 다시 시도해주세요.");
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("detail");
      setCommnets("");
    },
  });

  // 댓글 작성
  const insertComments = async () => {
    const requset = {
      content: comments,
      writer: user.nickname,
      postId: postId,
    };
    if (comments.trim() !== "") {
      setComments.mutate(requset);
    }
  };

  const handleOnKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") insertComments();
  };
  // 게시글 삭제
  const handleOnDelete = async () => {
    // try {
    //   const res = await postDelete(detail.id);
    //   if (res.data.success) {
    //     setIsModal(false);
    //     router.push("/main");
    //   } else alert("잠시 후 다시 시도해주세요");
    // } catch (e) {
    //   console.log(e);
    //   alert("잠시 후 다시 시도해주세요");
    // }
  };

  return (
    <div className="detailPostBox">
      <div className="detailPostBox_header">
        {detail.isLoading ? (
          <Skeleton.Input active block />
        ) : (
          <h2>{detail.isSuccess && detail.isSuccess && detail.data[0].title}</h2>
        )}
        <div className="detailPostBox-header__container">
          {detail.isLoading ? (
            <Skeleton.Input active size="small" />
          ) : (
            <div className="flex gap-5">
              <div className="detailPostBox-header__container-text">
                <FieldTimeOutlined />
                <span>{detail.isSuccess && CreateTime(detail.isSuccess && detail.data[0].createTime)}</span>
              </div>
              <div className="detailPostBox-header__container-text">
                <EyeOutlined />
                <span> {detail.isSuccess && detail.data[0].view}</span>
              </div>
            </div>
          )}
          {detail.isLoading ? (
            <Skeleton.Input active size="small" />
          ) : (
            <p>{detail.isSuccess && detail.data[0].writer}</p>
          )}
        </div>
      </div>
      <div className="detailPostBox_contents">
        {detail.isLoading ? <Skeleton.Input active block /> : <p>{detail.isSuccess && detail.data[0].content}</p>}
        {detail.isSuccess &&
          !imgConfirm &&
          detail.data.map((v) =>
            v.img?.map((i) => <Image src={`/../public/uploads/${i.filename}`} key={i._id} fill alt="게시글사진" />)
          )}
      </div>
      <div className="detail-footer">
        <div className="detail-footer__container">
          <button onClick={() => handleOnLike()} className="detail-footer__container like">
            <LikeOutlined />
            {detail.isSuccess && detail.data[0].likes}
          </button>
          <div className="detail-footer__container comment">
            <CommentOutlined />
            <span>{detail.isSuccess && detail.data[0].comments.length}</span>
          </div>
        </div>
        {/* {detail.isSuccess && detail.data[0].writeStatus ? (
          <Dropdown trigger={["click"]} menu={{ items }} placement="bottom">
            <p style={{ cursor: "pointer" }}>
              <EllipsisOutlined style={{ fontSize: "24px", fontWeight: "bold" }} />
            </p>
          </Dropdown>
        ) : null} */}
        <button onClick={() => doCopy(`https://fivebirdsilver/${router.asPath}`)} className="detailPostBox_share">
          <p>
            <ShareAltOutlined />
          </p>
        </button>
      </div>
      <div className="comments">
        <div className="comments_input__container">
          <input
            placeholder="따뜻한 답변은 작성자에게 큰 힘이 됩니다 =)"
            value={comments}
            onChange={(e) => setCommnets(e.target.value)}
            onKeyUp={(e) => handleOnKeyup(e)}
            onClick={() => !user.logging && router.push("/user/signin")}
            className={user.logging ? `comments_input` : `comments_input not-logging`}
          />
          <button onClick={() => insertComments()}>
            <FaPen />
          </button>
        </div>
        <div className="comments__container">
          {detail.isSuccess &&
            detail.data.map((i) =>
              i.comments.map((v) => (
                <div className="comments__wrapper">
                  <div className="comments__wrapper-info">
                    <p>{v.writer}</p>
                    <p> · </p>
                    <p>{CreateTime(v.writeTime)}</p>
                  </div>
                  <p className="comments__wrapper-content">{v.content}</p>
                </div>
              ))
            )}
        </div>
      </div>
      <Modal
        title="게시글 삭제"
        open={isModal}
        centered
        okText="확인"
        cancelText="취소"
        onOk={handleOnDelete}
        onCancel={() => setIsModal(false)}
      >
        <p>정말 게시글을 삭제하시겠습니까?</p>
      </Modal>
    </div>
  );
}
