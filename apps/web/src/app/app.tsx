// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 테일윈드 테스트 섹션 */}
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl font-bold">테일윈드 테스트</h1>
        <p className="text-sm mt-2">
          이 텍스트가 흰색으로 보이면 테일윈드가 작동합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-500 p-4 rounded-md text-white font-bold text-center">
          빨간색 박스
        </div>
        <div className="bg-green-500 p-4 rounded-md text-white font-bold text-center">
          초록색 박스
        </div>
        <div className="bg-yellow-500 p-4 rounded-md text-black font-bold text-center">
          노란색 박스
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-200 p-4 rounded-lg">
        <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded mr-2">
          공유 테마 버튼 (primary 색상)
        </button>
        <button className="bg-secondary text-white font-bold py-2 px-4 rounded">
          공유 테마 버튼 (secondary 색상)
        </button>
      </div>

      <hr className="my-6 border-t border-gray-300" />

      <NxWelcome title="@vpp/web" />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <div role="navigation" className="mt-4">
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/page-2"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Page 2
            </Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
