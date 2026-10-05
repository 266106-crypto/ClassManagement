import React from 'react';
import { useClassContext } from '../context/ClassContext';
import { Shield, User, RefreshCw, Sparkles, Coins } from 'lucide-react';

export const Header = () => {
  const {
    students,
    mode,
    setMode,
    selectedStudentId,
    setSelectedStudentId,
    currentStudent,
    resetData
  } = useClassContext();

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="app-brand">
          <div className="brand-icon">
            <Coins color="#ffffff" size={24} />
          </div>
          <div className="brand-text">
            <h1>6학년 드림 학급 관리</h1>
            <p>학급 경제 & 게이미피케이션 시스템</p>
          </div>
        </div>

        {/* Actions & Mode Switcher */}
        <div className="header-actions">
          {/* Mode Switcher */}
          <div className="mode-switcher">
            <button
              className={`mode-btn ${mode === 'TEACHER' ? 'active teacher' : ''}`}
              onClick={() => setMode('TEACHER')}
            >
              <Shield size={16} />
              교사 모드
            </button>
            <button
              className={`mode-btn ${mode === 'STUDENT' ? 'active student' : ''}`}
              onClick={() => setMode('STUDENT')}
            >
              <User size={16} />
              학생 모드
            </button>
          </div>

          {/* Student Picker when in Student Mode */}
          {mode === 'STUDENT' && (
            <div className="student-select-box">
              <label htmlFor="student-picker">내 정보:</label>
              <select
                id="student-picker"
                className="student-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.number}번 {st.name} ({st.avatar})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Data Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={resetData}
            title="샘플 데이터 리셋"
          >
            <RefreshCw size={14} />
            데이터 리셋
          </button>
        </div>
      </div>
    </header>
  );
};
