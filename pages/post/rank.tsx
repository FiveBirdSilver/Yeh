import axios from "axios";
import { useRouter } from "next/router";
import { getPostAll } from "../../lib/apis/post";
import { useQuery } from "react-query";
import { Post } from "../../lib/interface/post";

export default function Rank() {
  const router = useRouter();
  const rankigData = useQuery<Post[]>(["posts"], async () => await getPostAll());

  return (
    <div className="ranking">
      <p className="rankingTitle">실시간 인기글</p>
      {rankigData.data &&
        rankigData.data?.map((i, index: number) => (
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
