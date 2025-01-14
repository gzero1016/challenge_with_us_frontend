import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
import { css } from '@emotion/react';
import { useQueryClient } from 'react-query';
/** @jsxImportSource @emotion/react */


const btn = css`
    display: flex;
    flex-direction: column;

    & > button{
        cursor: pointer;
        margin: 10px;
        width: 170px;
        height: 30px;
        background-color: #efefef;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    & > button:hover{
        background-color: #dbdbdb;
    }
`;


function Main(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient().getQueryState("getPrincipal");
    const principal = queryClient?.data?.data;
    const userId = principal?.userId;

    const handleLogoutButton = async () => {
        localStorage.removeItem("accessToken");
        alert("로그아웃 되었습니다.");
        window.location.replace("/main");
    };

    const checkLoginBeforeNavigate = (path) => {
        if(!principal) {
            alert("로그인을 먼저 진행해주세요");
            return;
        }
        navigate(path);
    };

    return (
        <div>
            {/* <Header /> */}
            <BaseLayout>
                <h1>임시 메인페이지(버튼이동용...)</h1>
                <p>주소 매번 입력하기...귀찮았다...미안하다...</p>
                <div css={btn}>
                    
                    {principal ? <button onClick={handleLogoutButton}>로그아웃</button>
                    : <button onClick={() => { navigate("/auth/signin") }}>로그인</button>}
                    {/* <button onClick={() => { checkLoginBeforeNavigate("/store/items") }}>상점</button> */}
                    <button onClick={() => { checkLoginBeforeNavigate("/account/mypage") }}>마이페이지</button>
                    <button onClick={() => { navigate("/notice/page/1") }}>공지목록</button>
                    <button onClick={() => { checkLoginBeforeNavigate("/challenge/category") }}>챌린지 생성 </button>
                    <button onClick={() => { navigate("/challenges") }}>챌린지리스트조회</button>
                    <button onClick={() => { checkLoginBeforeNavigate("/challenge/feed") }}>Feed</button>
                    <button onClick={() => { checkLoginBeforeNavigate("/stamp") }}>Stamp</button>
                    <button onClick={() => { navigate("/maain") }}>찐메인</button>
                </div>
            </BaseLayout>
        </div>
    );
}

export default Main;
