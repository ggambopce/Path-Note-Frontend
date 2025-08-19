import { Link } from "react-router-dom";
import { useNavigate } from "react-router"
import axios from "axios";
import useLoginUserStore from "../stores/LoginUserStore";
import { useCookies } from "react-cookie";
import { SNS_SIGN_IN_URL } from "../apis";


const API_DOMAIN = 'http://localhost:8080'
const API_BASE = `${API_DOMAIN}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  // httpOnly 쿠키사용
});

//      component: 헤더 컴포넌트         //
export default function Header() {

  //          state: 로그인 사용자 정보           //
  const { loginUser, resetLoginUser } = useLoginUserStore();
  //          state: cookie 상태          //
  const [, setCookie] = useCookies();


  //          function: 네비게이트 함수           //
  const navigate = useNavigate();

// 카카오 로그인
  const onSocialLogin = () => {
    window.location.href = SNS_SIGN_IN_URL();
  };

  // 로그아웃
  const onLogout = async () => {
  try {
    await api.get('/users/logout');
  } catch {
    // 실패해도 무시
  } finally {
    resetLoginUser();
    // JS 쿠키 전략이면 필요 시 쿠키 제거
    // setCookie('accessToken', '', { path: '/', expires: new Date(0) });
  }
};
    //          render: 카카오 로그인 버튼 컴포넌트 렌더링          //
    return (
      <header className="border-b bg-white">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
        <div className="flex gap-4">
          <Link to="/">Path Note</Link>
          <Link to="/courseboard">CourseBoard</Link>
        </div>

        {/* 로그인 여부로 토글 */}
        {loginUser ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">안녕, {loginUser.nickname}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-md text-sm border shadow-sm hover:bg-gray-50 active:bg-gray-100"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={onSocialLogin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#FEE500] text-black shadow-sm hover:brightness-95 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            카카오 로그인
          </button>
        )}
      </nav>
    </header>
  );
}