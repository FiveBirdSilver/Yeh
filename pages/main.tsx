import { useRouter } from "next/router";
import { EyeOutlined, CommentOutlined, LikeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "react-query";
import { Grid } from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import CreateTime from "../components/utils/createTime";
import { IPost } from "../lib/interface/post";
import { viewPosts } from "../lib/apis/post";
import { Skeleton } from "antd";
import { useRecoilValue } from "recoil";
import { keywordState } from "../store";

export default function Main() {
  const router = useRouter();
  const { ref, inView } = useInView();

  const keyword = useRecoilValue(keywordState);
  const posts = useQuery<IPost[]>(["posts", keyword], async () => await viewPosts(keyword));

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {posts?.data?.map((i: IPost) => (
            <Grid item xs={12} md={6}>
              <Item
                onClick={() =>
                  router.push({
                    pathname: "/post/read",
                    query: { id: i._id },
                  })
                }
                className="post-card"
                key={i._id}
              >
                {posts.isLoading ? (
                  <div className="post-card-loading">
                    <Skeleton paragraph={{ rows: 2 }} />
                    <Skeleton.Image active className="post-card-loading image" />
                  </div>
                ) : CreateTime(i.createTime).includes("방금전") ||
                  CreateTime(i.createTime).includes("분전") ||
                  CreateTime(i.createTime).includes("시간전") ? (
                  <p className="post-card__new_label">NEW</p>
                ) : null}

                <div className="post-card__text">
                  <div className="post-card__text_container">
                    <span className="post-card__text_container title">{i.title}</span>
                    <span className="post-card__text_container content">{i.content}</span>
                  </div>
                  {i.img.length !== 0 && (
                    <div className="post-card__image">
                      <div className="post-card__image_wrapper">
                        <Image src={`/../public/uploads/${i.img[0]?.filename}`} fill alt="postImage" />
                      </div>
                      {i.img.length > 1 && <p className="post-card__image_num">{`+${i.img.length - 1}`}</p>}
                    </div>
                  )}
                </div>
                <div className="post-card__info">
                  <p className="post-card__info writer">{i.writer.nickname}</p>
                  <div className="post-card__info_wrapper">
                    <p>
                      <FieldTimeOutlined className="post-card__info_wrapper icon" />
                      {CreateTime(i.createTime)}
                    </p>
                    <p>
                      <EyeOutlined className="post-card__info_wrapper icon" /> {i.view}
                    </p>
                    <p>
                      <CommentOutlined className="post-card__info_wrapper icon" /> {i.comments.length}
                    </p>
                    <p>
                      <LikeOutlined className="post-card__info_wrapper icon" /> {i.likes.length}
                    </p>
                  </div>
                </div>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
      <p className="scrollRef" ref={ref}>
        ㅤ
      </p>
    </>
  );
}
