import React from 'react';
import { ClassProvider, useClassContext } from './context/ClassContext';
import { Header } from './components/Header';
import { StudentView } from './components/StudentView/StudentView';
import { TeacherView } from './components/TeacherView/TeacherView';

const MainContent = () => {
  const { mode } = useClassContext();

  return (
    <main className="main-container">
      {mode === 'TEACHER' ? <TeacherView /> : <StudentView />}
    </main>
  );
};

export default function App() {
  return (
    <ClassProvider>
      <Header />
      <MainContent />
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto'
      }}>
        © 2026 초등학교 6학년 드림 학급 관리 웹 앱 | 학급 경제 & 게이미피케이션
      </footer>
    </ClassProvider>
  );
}
