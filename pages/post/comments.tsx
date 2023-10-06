import { Modal } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";

import { FaPen } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { useMutation, useQuery, useQueryClient } from "react-query";

import CreateTime from "../../components/utils/createTime";
import { dropComments, writeComments } from "../../lib/apis/post";
import { userState } from "../../store";
import { IComments, IDeleteComments } from "../../lib/interface/post";
import { GetServerSideProps } from "next";

interface Props {
  data: IComments[];
  cookie: string;
}

export default function Comments(props: Props) {
  const { data, cookie } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = router.query.id as string;
  const user = useRecoilValue(userState);

  const [comments, setCommnets] = useState<string>("");
  const [commentId, setCommnetId] = useState<string>("");
  const [isModal, setIsModal] = useState<boolean>(false);

  // 댓글 작성
  const setComments = useMutation<string | void, unknown, IComments>((requset) => writeComments(requset, cookie), {
    onError: (data, error, variables) => {
      alert("잠시 후 다시 시도해주세요.");
    },
    onSuccess: async (data, variables) => {
      if (data === "Access") {
        queryClient.invalidateQueries("detail");
        setCommnets("");
      } else {
        alert("세션이 만료 되었거나 유효하지 않은 요청 입니다.");
        await router.push("/user/signin");
      }
    },
  });

  // 댓글 작성
  const insertComments = async () => {
    const requset = {
      userId: user.id,
      nickname: user.nickname,
      postId: postId,
      content: comments,
    };
    if (comments.trim() !== "") {
      setComments.mutate(requset);
    }
  };

  // 댓글 삭제
  const deleteComments = useMutation<string | void, unknown, IDeleteComments>(
    (request) => dropComments(request, cookie),
    {
      onError: (data, error, variables) => {
        alert("잠시 후 다시 시도해주세요.");
      },
      onSuccess: (data, variables) => {
        if (data === "Access") {
          queryClient.invalidateQueries("detail");
        } else {
          alert("세션이 만료 되었거나 유효하지 않은 요청 입니다.");
          router.push("/user/signin");
        }
      },
    }
  );

  // 댓글 삭제 모달 ON
  const handleOnDeleteComment = async (id: string) => {
    setIsModal(true);
    setCommnetId(id);
  };

  // 댓글 삭제 확인
  const handleOnDeleteCommentOk = async () => {
    const request = {
      postId: postId,
      commentId: commentId,
    };
    deleteComments.mutate(request);
    setIsModal(false);
  };

  const handleOnKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") insertComments();
  };

  return (
    <>
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
          {data.map((v, index) => (
            <div className="flex justify-between items-end w-full">
              <div className="comments__wrapper" key={index}>
                <div className="comments__wrapper-info">
                  <p>{v.nickname}</p>
                  <p> · </p>
                  <p>{CreateTime(v.writeTime!)}</p>
                </div>
                <p className="comments__wrapper-content">{v.content}</p>
              </div>
              {v.nickname === user.nickname ? (
                <button onClick={() => handleOnDeleteComment(v._id as string)} className="comments__delete">
                  삭제
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <Modal
        title="댓글 삭제"
        open={isModal}
        centered
        okText="확인"
        cancelText="취소"
        onOk={() => handleOnDeleteCommentOk()}
        onCancel={() => setIsModal(false)}
        width={300}
      >
        <p>삭제하시겠습니까?</p>
      </Modal>
    </>
  );
}
