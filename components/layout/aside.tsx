import axios from "axios";
import { useRouter } from "next/router";
import { viewPosts } from "../../lib/apis/post";
import { useQuery } from "react-query";
import { IPost } from "../../lib/interface/post";

export default function Aside() {
  const router = useRouter();
  const post = useQuery<IPost[]>(["posts"], async () => await viewPosts({ keyword: "" }));
  const ranking = post.data?.slice(0, 10);

  return (
    <div className="ranking">
      <p className="rankingTitle">실시간 인기글</p>
      {post.isSuccess &&
        ranking?.map((i, index: number) => (
          <div
            className="rankingContents"
            key={i._id}
            onClick={() =>
              router.push({
                pathname: "/post/read",
                query: { id: i._id },
              })
            }
          >
            <p className="index">{index + 1}</p>
            <p className="title">{i.title}</p>
          </div>
        ))}
    </div>
  );
}
