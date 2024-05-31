import { useRouter } from "next/router";
import { useEffect } from "react";
import { EyeOutlined, CommentOutlined, LikeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { keywordState } from "../store";
import { IPost } from "../lib/interface/post";
import { viewPosts } from "../lib/apis/post";
import CreateTime from "../components/utils/createTime";
import Image from "next/image";

export default function Main() {
  const router = useRouter();
  const keyword = useRecoilValue(keywordState);
  const { ref, inView } = useInView();

  const posts = useInfiniteQuery<IPost>(
    ["posts", keyword],
    async ({ pageParam = 1 }) => viewPosts(keyword, pageParam),
    {
      useErrorBoundary: true,
      retry: 0,
      getNextPageParam: (lastPage, allPages) => {
        return allPages.length + 1;
      },
      select: (data) => ({
        pages: data.pages.flatMap((page) => page),
        pageParams: data.pageParams,
      }),
    }
  );

  useEffect(() => {
    if (inView) posts.fetchNextPage();
  }, [inView]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {posts.isSuccess &&
          posts.data?.pages?.map(({ _id, title, content, img, writer, createTime, view, comments, likes }) => (
            <Grid item xs={12} md={6} key={_id}>
              <Item
                onClick={() =>
                  router.push({
                    pathname: "/post/read",
                    query: { id: _id },
                  })
                }
                className="post-card"
                key={_id}
              >
                <>
                  {CreateTime(createTime).includes("방금전") ||
                  CreateTime(createTime).includes("분전") ||
                  CreateTime(createTime).includes("시간전") ? (
                    <p className="post-card__new_label">NEW</p>
                  ) : null}
                  <div className="post-card__text">
                    <div className="post-card__text_container">
                      <span className="post-card__text_container title">{title}</span>
                      <span className="post-card__text_container content">{content}</span>
                    </div>
                    <div className="post-card__image">
                      {img.length !== 0 && (
                        <div className="post-card__image_wrapper">
                          <Image src={`/uploads/${img[0].filename}`} alt="post_image" width={100} height={100} />
                          {img.length > 1 && <p className="post-card__image_num">{`+${img.length - 1}`}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="post-card__info">
                    <p className="post-card__info writer">{writer}</p>
                    <div className="post-card__info_wrapper">
                      <p>
                        <FieldTimeOutlined className="post-card__info_wrapper icon" />
                        {CreateTime(createTime)}
                      </p>
                      <p>
                        <EyeOutlined className="post-card__info_wrapper icon" /> {view}
                      </p>
                      <p>
                        <CommentOutlined className="post-card__info_wrapper icon" /> {comments.length}
                      </p>
                      <p>
                        <LikeOutlined className="post-card__info_wrapper icon" /> {likes.length}
                      </p>
                    </div>
                  </div>
                </>
              </Item>
            </Grid>
          ))}
      </Grid>
      <div ref={ref} />
    </Box>
  );
}
// {posts.isLoading ? (
//   <div className="post-card-loading">
//     <Skeleton paragraph={{ rows: 2 }} />
//     <Skeleton.Image active className="post-card-loading image" />
//   </div>
// ) : (
