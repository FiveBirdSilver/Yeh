import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Pagination, Skeleton } from "antd";
import { EyeOutlined, CommentOutlined, LikeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Image from "next/image";
import dynamic from "next/dynamic";

import CreateTime from "../components/utils/createTime";
import setToken from "../components/utils/setToken";
import { useGrid } from "../components/utils/responsive";
import { keywordState, pageState, userState } from "../store/index";
import { useInView } from "react-intersection-observer";

import { useInfiniteQuery, useQuery } from "react-query";
import { getPostAll } from "../lib/axios/post";
import { Grid } from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import axios from "axios";
const Rank = dynamic(() => import("./post/rank"));

export default function Main() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const keyword = useRecoilValue(keywordState);

  const { isMobile, isTablet, isDesktop } = useGrid();
  const { ref, inView } = useInView();

  const posts = useQuery(["posts"], async () => await getPostAll());

  console.log(posts);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // const { data, isLoading, error, refetch, fetchNextPage, status } = useInfiniteQuery(
  //   "posts",
  //   async ({ pageParam = 1 }) => {
  //     const res = await postSearch(keyword, pageParam);
  //     return {
  //       result: res.data.data,
  //       page: pageParam,
  //     };
  //   },
  //   {
  //     getNextPageParam: (lastPage) => {
  //       return lastPage.page + 1;
  //     },
  //   }
  // );

  // const POST = data?.pages.map((data) => data.result)?.map((val) => val.posts);
  // const flattenedArray = POST?.reduce((previousValue, currentValue) => {
  //   return previousValue.concat(currentValue);
  // });

  // useEffect(() => {
  //   refetch();
  // }, [keyword]);

  // useEffect(() => {
  //   if (inView) fetchNextPage();
  // }, [inView]);

  // // 리프레시 토큰 발급
  // useEffect(() => {
  //   if (user?.loggin) setToken();
  // }, []);
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
                <div className="mainInfo">
                  <div className="mainInfoText">
                    <p className="mainInfoTitle">{i.title}</p>
                    <p className="mainInfoContents">{i.content}</p>
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
                <div className="addInfo">
                  <p className="addInfoWriter">{i.writer}</p>
                  <div className="addInfo_wrap">
                    <p className="addInfo_icons_wrap">
                      <FieldTimeOutlined className="addInfoIcons" />
                      {CreateTime(i.createTime)}
                    </p>
                    <p className="addInfo_icons_wrap">
                      <EyeOutlined className="addInfoIcons" /> {i.view}
                    </p>
                    <p className="addInfo_icons_wrap">
                      <CommentOutlined className="addInfoIcons" /> {i.comments}
                    </p>
                    <p className="addInfo_icons_wrap">
                      <LikeOutlined className="addInfoIcons" /> {i.likes}
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
