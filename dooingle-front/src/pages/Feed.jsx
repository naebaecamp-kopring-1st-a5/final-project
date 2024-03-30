import {Link} from "react-router-dom";
import Header from "../components/Header.jsx";
import Dooingle from "../components/Dooingle.jsx";
import ProfileImageFrame from "../components/ProfileImageFrame.jsx";
import Navigation from "../components/Navigation.jsx";
import DooinglerListAside from "../components/DooinglerListAside.jsx";
import {useEffect, useRef, useState} from "react";
import {EventSourcePolyfill} from 'event-source-polyfill';
import axios from "axios";
import {BACKEND_SERVER_ORIGIN} from "../env.js"
import MorePostButton from "../components/button/MorePostButton.jsx";

async function fetchDooinglesFeedSlice(lastDooingleId = null) {
  const queryParameter = lastDooingleId === null ? "" : `?cursor=${lastDooingleId}`

  const response = await axios.get(`${BACKEND_SERVER_ORIGIN}/api/dooingles`.concat(queryParameter), {
    withCredentials: true, // ajax 요청에서 withCredentials config 추가
  });
  return response.data;
}

async function fetchDooinglesFeedSliceOfFollowing(lastDooingleId = null) {
  const queryParameter = lastDooingleId === null ? "" : `?cursor=${lastDooingleId}`

  const response = await axios.get(`${BACKEND_SERVER_ORIGIN}/api/dooingles/follow`.concat(queryParameter), {
    withCredentials: true,
  });
  return response.data;
}

async function fetchLoggedInUserLink() {
  const response = await axios.get(`${BACKEND_SERVER_ORIGIN}/api/users/current-dooingler`, {
    withCredentials: true, // ajax 요청에서 withCredentials config 추가
  });
  return response.data.userLink;
}

