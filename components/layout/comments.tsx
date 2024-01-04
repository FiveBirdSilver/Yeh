import { Modal } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";

import { FaPen } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";

import CreateTime from "../utils/createTime";
import { dropComments, writeComments } from "../../lib/apis/post";
import { IComments, IDeleteComments } from "../../lib/interface/post";
import { AxiosError } from "axios";
import { toastAlert } from "../utils/toastAlert";

interface Props {
  data: IComments[];
  cookie: string;
  uid: string;
}

export default function Comments(props: Props) {
  const { data, cookie, uid } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = router.query.id as string;

  const [comments, setCommnets] = useState<string>("");
  const [commentId, setCommnetId] = useState<string>("");
  const [isModal, setIsModal] = useState<boolean>(false);

  // 댓글 작성
  const setComments = useMutation<string | void, unknown, IComments>((requset) => writeComments(requset, cookie), {
    onError: (data, error, variables) => {
      const { response } = error as unknown as AxiosError;
      toastAlert({ status: response?.status });
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries("detail");
      setCommnets("");
    },
  });

  // 댓글 작성
  const insertComments = async () => {
    const requset = {
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
      onError: (error) => {
        const { response } = error as unknown as AxiosError;
        toastAlert({ status: response?.status });
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("detail");
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
    e.stopPropagation(); // 이벤트 전파 중지
    if (e.key === "Enter") {
      insertComments();
    }
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
            onClick={() => !cookie && router.push("/user/signin")}
            className={cookie ? `comments_input` : `comments_input not-logging`}
          />
          <button onClick={() => insertComments()}>
            <FaPen />
          </button>
        </div>
        <div className="comments__container">
          {data.map((v, index) => (
            <div className="flex items-end justify-between w-full">
              <div className="comments__wrapper" key={index}>
                <div className="comments__wrapper-info">
                  <p>{v.nickname}</p>
                  <p> · </p>
                  <p>{CreateTime(v.writeTime!)}</p>
                </div>
                <p className="comments__wrapper-content">{v.content}</p>
              </div>
              {v.nickname === uid ? (
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
