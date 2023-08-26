import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { postRank } from "../../lib/axios";

export default function Rank() {
  const router = useRouter();

  const rankigData = [
    {
      id: 1,
      title: "테스트1",
    },
    {
      id: 2,
      title: "테스트2",
    },
    {
      id: 3,
      title: "테스트4",
    },
    {
      id: 4,
      title: "테스트4",
    },
    {
      id: 5,
      title: "테스트5",
    },
    {
      id: 6,
      title: "테스트6",
    },
    {
      id: 7,
      title: "테스트7",
    },
    {
      id: 8,
      title: "테스트8",
    },
    {
      id: 9,
      title: "테스트9",
    },
    {
      id: 10,
      title: "테스트10",
    },
  ];

  return (
    <div className="ranking">
      <p className="rankingTitle">실시간 인기글</p>
      {rankigData.map((i, index) => (
        <div
          className="rankingContents"
          key={i.id}
          onClick={() =>
            router.push({
              pathname: "/post/read",
              query: { id: i.id },
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