export default function FeedPage() {

  const [newFeedNotification, setNewFeedNotification] = useState(null);
  // const [personalNotification, setPersonalNotification] = useState(null); TODO 개인 알림 관련 별도 작업 필요
  const [currentUserLink, setCurrentUserLink] = useState(undefined);
  const [dooingles, setDooingles] = useState([]);
  const [isEntireFeed, setIsEntireFeed] = useState(true) // TODO isEntireFeed state가 정말 필요한지는 더 고민해볼 것
  const hasNextSlice = useRef(false);

  useEffect(() => {
    fetchDooinglesFeedSlice().then(newDooinglesSlice => {
      setDooingles(newDooinglesSlice.content)
      hasNextSlice.current = !newDooinglesSlice.last
    });
    fetchLoggedInUserLink().then(loggedInUserLink => {
      setCurrentUserLink(loggedInUserLink)
    })

    const eventSource = new EventSourcePolyfill(`${BACKEND_SERVER_ORIGIN}/api/notifications/connect`,
      {withCredentials: true}
    );

    addSseConnectionEventListenerToEventSource(eventSource)
    addNewFeedNotificationEventListenerToEventSource(eventSource);
    // addPersonalNotificationEventListenerToEventSource(eventSource); TODO 개인 알림 관련 별도 작업 필요

    return () => {
      eventSource.close(); // 컴포넌트 unmount할 때 eventSource 닫기
    }
  }, []);

  function addSseConnectionEventListenerToEventSource(eventSource) {
    eventSource.addEventListener("connect", (event) => {
      const { data: receivedConnectData } = event;
      console.log("connect event data: ", receivedConnectData);
    });
  }

  function addNewFeedNotificationEventListenerToEventSource(eventSource) {
    eventSource.addEventListener("feed", event => {
      const receivedFeed = JSON.parse(event.data);
      setNewFeedNotification(receivedFeed); // 전달받는 데이터는 DooingleResponse 형식
      // TODO : 전달받는 데이터로 뒹글 컴포넌트 만들어서 뒹글 목록 위에 추가
    });
  }

/*  TODO 개인 알림 관련 별도 작업 필요
  function addPersonalNotificationEventListenerToEventSource(eventSource) {
    eventSource.addEventListener("notification", event => {
      const receivedNotification = JSON.parse(event.data);

      switch (receivedNotification.notificationType) {
        case "DOOINGLE": receivedNotification.message = "새 뒹글이 굴러왔어요!"; break;
        case "CATCH": receivedNotification.message = "내 뒹글에 캐치가 달렸어요!"; break;
      }

      // TODO : 전달받는 데이터로 알림 컴포넌트 만들어서 알림 목록에 추가 (+ 팝업 띄우기 또는 알림 버튼 빨간색으로 바꾸기)
      setPersonalNotification(receivedNotification);
    });
  }*/

  function handleMoreFeedButton(isEntireFeed) {
    const lastDooingleId = dooingles.slice(-1)[0]?.["dooingleId"]

    if (isEntireFeed === true) {
      fetchDooinglesFeedSlice(lastDooingleId).then(newDooinglesSlice => {
        setDooingles(prevDooingles => {
          const uniqueNewDooingles = newDooinglesSlice.content.filter(newDooingle => prevDooingles.every(prevDooingle => prevDooingle?.dooingleId !== newDooingle?.dooingleId))
          return [...prevDooingles, ...uniqueNewDooingles]
        })
        hasNextSlice.current = !newDooinglesSlice.last
      })
    } else {
      fetchDooinglesFeedSliceOfFollowing(lastDooingleId).then(newDooinglesSlice => {
        setDooingles(prevDooingles => {
          const uniqueNewDooingles = newDooinglesSlice.content.filter(newDooingle => prevDooingles.every(prevDooingle => prevDooingle?.dooingleId !== newDooingle?.dooingleId))
          return [...prevDooingles, ...uniqueNewDooingles]
        })
        hasNextSlice.current = !newDooinglesSlice.last
      })
    }
  }

  function handleEntireFeedButton() {
    fetchDooinglesFeedSlice().then(newDooinglesSlice => {
      setDooingles(newDooinglesSlice.content)
      hasNextSlice.current = !newDooinglesSlice.last
    });
    setIsEntireFeed(true);
  }

  function handleFollowingFeedButton() {
    fetchDooinglesFeedSliceOfFollowing().then(newDooinglesSlice => {
      setDooingles(newDooinglesSlice.content)
      hasNextSlice.current = !newDooinglesSlice.last
    });
    setIsEntireFeed(false);
  }

  function handleNewFeedNotificationButton() {
    setNewFeedNotification(null);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

/*  function handlePersonalNotificationButton() {
    setPersonalNotification(null);
  }*/

  return (
    <>
      <Header />

      <div className="grid grid-cols-12 gap-x-[2.5rem] mx-[8.75rem] h-[4.5rem] ml-40px">
        <nav className="col-start-1 col-span-3 flex justify-center text-[#5f6368]">
          <div className="flex flex-col items-center py-[3.75rem] gap-[1.25rem]">
            <ProfileImageFrame userLink={currentUserLink} />
            <Navigation/>
          </div>
        </nav>

        <section className="col-start-4 col-span-6 flex flex-col py-[2.75rem] text-[#5f6368]">
          <div className="flex px-[2rem] gap-[1.75rem] shadow-[inset_0_-0.125rem_0_0_#9aa1aa]">
            <div className="hover:shadow-[inset_0_-0.125rem_0_0_#fa61bd]">
              <button onClick={handleEntireFeedButton} className="py-[0.5rem]">
                <div>
                  전체
                </div>
              </button>
            </div>
            <div className="hover:shadow-[inset_0_-0.125rem_0_0_#fa61bd]">
              <button onClick={handleFollowingFeedButton} className="py-[0.5rem]">
                <div>
                  팔로우
                </div>
              </button>
            </div>
          </div>

          {newFeedNotification && (
            <button type="button" onClick={handleNewFeedNotificationButton}
                    className="fixed top-[4.5rem] self-center max-w-fit mt-[0.75rem] mr-[0.5rem] px-[0.5rem] py-[0.25rem]
                  rounded-[0.625rem] text-[0.75rem] text-white font-bold bg-[#fa61bd]
                  border-[0.0625rem] border-[#fa61bd] animate-pulse">
              새 피드가 있어요!
            </button>
          )}
{/*          TODO 개인 알림 관련 별도 작업 필요
          {personalNotification && (
            <div className="border-2">
              <button onClick={handlePersonalNotificationButton}>새로 뒹글을 받았거나 내가 쓴 뒹글에 캐치가 있어요!</button>
            </div>
          )}*/}

          <div className="pt-[1rem]">
            {dooingles.map(dooingle => (
              <Dooingle
                key={dooingle.dooingleId}
                ownerName={dooingle.ownerName}
                ownerUserLink={dooingle.ownerUserLink}
                dooingleId={dooingle.dooingleId}
                content={dooingle.content}
                hasCatch={dooingle.hasCatch}
              />
            ))}
          </div>
          <div className="flex justify-center mt-[1rem]">
            {hasNextSlice.current && <MorePostButton onClick={() => handleMoreFeedButton(isEntireFeed)} />}
          </div>
        </section>

        <DooinglerListAside/>

        <div className="col-start-1 col-span-12 mt-10">
          <Link to={"/"}>웰컴 페이지로</Link>
        </div>
      </div>
    </>
  )
}
