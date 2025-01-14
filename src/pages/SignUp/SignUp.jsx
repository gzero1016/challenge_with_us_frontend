import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { instance } from '../../api/config/instance';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
/** @jsxImportSource @emotion/react */
import * as S from './Style';
import { showAlert } from '../../styles/common';

function SignUp(props) {
    const navigate = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isEmailChecked, setIsEmailChecked ] = useState(true);
    const user = {
        email: "",
        password: "",
        name: "",
        nickname: "",
        phone:"",
        oauth2Id: searchParams.get("oauth2Id"),
        profileUrl: searchParams.get("picture")
    };

    const [ signupUser, setSignupUser ] = useState(user);

    const handleSignupSubmit = async () => {
        try {
            const response = await instance.post("/api/auth/sign-up", signupUser);
    
            if (response.data === true) {
                showAlert("회원가입 완료", "success").then(() => {
                    navigate("/auth/signin");
                });
            } else {
                showAlert("회원가입 실패", "error");
            }
        } catch (error) {
            showAlert(error.message || "회원가입 실패", "warning");
        }
    };

    const handleInputChange = (e) => {
        setSignupUser({
            ...signupUser,
            [e.target.name]: e.target.value
        });
    }
    
    const handleCheckEmailDuplicate = async () => {
        try {
            const response = await instance.get(`/api/auth/duplicate/${signupUser.email}`);
            if (response.data === true) {
                showAlert("이미 존재하는 이메일 입니다.", "error");
                setIsEmailChecked(true);
                return;
            }
            showAlert("사용 가능한 이메일 입니다.", "success");
            setIsEmailChecked(false);
        } catch (error) {
            console.error(error);
            showAlert("확인 실패", "error");
        }
    }

    return (
        <BaseLayout>
            <div css={S.Layout}>
                <h1>회원가입</h1>
                <div css={S.inputBox}>
                    <label>이메일</label>
                    <input type="email" name='email' placeholder='이메일을 입력하세요' value={signupUser?.email} onChange={handleInputChange}/>
                </div>
                <button onClick={handleCheckEmailDuplicate}>중복 확인</button>
                <div css={S.inputBox}>
                    <label>비밀번호</label>
                    <input type="password" name='password'  placeholder='비밀번호를 입력하세요' onChange={handleInputChange}/>
                </div>
                <div css={S.inputBox}>
                    <label>이름</label>
                    <input type="text" name='name' placeholder='이름을 입력하세요' value={signupUser?.name} onChange={handleInputChange} />
                </div>
                <div css={S.inputBox}>
                    <label>닉네임</label>
                    <input type="text" name='nickname'  placeholder='닉네임을 입력하세요' onChange={handleInputChange}/>
                </div>
                <div css={S.inputBox}>
                    <label>전화번호</label>
                    <input type="text" name='phone'  placeholder='전화번호를 입력하세요' onChange={handleInputChange}/>
                </div>
                <div>
                    <button css={S.btn(isEmailChecked)} onClick={handleSignupSubmit} disabled={isEmailChecked} >회원가입</button> 
                </div>
            </div>
        </BaseLayout>
    );
}

export default SignUp;