import React, { useEffect, useMemo, useState } from 'react';
import * as S from './MainStyle';
import { useNavigate, useParams } from 'react-router-dom/dist/umd/react-router-dom.development';
import Header from '../../components/Header/Header';
import InfoSideBar from '../../components/InfoSideBar/InfoSideBar';
import LogoutState from '../../components/InfoSideBar/LogoutState';
import {useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import MainCalendar from '../../components/MainCalendar/MainCalendar'
import { PiPlusSquareLight } from "react-icons/pi";
import Chart from '../../components/Chart/Chart';
import BestFeedModal from '../Feed/BestFeedModal';
import img1 from '../../img/a운동.png';
import img2 from '../../img/a산책.png';
import img3 from '../../img/a재태크.png';
import img4 from '../../img/a학습.png';
import img5 from '../../img/a취미.png';
import img6 from '../../img/a일기.png';
import img7 from '../../img/a기타01.png';
import img8 from '../../img/a기타02.png';
/** @jsxImportSource @emotion/react */

function RealMain(props) {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [img1, img2, img3, img8, img4, img5, img6, img7];
    const queyrClient = useQueryClient().getQueryState("getPrincipal");
    const principal = queyrClient?.data?.data;
    const [ myChallenge, setMyChallenge ] = useState([]);
    const [ chart, setChart ] = useState(<></>);
    const [ isModalOpen, setModalOpen ] = useState(false);
    const navigate = useNavigate();
    const option = {
        headers: {
            Authorization: localStorage.getItem("accessToken")
        }
    } 

    const getNoticeList = useQuery(["getNoticeList"], async () => {
        return await instance.get(`/api/notices/${1}?pageSize=4`)
    }, {
        retry: 0,
        refetchOnWindowFocus: false
    });

    const getMyChallenges = useQuery(["getMyChallenges"], async () => {
        try {
        return await instance.get("/api/account/mychallenges", option);
        } catch(error) {
            throw new Error(error)
        }
        }, {
        retry: 0,
        refetchOnWindowFocus: false,
        onSuccess: response => {
            setMyChallenge(response.data);
        }
    });

    const getPopularChallenge = useQuery(["getPopularChallenge"], async () => {
        return await instance.get("/api/challenges/popular?year=&month=&date=");
    }, {
        retry: 0,
        refetchOnWindowFocus: false
    });

    const getBestFeed = useQuery(["getBestFeed"], async () => {
        return await instance.get("/api/feed/best");
    }, {
        retry: 0,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 1300); 

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setChart(<Chart />);
    }, [])

    const handleChallengeClick = () => {

    }
    
    const stampCalendarClick = () => {
        navigate("/stamp")
    }

    const handleChallengeCreateClike = () => {
        navigate("/challenge/category");
    }

    const handlePurchasePointClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div css={S.MainBase}>    
            <Header />
            
            <div css={S.MainBox}>

                <div css={S.part1}>
                    <div css={S.box01}>
                            {principal ? <InfoSideBar/> : <LogoutState/>}
                    </div>
                    <div css={S.part5}>
                        <div css={S.LabelBox}>
                            <div css={S.box02}>
                                <label>가장 인기있는 챌린지</label>
                                <div css={S.BestChallenge} onClick={() =>
                                    handleChallengeClick(navigate(`/challenge/${getPopularChallenge?.data?.data?.challengeId}`))}>
                                    <div>챌린지 이름 <b>{getPopularChallenge?.data?.data?.challengeName}</b></div>
                                    <div>참여인원 <b>{getPopularChallenge?.data?.data?.challenger}명</b></div>
                                    <div>기간 <b>{getPopularChallenge?.data?.data?.startDate} ~ {getPopularChallenge?.data?.data?.endDate}</b></div>
                                    <div css={S.Content}>
                                        <b>챌린지 소개<p>{getPopularChallenge?.data?.data?.introduction}</p></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div css={S.LabelBox2}>
                            <div css={S.box02}>
                                <label>가장 인기있는 피드</label>
                                <div css={S.BestFeed}>
                                    <div css={S.FeedHeader}>
                                        <div css={S.userInfo}>
                                            <img css={S.InfoImg} src={getBestFeed?.data?.data?.profileUrl} alt="" />
                                            <b>{getBestFeed?.data?.data?.nickname}</b>  
                                        </div>
                                        <div css={S.ChInfo}>
                                            <div>
                                                <p>[{getBestFeed?.data?.data?.categoryName}]</p>
                                                <b>{getBestFeed?.data?.data?.challengeName}</b>
                                            </div>
                                        </div>
                                    </div>   
                                    <div css={S.SFeedBody} onClick={handlePurchasePointClick}>
                                        {getBestFeed?.data?.data?.img && <img css={S.FeedImg} src={getBestFeed?.data?.data?.img} alt="" />}
                                        <div css={S.FeedContentBox(!!getBestFeed?.data?.data?.img)} imgexists={(!!getBestFeed?.data?.data?.img).toString()}></div>  
                                        <div css={S.smallFeedBody}>
                                            {getBestFeed?.data?.data?.stopWatch !== 0 ? (
                                                <div css={S.TimeBox}>
                                                    <b>진행 시간 : {convertSecondsToTime(getBestFeed?.data?.data?.stopWatch)}</b>
                                                    <a>{getTimeDifference(getBestFeed?.data?.data?.dateTime)}</a>
                                                </div>
                                            ) : (<a>{getTimeDifference(getBestFeed?.data?.data?.dateTime)}</a>)}
                                            <div css={S.FeedContent}>{getBestFeed?.data?.data?.feedContent}</div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            {isModalOpen && (
                                <div css={S.modalOverlay}>
                                    <div css={S.modalContent}>
                                        <BestFeedModal onClose={handleCloseModal} getBestFeed={getBestFeed}/>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    <div>
                        <div css={S.part2}>
                            <div css={S.LabelBox2}>
                                <div css={S.box03}>
                                    <label>참여중인 챌린지 리스트</label>
                                    <div css={S.ListBox}>
                                        {myChallenge?.map((myChallenge, index) => (
                                            <li key={index}  onClick={() => handleChallengeClick(navigate(`/challenge/${myChallenge.challengeId}`))}>
                                                {myChallenge.challengeName}
                                            </li>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div css={S.box031} onClick={() => handleChallengeClick(navigate("/challenge/category"))}>
                                <b>챌린지생성</b> <PiPlusSquareLight onClick={handleChallengeCreateClike}/>
                            </div>
                            <div css={S.CategoryImgBox} onClick={() => handleChallengeClick(navigate("/challenges"))}>
                                <img src={images[currentImage]} alt="Main Image" css={S.CategoryImg} />
                            </div> 
                        </div>
                        <div css={S.part3}>
                            <div css={S.box04}>
                                {principal?.isAdmin === 1 ?
                                    chart
                                :
                                <div css={S.MiniContent} onClick={() => {stampCalendarClick()}}>
                                    <MainCalendar />
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div css={S.part4}>
                    <div css={S.CategoryImgBox}>
                        <img src={images[currentImage]} alt="Main Image" css={S.CategoryImg} />
                    </div> 
                    <div css={S.box05}>
                        <div css={S.LogoImg1}></div>
                    </div>
                    <div css={S.box06}>
                        <h4 onClick={() => handleChallengeClick(navigate("/notice/page/1"))}>공지사항</h4>
                        <table css={S.NoticeTb}>
                            <tbody>
                                {!getNoticeList.isLoading && getNoticeList?.data?.data?.map(notice => {
                                    return (
                                        <tr css={S.Notice} key={notice.noticeId} onClick={() => { navigate(`/notice/${notice.noticeId}`) }}>
                                            <td css={S.noticeTitle}>{notice.noticeTitle}</td>
                                            <td>{notice.nickname}</td>
                                            <td>{notice.noticeDate}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>


                
            

            </div>

        </div>
    );
}

export default RealMain;

function getTimeDifference(feedDateTime) {
    const currentDateTime = new Date();
    const feedDate = new Date(feedDateTime);

    const timeDifferenceInSeconds = Math.floor((currentDateTime - feedDate) / 1000);

    if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds}초 전`;
    } else if (timeDifferenceInSeconds < 3600) {
        const minutes = Math.floor(timeDifferenceInSeconds / 60);
        return `${minutes}분 전`;
    } else if (timeDifferenceInSeconds < 86400) {
        const hours = Math.floor(timeDifferenceInSeconds / 3600);
        return `${hours}시간 전`;
    } else {
        const days = Math.floor(timeDifferenceInSeconds / 86400);
        return `${days}일 전`;
    }
}

function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${hours > 0 ? hours + '시간 ' : ''}${minutes > 0 ? minutes + '분 ' : ''}${remainingSeconds}초`;
    return formattedTime.trim();
}