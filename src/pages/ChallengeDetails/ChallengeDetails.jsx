import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { instance } from '../../api/config/instance';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
import {AiOutlineLike, AiTwotoneLike} from 'react-icons/ai';
/** @jsxImportSource @emotion/react */

const Layout = css`
    display: flex;
    flex-direction: column;
`;

const HeaderLayout = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 150px;
    margin: 0px 30px;

    & b {
        font-size: 30px;
    }

    & p {
        margin: 0px;
        margin-top: 20px;
    }
`;

const Box = css`
    display: flex;
    justify-content: center;
    align-items: center;

`;

const DeleteButton = css`
    width: 50px;
    height: 30px;
    border: 1px solid #eee;
    background-color: transparent;
    border-radius: 10px;
    cursor: pointer;
    
    &:active {
        background-color: #eee;
    }
`;

const Writer = css`
    font-size: 14px;

    & b {
        margin-left: 5px;
        font-size: 20px;
    }
`;

const BodyLayout = css`
    display: flex;
    justify-content: space-between;
    margin: 0px 30px;
    
    & img {
        
    }

    & button {
        width: 100px;
    }
`;

const BodyLeftBox = css`

`;

const BodyRightBox = css`
    display: flex;
    flex-direction: column;

    & div {
        width: 400px;
        height: 100px;
        border: 2px solid #dbdbdb;
        margin: 20px 0px;
    }

    & button {
        margin-top: 20px;
        width: 400px;
        height: 40px;
        background-color: transparent;
        border: 1px solid #dbdbdb;
        border-radius: 10px;
        cursor: pointer;

        &:active {
            background-color: #eee;
        }
    }
`;

const SLikeButton = (isLike) => css`
    position: sticky;
    margin: 0px 40px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: ${isLike ? "#7bbdff" : "#fff"};
    cursor: pointer;
`;

const line = css`
    margin: 10px 20px;
    border-bottom: 2px solid #dbdbdb;
`;

function ChallengeDetails(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principal = queryClient.getQueryState("getPrincipal");
    const [ isLike, setIsLike ] = useState(false);
    const { challengeId } = useParams();
    const [ challenge, setChallenge ] = useState({});
    const [ dateDifference, setDateDifference ] = useState(null);
    const [ todayDifference, setTodayDifference ] = useState(null);
    const [ isJoined, setIsJoined ] = useState(false);

    const option = {
        headers: {
            Authorization: localStorage.getItem("accessToken")
        }
    }

    const checkUserJoinStatus = useQuery(["checkUserJoinStatus"], async () => {
        try {
            const response = await instance.get(`/api/challenge/join/${challengeId}`, option)
            setIsJoined(response.data)
            console.log(response.data);
            return response.data;
        }catch(error) {
            console.log(error);
        }
    }, {
        retry: 0,
        refetchOnWindowFocus: false
    });

    const getChallenge = useQuery(["getChallenge"], async () => {
        try {
            return await instance.get(`/api/challenge/${challengeId}`, option);
        }catch(error) {
            alert("해당 챌린지를 불러올 수 없습니다.");
            navigate("/");
        }
    }, {
        retry: 0,
        refetchOnWindowFocus: false,
        onSuccess: response => {
            setChallenge(response.data);
        }
    })

    const getLikeState = useQuery(["getLikeState"], async () => {
        try {
            return await instance.get(`/api/challenge/${challengeId}/like`, option);
        }catch(error) {
            console.erroe(error);
        }
    }, {
        refetchOnWindowFocus: false,
        retry: 0
    })

    useEffect(() => {
        const startDate = new Date(challenge.startDate);
        const endDate = new Date(challenge.endDate);
        const today = new Date();
        const timeDifference = endDate - startDate;
        const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const todayTimeDifference = today - startDate;
        const todayDifference = Math.floor(todayTimeDifference / (1000 * 60 * 60 * 24));

        setDateDifference(dayDifference);
        setTodayDifference(todayDifference)
    }, [challenge.startDate, challenge.endDate]);

    if(getChallenge.isLoading) {
        return <></>
    }

    const handleLikebuttonClick = async () => {
        console.log(principal)
        const userId = principal.data.data.userId;
        const result = {
            userId: userId
        }
        try {
            const response = await instance.get(`/api/challenge/${challengeId}/userlike`, {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                },
                params: {
                    userId: userId
                }
            });
            if (response.data) {
                await instance.delete(`/api/challenge/${challengeId}/like`, {
                    ...option,
                    data: result
                });
            } else {
                await instance.post(`/api/challenge/${challengeId}/like`, result, option);
            }
            getLikeState.refetch();
            getChallenge.refetch();
            setIsLike(!isLike);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteClick = async () => {
        if(principal.data.data.name === challenge.name){
            await instance.delete(`/api/challenge/${challengeId}`, option)
            alert("삭제완료!");
            navigate("/");
        }else {
            alert("작성자만 삭제할 수 있습니다.");
        }
        getLikeState.refetch();
        getChallenge.refetch();
    }
    
    const handleParticipationButton = () => {
        if(isJoined) {
            navigate("/challenge/feed")
        }else {
            if(challenge.isApplicable === "0"){
                const response = instance.post(`/api/challenge/join/${challengeId}`, {}, option);
                if(response) {
                    alert("요청성공!")
                }
            }else {
                const response = instance.post(`/api/challenge/join/${challengeId}`, {}, option);
                if(response) {
                    alert("승인까지 1~2일이 소요됩니다.");
                }
            }
            checkUserJoinStatus.refetch();
        }
    }

    return (
        <div css={Layout}>
            <div css={HeaderLayout}>
                <div>
                    <b>[{challenge.categoryName}]</b>
                    {dateDifference !== null && (
                        <p>{dateDifference+1}일 중 {todayDifference+1}일차</p>
                    )}
                </div>
                {queryClient.data}
                <h1>{challenge.challengeName}</h1>
                <div>
                    <div css={Box}>
                        <div css={Writer}>작성자: <b>{challenge.name}</b> </div>
                        <div>
                            {!getLikeState.isLoading &&
                                <button css={SLikeButton(getLikeState?.data?.data)} disabled={!principal?.data?.data} onClick={handleLikebuttonClick}>
                                    <div>{isLike ? <AiTwotoneLike/> : <AiOutlineLike/>}</div>
                                    <div>{challenge.challengeLikeCount}</div>
                                </button>
                            }
                        </div>
                        <button css={DeleteButton} onClick={handleDeleteClick}>삭제</button>
                    </div>
                </div>
            </div>
            <div css={line}></div>
            <div css={BodyLayout}>
                <div css={BodyLeftBox}>
                    이미지
                    <img src="" alt="" />
                </div>
                <div css={BodyRightBox}>
                    <p>기간: {challenge.startDate} ~ {challenge.endDate}</p>
                    <div dangerouslySetInnerHTML={{ __html: challenge.introduction}}></div>
                    <b>참여인원</b>
                    <button onClick={handleParticipationButton}>
                        {isJoined ? '참여 인증하기' : '챌린지 참여하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChallengeDetails;