import React, { useState } from 'react';
import Challengedefault from '../../components/ChallengeLayout/ChallengeDefault';
import ChallengeTimeLayout from '../../components/ChallengeLayout/ChallengeTimeLayout';
import BaseLayout from '../../components/BaseLayout/BaseLayout';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import * as S from './Style';
import { useNavigate, useParams } from 'react-router-dom/dist/umd/react-router-dom.development';
import { instance } from '../../api/config/instance';
import { useQuery } from 'react-query';

function Certification(props) {
    const { challengeId } = useParams();
    const [selectedComponent, setSelectedComponent] = useState(<Challengedefault />);
    const [challenge, setChallenge] = useState({});
    const navigate = useNavigate();
    const option = {
        headers: {
            Authorization: localStorage.getItem("accessToken")
        }
    }

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
    });    
    
    const handleComponentChange = (e) => {
        const value = e.target.value;
        if (value === 'Timelayout') {
            setSelectedComponent(<ChallengeTimeLayout />);
        } else {
            setSelectedComponent(<Challengedefault />);
        }
    }

    
    if(getChallenge.isLoading) {
        return <></>
    }

    return (
        
        <BaseLayout>
            
            <div css={S.Header}>
                <b css={S.Title}>
                    [{challenge.categoryName}]
                {challenge ? (
                    <b>{challenge.challengeName}</b>
                ) : (
                    <b>Loading...</b>
                )}
                </b>
                <label>
                    Select Layout
                    <select onChange={handleComponentChange}>
                        <option value="Default">Default</option>
                        <option value="Timelayout">Timelayout</option>
                    </select>
                </label>
            </div>

            <div css={S.ChallengeArea}>
                {selectedComponent}
            </div>
        </BaseLayout>
    );
}

export default Certification;
