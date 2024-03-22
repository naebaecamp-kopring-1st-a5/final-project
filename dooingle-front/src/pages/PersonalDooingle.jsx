import Header from "../components/Header.jsx";
import ProfileImageFrame from "../components/ProfileImageFrame.jsx";
import Navigation from "../components/Navigation.jsx";
import DooingleAndCatch from "../components/DooingleAndCatch.jsx";
import DooinglerListAside from "../components/DooinglerListAside.jsx";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import { BACKEND_SERVER_ORIGIN } from "../env.js"

const sliceInitialState = {
  // initial state를 안 정해주면 에러 발생해서 렌더링이 안 됨
  size: 0,
  content: [],
  number: 0,
  sort: {},
  first: true,
  last: true,
  numberOfElements: 0,
  pageable: {},
  empty: true,
}

async function fetchDooinglesAndCatches(userId, lastDooingleId = null) {
  const queryParameter = lastDooingleId === null ? "" : `?cursor=${lastDooingleId}`

  const response = await axios.get(`${BACKEND_SERVER_ORIGIN}/api/users/${userId}/dooingles`.concat(queryParameter), {
    withCredentials: true, // ajax 요청에서 withCredentials config 추가
  });
  return response.data;
}

async function fetchMyDooinglesAndCatches(lastDooingleId = null) {
  const queryParameter = lastDooingleId === null ? "" : `?cursor=${lastDooingleId}`

  const response = await axios.get(`${BACKEND_SERVER_ORIGIN}/api/users/my-dooingles`.concat(queryParameter), {
    withCredentials: true, // ajax 요청에서 withCredentials config 추가
  });
  return response.data;
}

export default function PersonalDooinglePage() {

  const [dooinglesAndCatchesSlice, setDooinglesAndCatchesSlice] = useState(sliceInitialState);
  const params = useParams();
  const userId = params?.userId

  useEffect(() => {
    if (userId) {
      fetchDooinglesAndCatches(userId).then(data => {
        setDooinglesAndCatchesSlice(data)
      });
    } else {
      fetchMyDooinglesAndCatches().then(data => {
        setDooinglesAndCatchesSlice(data)
      });
    }
  }, [userId]);

  return (
    <>
      <Header />

      {/* 소개 섹션 반투명 */}
      <section className="h-[8.75rem] bg-[#000000] opacity-40 shadow-[0_0.25rem__0.25rem_#000000]">
        <div className="grid grid-cols-12 gap-x-[2.5rem] mx-[8.75rem] min-h-full">
          <div className="col-start-1 col-span-3 flex justify-center items-center">
            <ProfileImageFrame />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-x-[2.5rem] mx-[8.75rem] h-[4.5rem] ml-40px">
        {/* Feed와 배치 다른 부분: nav의 py가 3.75rem -> 3rem, 본문 섹션 py가 2.75rem -> 0.75rem */}

        {/* nav */}
        <nav className="col-start-1 col-span-3 flex justify-center text-[#5f6368]">
          <div className="flex flex-col items-center py-[3rem] gap-[1.25rem]">
            <Navigation />
          </div>
        </nav>

        {/* 뒹글 & 캐치 */}
        <section className="col-start-4 col-span-6 flex flex-col py-[0.75rem] text-[#5f6368]">
          <div className="flex px-[2rem] gap-[1.75rem] shadow-[inset_0_-0.125rem_0_0_#9aa1aa]">
            <div className="hover:shadow-[inset_0_-0.125rem_0_0_#fa61bd]">
              <button className="py-[0.5rem]">
                <div>
                  전체
                </div>
              </button>
            </div>
            <div className="hover:shadow-[inset_0_-0.125rem_0_0_#fa61bd]">
              <button className="py-[0.5rem]">
                <div>
                  아직 답변이 없는 뒹글
                </div>
              </button>
            </div>
          </div>

          <div className="py-[1rem]">
            {dooinglesAndCatchesSlice.content.map(dooingleAndCatch => (
                <DooingleAndCatch
                    key={dooingleAndCatch.dooingleId}
                    ownerName={dooingleAndCatch.ownerName}
                    dooingleContent={dooingleAndCatch.content}
                    catchContent={dooingleAndCatch.catch.content}
                />
            ))}
          </div>
        </section>

        {/* aside */}
        <DooinglerListAside />

        <div className="col-start-1 col-span-12 mt-10">
          <Link to={"/"}>웰컴 페이지로</Link>
        </div>
      </div>
    </>
  );
}
