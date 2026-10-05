import React, { useState } from 'react';
import { useClassContext } from '../../context/ClassContext';
import {
  Coins,
  Trophy,
  CheckCircle2,
  Circle,
  ShoppingBag,
  Ticket,
  Clock,
  History,
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export const StudentView = () => {
  const {
    currentStudent,
    roles,
    shopItems,
    missions,
    coupons,
    transactions,
    getLevelInfo,
    toggleRoleTask,
    toggleMissionTask,
    buyShopItem,
    submitCouponForUse
  } = useClassContext();

  const [activeTab, setActiveTab] = useState('TASKS'); // 'TASKS', 'SHOP', 'HISTORY'
  const [shopFilter, setShopFilter] = useState('ALL'); // 'ALL', 'MY_COUPONS'

  if (!currentStudent) return null;

  const currentLevelInfo = getLevelInfo(currentStudent.exp);
  const nextLevelMinExp = currentLevelInfo.maxExp + 1;
  const currentExpInLevel = currentStudent.exp - currentLevelInfo.minExp;
  const levelExpRange = currentLevelInfo.maxExp - currentLevelInfo.minExp + 1;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentExpInLevel / levelExpRange) * 100)));

  // My Role
  const myRole = roles.find(r => r.id === currentStudent.roleId);

  // My Coupons
  const myCoupons = coupons.filter(c => c.studentId === currentStudent.id);

  // My Transactions
  const myTransactions = transactions.filter(t => t.studentId === currentStudent.id);

  const handleBuy = (itemId) => {
    const result = buyShopItem(currentStudent.id, itemId);
    alert(result.message);
  };

  return (
    <div className="student-view">
      {/* 1. Profile & Stats Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="student-avatar" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
              {currentStudent.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  {currentStudent.number}번 {currentStudent.name}
                </h2>
                <span className="chip chip-indigo">
                  <Trophy size={14} /> {currentLevelInfo.title}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                내 담당 역할: <strong style={{ color: '#818cf8' }}>{myRole ? `${myRole.icon} ${myRole.title}` : '미배정'}</strong>
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Coins size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#fde68a', fontWeight: '600' }}>보유 학급 화폐</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24', lineHeight: 1 }}>
                {currentStudent.balance.toLocaleString()} <span style={{ fontSize: '1rem' }}>미소</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXP Progress Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>
            <span><Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> EXP 성장의 길</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {currentStudent.exp} / {currentLevelInfo.maxExp > 90000 ? 'MAX' : currentLevelInfo.maxExp + 1} EXP ({progressPercent}%)
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'TASKS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TASKS')}
        >
          <CheckCircle2 size={18} />
          오늘 할 일 (미션 & 역할)
        </button>
        <button
          className={`tab-btn ${activeTab === 'SHOP' ? 'active' : ''}`}
          onClick={() => setActiveTab('SHOP')}
        >
          <ShoppingBag size={18} />
          학급 상점 & 쿠폰함 ({myCoupons.filter(c => c.status === 'ACTIVE').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'HISTORY' ? 'active' : ''}`}
          onClick={() => setActiveTab('HISTORY')}
        >
          <History size={18} />
          화폐 변동 내역
        </button>
      </div>

      {/* Tab 1: Today's Tasks */}
      {activeTab === 'TASKS' && (
        <div className="grid-2">
          {/* 1인 1역 Today Task */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#818cf8" />
              오늘의 1인 1역 역할 수행
            </h3>

            {myRole ? (
              <div
                className={`glass-card ${currentStudent.roleTaskCompletedToday ? 'gold-glow' : ''}`}
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  borderColor: currentStudent.roleTaskCompletedToday ? '#f59e0b' : 'var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '2rem' }}>{myRole.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{myRole.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{myRole.description}</p>
                    <div style={{ marginTop: '6px' }}>
                      <span className="chip chip-gold">+ {myRole.reward} 미소 & EXP</span>
                    </div>
                  </div>
                </div>

                <button
                  className={`btn ${currentStudent.roleTaskCompletedToday ? 'btn-gold' : 'btn-secondary'}`}
                  onClick={() => toggleRoleTask(currentStudent.id)}
                >
                  {currentStudent.roleTaskCompletedToday ? (
                    <>
                      <CheckCircle2 size={18} /> 수행 완료됨!
                    </>
                  ) : (
                    <>
                      <Circle size={18} /> 역할 완료 체크
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>현재 배정된 역할이 없습니다.</p>
            )}
          </div>

          {/* Today's Classroom Missions */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#34d399" />
              오늘의 학급 미션 목록
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {missions.map((m) => {
                const isCompleted = currentStudent.completedMissions?.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className="glass-card"
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderColor: isCompleted ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{m.title}</div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <span className="chip chip-emerald">+ {m.reward} 미소</span>
                          <span className="chip chip-indigo">카테고리: {m.category}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`btn btn-sm ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        background: isCompleted ? 'linear-gradient(135deg, #059669, #10b981)' : undefined
                      }}
                      onClick={() => toggleMissionTask(currentStudent.id, m.id)}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      {isCompleted ? '달성함' : '달성하기'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Shop & My Coupons */}
      {activeTab === 'SHOP' && (
        <div>
          {/* Subfilter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              className={`btn ${shopFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShopFilter('ALL')}
            >
              <ShoppingBag size={16} /> 전체 상점 상품
            </button>
            <button
              className={`btn ${shopFilter === 'MY_COUPONS' ? 'btn-gold' : 'btn-secondary'}`}
              onClick={() => setShopFilter('MY_COUPONS')}
            >
              <Ticket size={16} /> 내가 보유한 쿠폰 ({myCoupons.length})
            </button>
          </div>

          {shopFilter === 'ALL' ? (
            <div className="grid-3">
              {shopItems.map((item) => {
                const canAfford = currentStudent.balance >= item.price;
                return (
                  <div key={item.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                        <span className="chip chip-gold" style={{ fontSize: '0.9rem' }}>
                          <Coins size={14} /> {item.price.toLocaleString()} 미소
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', minHeight: '40px' }}>
                        {item.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        재고: {item.stock > 0 ? `${item.stock}개 남음` : '품절'}
                      </span>
                      <button
                        className="btn btn-gold btn-sm"
                        disabled={!canAfford || item.stock <= 0}
                        onClick={() => handleBuy(item.id)}
                        style={{
                          opacity: canAfford && item.stock > 0 ? 1 : 0.5,
                          cursor: canAfford && item.stock > 0 ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {item.stock <= 0 ? '품절' : !canAfford ? '잔액 부족' : '구매하기'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid-3">
              {myCoupons.length === 0 ? (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  <Ticket className="empty-icon" />
                  <p>아직 구매한 쿠폰이 없습니다. 상점에서 원하는 쿠폰을 구매해 보세요!</p>
                </div>
              ) : (
                myCoupons.map((coupon) => (
                  <div key={coupon.id} className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '2.2rem' }}>{coupon.icon}</span>
                      {coupon.status === 'ACTIVE' && <span className="chip chip-emerald">사용 가능</span>}
                      {coupon.status === 'PENDING' && <span className="chip chip-gold">교사 승인 대기중</span>}
                      {coupon.status === 'USED' && <span className="chip" style={{ background: '#475569', color: '#cbd5e1' }}>사용 완료</span>}
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px' }}>{coupon.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                      구매일: {coupon.purchasedAt}
                    </p>

                    {coupon.status === 'ACTIVE' && (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => submitCouponForUse(coupon.id)}
                      >
                        선생님께 사용 제출하기
                      </button>
                    )}
                    {coupon.status === 'PENDING' && (
                      <p style={{ fontSize: '0.85rem', color: '#fbbf24', textAlign: 'center', fontWeight: '600' }}>
                        선생님이 확인 후 승인해 줄 예정입니다 ⏳
                      </p>
                    )}
                    {coupon.status === 'USED' && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        사용 완료된 쿠폰입니다.
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'HISTORY' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>내 화폐 변동 거래 기록</h3>
          {myTransactions.length === 0 ? (
            <div className="empty-state">
              <History className="empty-icon" />
              <p>아직 화폐 변동 내역이 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="glass-card"
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {tx.type === 'EARN' ? (
                      <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '50%' }}>
                        <ArrowDownLeft color="#34d399" size={20} />
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '8px', borderRadius: '50%' }}>
                        <ArrowUpRight color="#fca5a5" size={20} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{tx.reason}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tx.date}</div>
                    </div>
                  </div>

                  <div style={{
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    color: tx.type === 'EARN' ? '#34d399' : '#fca5a5'
                  }}>
                    {tx.type === 'EARN' ? '+' : '-'}{tx.amount} 미소
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
