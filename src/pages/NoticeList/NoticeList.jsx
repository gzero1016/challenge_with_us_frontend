import React, { useState } from 'react';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
import { css } from '@emotion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { useParams } from 'react-router-dom/dist/umd/react-router-dom.development';
/** @jsxImportSource @emotion/react */
import * as S from './NoticeListStyle';

function NoticeList(props) {
    const navigate = useNavigate();
    const queyrClient = useQueryClient();
    const principalState = queyrClient.getQueryState("getPrincipal");
    const principal = principalState?.data?.data;
    const { page } = useParams();
    const option = {
        headers: {
        Authorization: localStorage.getItem("accessToken")
        }
    }

    const getNoticeList = useQuery(["getNoticeList", page], async () => {
        return await instance.get(`/api/notices/${page}?pageSize=13`)
    }, {
        retry: 0,
        refetchOnWindowFocus: false
    });

    const getNoticesCount = useQuery(["getNoticesCount"], async () => {
        return await instance.get(`/api/notices/count`)
    }, {
        retry: 0,
        refetchOnWindowFocus: false
    });

    const getAdminList = useQuery(["getAdminList"], async () => {
        return await instance.get(`/api/admin`, option)
    }, {
        retry: 0,
        refetchOnWindowFocus: false,
        enabled: !!principal
    });

    const pagination = () => {
        if(getNoticesCount.isLoading) {
            return <></>;
        }

        const totalNoticeCount = getNoticesCount?.data?.data;
        const lastPage = totalNoticeCount % 13 === 0
            ? totalNoticeCount / 13
            : Math.floor(totalNoticeCount / 13) + 1;
        const startIndex = parseInt(page) % 5 === 0 ? parseInt(page) - 4 : parseInt(page) - (parseInt(page) % 5) + 1;
        const endIndex = startIndex + 4 <= lastPage ? startIndex + 4 : lastPage;
        const pageNumbers = [];
        for(let i = startIndex; i <= endIndex; i++) {
            pageNumbers.push(i);
        }

        return (
            <>
                <button disabled={parseInt(page) === 1} onClick={() => {
                    navigate(`/notice/page/${parseInt(page) - 1}`);
                }}>&#60;</button>
                {pageNumbers.map(page => {
                    return <button key={page} onClick={() => {
                        return navigate(`/notice/page/${page}`);
                    }}>{page}</button>
                })}
                <button disabled={parseInt(page) === lastPage} onClick={() => {
                    navigate(`/notice/page/${parseInt(page) + 1}`);
                }}>&#62;</button> 
            </>
        )
    };

    const isAdmins = getAdminList?.data?.data?.some(admin => admin?.userId === principal?.userId);

    return (
        <BaseLayout>
                <div css={S.Header}>
                    <b>공지를 확인해주세요 !</b>
                    {isAdmins && (
                        <div css={S.btnBox}>
                            <button onClick={() => { navigate(`/notice/write`) }}>공지 작성</button>
                        </div>
                    )}
                </div>
                <div css={S.TableBox}>
                    <table css={S.listTable}>
                        <thead>
                            <tr css={S.TitleBox}>
                                {/* <th>번호</th> */}
                                <th css={S.noticeTitle}>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {!getNoticeList.isLoading && getNoticeList?.data?.data?.map(notice => {
                                return (
                                    <tr key={notice.noticeId} onClick={() => { navigate(`/notice/${notice.noticeId}`) }}>
                                        {/* <td>{notice.noticeId}</td> */}
                                        <td css={S.noticeTitle}>{notice.noticeTitle}</td>
                                        <td>{notice.nickname}</td>
                                        <td>{notice.noticeDate}</td>
                                    </tr>
                                );
                            })}
                            
                        </tbody>
                    </table>
                </div>
                <ul css={S.SPageNumbers}>
                    {pagination()}
                </ul>
        </BaseLayout>
    );
}

export default NoticeList;