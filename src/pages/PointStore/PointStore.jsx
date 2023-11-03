import React, { useEffect } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { instance } from '../../api/config/instanse';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';

const SStoreContainer = css`
    display: flex;
    justify-content: space-between;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px 20px;
`;

const SProductContainer = css`
    position: relative;
    margin: 10px;
    width: 30%;
    height: 120px;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    
    & p {
        position: absolute;
        right: 10px;
        bottom: -5px;
        font-size: 12px;
        font-weight: 500;
    }
`;

function PointStore(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    useEffect(() => {
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(iamport);
        };
    }, [])
    
    const productData = [
        { name: "1000 Point", price: 10000, points: 1500 },
        { name: "2000 Point", price: 20000, points: 2500 },
        { name: "3000 Point", price: 30000, points: 4000 },
    ];

    const handlePaymentSubmit = (product) => {
        const principal = queryClient.getQueryState("getPrincipal");
        if (!window.IMP) {
            return;
        }
        const { IMP } = window;
        IMP.init("imp55744845");

        const paymentData = {
            pg: "kakaopay",
            pay_method: "kakaopay",
            merchant_uid: `mid_${new Date().getTime()}`,
            amount: product.price,
            name: product.name,
            buyer_name: principal?.data?.data?.name,
            buyer_email: principal?.data?.data?.email,
        };
        
        IMP.request_pay(paymentData, (response) => {
            const { success, error_msg } = response;
            if (success) {
                const orderData = {
                    point: product.points,
                    userId: 1
                };
                const option = {
                    headers: {
                        Authorization: localStorage.getItem("accessToken"),
                    },
                };
                instance.post("/api/point", orderData).then((response) => {
                    alert(`포인트 충전이 완료되었습니다. +${product.points} Point 지급됨`);
                    queryClient.refetchQueries(["getProducts"]);
                    navigate("/account/mypage");
                });
            } else {
                alert(error_msg);
            }
        });
    }


    return (
        <div>
            <h1>포인트 충전하기</h1>
            <div css={SStoreContainer}>
                {productData.map((product) => (
                    <button
                        key={product.name}
                        css={SProductContainer}
                        onClick={() => handlePaymentSubmit(product)}>
                        {product.name}
                        <p>충전 시 +{product.points} 추가지급!</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
    

export default PointStore;