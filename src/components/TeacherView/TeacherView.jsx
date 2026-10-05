import React, { useState } from 'react';
import { useClassContext } from '../../context/ClassContext';
import {
  Users,
  PlusCircle,
  MinusCircle,
  Award,
  ShoppingBag,
  CheckCheck,
  Plus,
  Trash2,
  Sparkles,
  Coins,
  Search,
  CheckSquare,
  Square,
  ShieldCheck,
  Edit2
} from 'lucide-react';

export const TeacherView = () => {
  const {
    students,
    roles,
    shopItems,
    missions,
    coupons,
    getLevelInfo,
    rewardStudent,
    deductStudent,
    batchRewardStudents,
    batchDeductStudents,
    approveCouponUse,
    assignRoleToStudent,
    addShopItem,
    deleteShopItem,
    addMission,
    deleteMission,
    addRole,
    deleteRole
  } = useClassContext();

  const [activeTab, setActiveTab] = useState('STUDENTS'); // 'STUDENTS', 'ROLES', 'SHOP', 'MISSIONS'
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States for Pay/Deduct
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState('REWARD'); // 'REWARD' or 'DEDUCT'
  const [amountInput, setAmountInput] = useState(100);
  const [reasonInput, setReasonInput] = useState('');

  // Form States for creating new items
  const [newRole, setNewRole] = useState({ title: '', description: '', reward: 100, icon: '⭐' });
  const [newShopItem, setNewShopItem] = useState({ title: '', price: 500, stock: 10, description: '', icon: '🎁' });
  const [newMission, setNewMission] = useState({ title: '', reward: 50, category: '학습', icon: '📝' });

  // Filtered Students
  const filteredStudents = students.filter(s => s.name.includes(searchTerm) || s.number.toString().includes(searchTerm));

  // Checkbox helpers
  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const openPayModal = (type, singleStudentId = null) => {
    if (singleStudentId) {
      setSelectedStudentIds([singleStudentId]);
    } else if (selectedStudentIds.length === 0) {
      alert('화폐를 지급/차감할 학생을 먼저 선택해주세요.');
      return;
    }
    setModalActionType(type);
    setReasonInput(type === 'REWARD' ? '학급 규칙 준수 및 칭찬 포상' : '학급 규칙 위반 차감');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (amountInput <= 0) return;

    if (modalActionType === 'REWARD') {
      batchRewardStudents(selectedStudentIds, amountInput, reasonInput);
      alert(`${selectedStudentIds.length}명 학생에게 ${amountInput} 미소 & EXP 지급이 완료되었습니다!`);
    } else {
      batchDeductStudents(selectedStudentIds, amountInput, reasonInput);
      alert(`${selectedStudentIds.length}명 학생에게서 ${amountInput} 미소 차감이 완료되었습니다.`);
    }

    setIsModalOpen(false);
    setSelectedStudentIds([]);
  };

  // Pending Coupons
  const pendingCoupons = coupons.filter(c => c.status === 'PENDING');

  return (
    <div className="teacher-view">
      {/* Teacher Top Info */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(30, 41, 59, 0.8))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="#818cf8" size={26} />
              담임교사 통합 관리 대시보드
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              학급 인원 25명 | 승인 대기 쿠폰 {pendingCoupons.length}건
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-gold"
              onClick={() => openPayModal('REWARD')}
              disabled={selectedStudentIds.length === 0}
              style={{ opacity: selectedStudentIds.length > 0 ? 1 : 0.6 }}
            >
              <PlusCircle size={18} />
              선택 학생 화폐/EXP 지급 ({selectedStudentIds.length}명)
            </button>

            <button
              className="btn btn-danger"
              onClick={() => openPayModal('DEDUCT')}
              disabled={selectedStudentIds.length === 0}
              style={{ opacity: selectedStudentIds.length > 0 ? 1 : 0.6 }}
            >
              <MinusCircle size={18} />
              선택 학생 화폐 차감 ({selectedStudentIds.length}명)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'STUDENTS' ? 'active' : ''}`}
          onClick={() => setActiveTab('STUDENTS')}
        >
          <Users size={18} />
          전체 학생 25명 대시보드
        </button>
        <button
          className={`tab-btn ${activeTab === 'ROLES' ? 'active' : ''}`}
          onClick={() => setActiveTab('ROLES')}
        >
          <Award size={18} />
          1인 1역 배정 & 관리
        </button>
        <button
          className={`tab-btn ${activeTab === 'SHOP' ? 'active' : ''}`}
          onClick={() => setActiveTab('SHOP')}
        >
          <ShoppingBag size={18} />
          상점 상품 & 쿠폰 승인함 ({pendingCoupons.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'MISSIONS' ? 'active' : ''}`}
          onClick={() => setActiveTab('MISSIONS')}
        >
          <Sparkles size={18} />
          오늘의 미션 등록
        </button>
      </div>

      {/* Tab 1: Students Dashboard */}
      {activeTab === 'STUDENTS' && (
        <div>
          {/* Controls Bar */}
          <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-secondary btn-sm" onClick={toggleSelectAll}>
                {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                  <> <CheckSquare size={16} /> 전체 해제 </>
                ) : (
                  <> <Square size={16} /> 전체 선택 ({filteredStudents.length}명) </>
                )}
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                선택됨: <strong style={{ color: '#818cf8' }}>{selectedStudentIds.length}명</strong>
              </span>
            </div>

            {/* Search Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="학생 이름 또는 번호 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* Student Cards Grid */}
          <div className="grid-4">
            {filteredStudents.map((st) => {
              const levelInfo = getLevelInfo(st.exp);
              const assignedRole = roles.find(r => r.id === st.roleId);
              const isSelected = selectedStudentIds.includes(st.id);

              return (
                <div
                  key={st.id}
                  className={`glass-card student-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSelectStudent(st.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="student-avatar">
                        {st.avatar}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>
                          {st.number}번 {st.name}
                        </h4>
                        <span className="chip chip-indigo" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          {levelInfo.title.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    <div>
                      {isSelected ? <CheckSquare size={20} color="#6366f1" /> : <Square size={20} color="var(--text-dim)" />}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>화폐 잔액:</span>
                      <strong style={{ color: '#fbbf24' }}>{st.balance.toLocaleString()} 미소</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>누적 EXP:</span>
                      <span style={{ color: '#818cf8', fontWeight: '600' }}>{st.exp} EXP</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>1인 1역:</span>
                      <span style={{ color: '#34d399', fontWeight: '600' }}>
                        {assignedRole ? `${assignedRole.icon} ${assignedRole.title}` : '미배정'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action */}
                  <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-gold btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => openPayModal('REWARD', st.id)}
                    >
                      <PlusCircle size={14} /> 지급
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => openPayModal('DEDUCT', st.id)}
                    >
                      <MinusCircle size={14} /> 차감
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: 1인 1역 Management */}
      {activeTab === 'ROLES' && (
        <div className="grid-2">
          {/* Student Role Assignment List */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
              학생 25명 역할 배정 현황
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
              {students.map((st) => (
                <div key={st.id} className="glass-card" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{st.avatar}</span>
                    <span style={{ fontWeight: '600' }}>{st.number}번 {st.name}</span>
                  </div>

                  <select
                    className="form-select"
                    style={{ width: '180px', padding: '6px' }}
                    value={st.roleId || ''}
                    onChange={(e) => assignRoleToStudent(st.id, e.target.value)}
                  >
                    <option value="">-- 역할 선택 --</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.icon} {r.title} (+{r.reward}미소)
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Role Definition & Creation */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
              등록된 1인 1역 역할 목록
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {roles.map((r) => (
                <div key={r.id} className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{r.icon} {r.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.description}</div>
                    <span className="chip chip-gold" style={{ marginTop: '4px' }}>수당: +{r.reward} 미소</span>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteRole(r.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Role Form */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>새 역할 추가</h4>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="역할 이름 (예: 칠판 도우미)"
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="역할 업무 설명"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="아이콘 이모지"
                  value={newRole.icon}
                  onChange={(e) => setNewRole({ ...newRole, icon: e.target.value })}
                  style={{ width: '100px' }}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="수당 미소"
                  value={newRole.reward}
                  onChange={(e) => setNewRole({ ...newRole, reward: Number(e.target.value) })}
                />
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (newRole.title) {
                    addRole(newRole);
                    setNewRole({ title: '', description: '', reward: 100, icon: '⭐' });
                  }
                }}
              >
                <Plus size={16} /> 역할 등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shop & Coupon Approvals */}
      {activeTab === 'SHOP' && (
        <div className="grid-2">
          {/* Coupon Approval Queue */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCheck color="#fbbf24" size={22} />
              학생 쿠폰 사용 승인 요청함 ({pendingCoupons.length}건)
            </h3>

            {pendingCoupons.length === 0 ? (
              <div className="empty-state">
                <p>승인 대기 중인 쿠폰 사용 요청이 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingCoupons.map((c) => {
                  const student = students.find(s => s.id === c.studentId);
                  return (
                    <div key={c.id} className="glass-card gold-glow" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fbbf24' }}>
                          {c.icon} {c.title}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                          요청 학생: <strong>{student ? `${student.number}번 ${student.name}` : c.studentId}</strong>
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>구매일: {c.purchasedAt}</p>
                      </div>

                      <button
                        className="btn btn-gold btn-sm"
                        onClick={() => {
                          approveCouponUse(c.id);
                          alert('쿠폰 사용이 성공적으로 승인 처리되었습니다!');
                        }}
                      >
                        <CheckCheck size={16} /> 사용 완료 승인
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shop Item Management */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
              등록된 상점 상품 목록
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', maxHeight: '350px', overflowY: 'auto' }}>
              {shopItems.map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{item.icon} {item.title} ({item.price} 미소)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</div>
                    <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>재고: {item.stock}개</span>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteShopItem(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Shop Item Form */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>새 상점 상품 추가</h4>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="상품명 (예: 숙제 1회 면제권)"
                  value={newShopItem.title}
                  onChange={(e) => setNewShopItem({ ...newShopItem, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="상품 상세 설명"
                  value={newShopItem.description}
                  onChange={(e) => setNewShopItem({ ...newShopItem, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="이모지"
                  value={newShopItem.icon}
                  onChange={(e) => setNewShopItem({ ...newShopItem, icon: e.target.value })}
                  style={{ width: '80px' }}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="가격 (미소)"
                  value={newShopItem.price}
                  onChange={(e) => setNewShopItem({ ...newShopItem, price: Number(e.target.value) })}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="재고 수량"
                  value={newShopItem.stock}
                  onChange={(e) => setNewShopItem({ ...newShopItem, stock: Number(e.target.value) })}
                />
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (newShopItem.title) {
                    addShopItem(newShopItem);
                    setNewShopItem({ title: '', price: 500, stock: 10, description: '', icon: '🎁' });
                  }
                }}
              >
                <Plus size={16} /> 상품 추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Missions Management */}
      {activeTab === 'MISSIONS' && (
        <div className="glass-panel" style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
            오늘의 학급 미션 관리
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {missions.map((m) => (
              <div key={m.id} className="glass-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{m.icon} {m.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>보상: +{m.reward} 미소 & EXP | 카테고리: {m.category}</div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => deleteMission(m.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>새 학급 미션 추가</h4>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="미션 제목 (예: 아침 독서 10분 실천하기)"
                value={newMission.title}
                onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="이모지"
                value={newMission.icon}
                onChange={(e) => setNewMission({ ...newMission, icon: e.target.value })}
                style={{ width: '80px' }}
              />
              <input
                type="number"
                className="form-input"
                placeholder="보상 미소/EXP"
                value={newMission.reward}
                onChange={(e) => setNewMission({ ...newMission, reward: Number(e.target.value) })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="카테고리 (예: 인성)"
                value={newMission.category}
                onChange={(e) => setNewMission({ ...newMission, category: e.target.value })}
              />
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (newMission.title) {
                  addMission(newMission);
                  setNewMission({ title: '', reward: 50, category: '학습', icon: '📝' });
                }
              }}
            >
              <Plus size={16} /> 미션 등록하기
            </button>
          </div>
        </div>
      )}

      {/* Pay/Deduct Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {modalActionType === 'REWARD' ? '🪙 학급 화폐 & EXP 일괄 지급' : '💸 학급 화폐 차감'}
              </h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                선택된 학생: <strong>{selectedStudentIds.length}명</strong>
              </p>

              <div className="form-group">
                <label className="form-label">금액 (미소 단위)</label>
                <input
                  type="number"
                  className="form-input"
                  value={amountInput}
                  onChange={(e) => setAmountInput(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">사유 / 사유 입력</label>
                <input
                  type="text"
                  className="form-input"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="예: 칭찬 포상금, 규칙 준수 등"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  취소
                </button>
                <button
                  type="submit"
                  className={`btn ${modalActionType === 'REWARD' ? 'btn-gold' : 'btn-danger'}`}
                >
                  {modalActionType === 'REWARD' ? '지급 실행' : '차감 실행'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
