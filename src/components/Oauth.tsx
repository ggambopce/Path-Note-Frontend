/**
 * 백엔드가 http://localhost:3000/oauth/{token}/{expirationTime} 같은 경로로 리다이렉트
 * JWT토큰 쿠키 저장
 * 현재 로그인한 사용자 정보 요청
 * zustand store 갱신
 * 성공시 메인페이지로 이동
 */
import { useNavigate, useParams } from "react-router";
import useLoginUserStore from "../stores/LoginUserStore";
import { useCookies } from 'react-cookie'
import { useEffect } from "react";
import { getSignInUserRequest } from "../apis";
import userMock from "../mocks/user-mock";

//          component: 소셜 로그인 인증 성공 리다이렉트 컴포넌트          //
export default function Oauth() {

    const { token, expirationTime} = useParams();
    // 쿠키 세터
    const [, setCookie] = useCookies(['accessToken']);

    const navigate = useNavigate();
    const { setLoginUser, resetLoginUser } = useLoginUserStore();

    useEffect(() => {
        if (!token || !expirationTime) return;

        const now = (new Date().getTime());
        const expires = new Date(now + 1000 * 60 * 60 * 24);

        setCookie('accessToken', token, {
        expires, 
        path: "/",
        sameSite: 'lax',
        });

        const USE_MOCK = true; // 개발 단계에서만 true

        if (USE_MOCK) {
        // 서버 안 붙이고도 로그인 흐름 확인 가능
        setLoginUser(userMock);
        navigate('/');
        return;
        }

        getSignInUserRequest(token)
        .then(response => {
            const { user_id, email, nickname} = response;
            setLoginUser({ user_id, email, nickname});
            navigate('/');
        })
        .catch(() => {
            // 실패 시 fallback 처리
            resetLoginUser();
            navigate('/');
        });

    }, [token]);

    //          render: 소셜 로그인 인증 성공 리다이렉트 컴포넌트 렌더링          //
    return (
    <> </>
  );
}