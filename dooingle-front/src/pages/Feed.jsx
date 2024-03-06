import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Dooingle from "../components/Dooingle.jsx";

export default function FeedPage() {
  return (
    <>
      <Header />

      <div className="grid grid-cols-12 gap-x-[2.5rem] mx-[8.75rem] h-[4.5rem] ml-40px">
        <nav className="col-start-1 col-span-3 flex justify-center text-[#5f6368]">
          <div className="flex flex-col items-center py-[3.75rem] gap-[1.25rem]">
            <div>
              <img className="border-[0.125rem] rounded-full w-[7.5rem] h-[7.5rem] object-cover" alt="사용자 프로필 이미지"/>
            </div>
            <div className="flex flex-col items-center gap-[1rem]">
              <div>
                <a href="#">내 뒹글함</a>
              </div>
              <div>
                <a href="#">팔로우하는 뒹글러</a>
              </div>
              <div>
                <a href="#">뒹글 탐색</a>
              </div>
            </div>
          </div>
        </nav>

        <section className="col-start-4 col-span-6 flex flex-col py-[2.75rem] text-[#5f6368]">
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
                  팔로우
                </div>
              </button>
            </div>
          </div>

          <div className="py-[1rem]">
            <Dooingle></Dooingle>
            <Dooingle></Dooingle>
            <Dooingle></Dooingle>
            <Dooingle></Dooingle>
            <Dooingle></Dooingle>
            <Dooingle></Dooingle>
            <Dooingle></Dooingle>
            <Dooingle></Dooingle>
          </div>
        </section>

        <aside className="col-start-10 col-span-3 flex justify-center text-[#5f6368] bg-amber-50">
          <div>뜨거운, 새 뒹글러 목록 표시</div>
          {/* 뜨거운, 새 뒹글러 목록 표시 */}
        </aside>

        <div className="col-start-1 col-span-12 mt-10">
          <Link to={"/"}>웰컴 페이지로</Link>
        </div>
      </div>
    </>
  )
}
