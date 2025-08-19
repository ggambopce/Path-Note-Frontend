import { Link } from "react-router"
import axios from "axios";

const API_DOMAIN = 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_DOMAIN,
  withCredentials: true,  // httpoOnly 쿠키사용
});

//      component: 헤더 컴포넌트         //
export default function Header() {

  //          component: 카카오 로그인 버튼 컴포넌트          //
  const KakaoLoginButton = () => {
    const onSocialLoginButtonClickHandler = () => {
      window.location.href = `${API_DOMAIN}/oauth2/authorization/kakao`;
    };
    //          render: 카카오 로그인 버튼 컴포넌트 렌더링          //
    return (
      <button onClick={onSocialLoginButtonClickHandler}>
        카카오 로그인
      </button>
    );
  };



  //          render: 헤더 컴포넌트 렌더링          //
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
        <div className="flex gap-4">
          <Link to="/" >Home</Link>
          <Link to="/courseboard">CourseBoard</Link>
        </div>
        <KakaoLoginButton />
      </nav>
    </header>
  )
}