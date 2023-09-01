import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Pagination, Skeleton } from "antd";
import { EyeOutlined, CommentOutlined, LikeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Image from "next/image";
import dynamic from "next/dynamic";

import CreateTime from "../components/utils/createTime";
import { useGrid } from "../components/utils/responsive";
import { keywordState, pageState, userState } from "../store/index";
import { useInView } from "react-intersection-observer";

import { useInfiniteQuery, useQuery } from "react-query";
import { getPostAll } from "../lib/apis/post";
import { Grid } from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Post } from "../lib/interface/post";

export default function Main() {
  const router = useRouter();
  const { ref, inView } = useInView();

  const posts = useQuery<Post[]>(["posts"], async () => await getPostAll());

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
          {posts?.data?.map((i: any) => (
            <Grid item xs={12} md={6}>
              <Item
                onClick={() =>
                  router.push({
                    pathname: "/post/read",
                    query: { id: i.id },
                  })
                }
                className="post-card"
                key={i.id}
              >
                {CreateTime(i.createTime).includes("방금전") ||
                CreateTime(i.createTime).includes("분전") ||
                CreateTime(i.createTime).includes("시간전") ? (
                  <p className="post-card__new_label">NEW</p>
                ) : null}
                <div className="post-card__text">
                  <div className="post-card__text_container">
                    <span className="post-card__text_container title">{i.title}</span>
                    <span className="post-card__text_container content">{i.content}</span>
                  </div>
                  {i.image !== undefined && (
                    <div className="ImageInfo">
                      <Image src={`/../public/post/${i.image}.jpeg`} width={100} height={100} alt="postImage" />
                      {i.image.totalImagesCount > 1 ? (
                        <p className="totalImagesCount">{`+${i.image.totalImagesCount - 1}`}</p>
                      ) : null}
                    </div>
                  )}
                </div>
                <div className="post-card__info">
                  <p className="post-card__info writer">{i.writer}</p>
                  <div className="post-card__info_wrapper">
                    <p>
                      <FieldTimeOutlined className="post-card__info_wrapper icon" />
                      {CreateTime(i.createTime)}
                    </p>
                    <p>
                      <EyeOutlined className="post-card__info_wrapper icon" /> {i.view}
                    </p>
                    <p>
                      <CommentOutlined className="post-card__info_wrapper icon" /> {i.comments}
                    </p>
                    <p>
                      <LikeOutlined className="post-card__info_wrapper icon" /> {i.likes}
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
