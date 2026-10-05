import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_STUDENTS,
  INITIAL_ROLES,
  INITIAL_SHOP_ITEMS,
  INITIAL_MISSIONS,
  INITIAL_COUPONS,
  INITIAL_TRANSACTIONS,
  LEVEL_CONFIG
} from '../data/initialData';

const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  // LocalStorage Helper
  const getStoredData = (key, initialValue) => {
    try {
      const stored = localStorage.getItem(`dream_class_${key}`);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage`, e);
      return initialValue;
    }
  };

  const [students, setStudents] = useState(() => getStoredData('students', INITIAL_STUDENTS));
  const [roles, setRoles] = useState(() => getStoredData('roles', INITIAL_ROLES));
  const [shopItems, setShopItems] = useState(() => getStoredData('shopItems', INITIAL_SHOP_ITEMS));
  const [missions, setMissions] = useState(() => getStoredData('missions', INITIAL_MISSIONS));
  const [coupons, setCoupons] = useState(() => getStoredData('coupons', INITIAL_COUPONS));
  const [transactions, setTransactions] = useState(() => getStoredData('transactions', INITIAL_TRANSACTIONS));

  // Mode and Current User State
  const [mode, setMode] = useState('STUDENT'); // 'TEACHER' or 'STUDENT'
  const [selectedStudentId, setSelectedStudentId] = useState('student-1');

  // Save to LocalStorage
  useEffect(() => { localStorage.setItem('dream_class_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('dream_class_roles', JSON.stringify(roles)); }, [roles]);
  useEffect(() => { localStorage.setItem('dream_class_shopItems', JSON.stringify(shopItems)); }, [shopItems]);
  useEffect(() => { localStorage.setItem('dream_class_missions', JSON.stringify(missions)); }, [missions]);
  useEffect(() => { localStorage.setItem('dream_class_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('dream_class_transactions', JSON.stringify(transactions)); }, [transactions]);

  // Level Calculator helper
  const getLevelInfo = (exp) => {
    for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
      if (exp >= LEVEL_CONFIG[i].minExp) {
        return LEVEL_CONFIG[i];
      }
    }
    return LEVEL_CONFIG[0];
  };

  // Trigger Confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti failed', err);
    }
  };

  // 1. Reward Money & EXP (Single)
  const rewardStudent = (studentId, amount, reason) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setStudents(prev => prev.map(st => {
      if (st.id === studentId) {
        const newBalance = st.balance + numAmount;
        const newExp = st.exp + numAmount;
        const oldLevel = st.level;
        const newLevelInfo = getLevelInfo(newExp);
        
        if (newLevelInfo.level > oldLevel) {
          triggerConfetti();
        }

        return {
          ...st,
          balance: newBalance,
          exp: newExp,
          level: newLevelInfo.level
        };
      }
      return st;
    }));

    // Record Transaction
    const newTx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId,
      type: 'EARN',
      amount: numAmount,
      reason: reason || '화폐 & EXP 포상 지급',
      date: new Date().toLocaleString('ko-KR')
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // 2. Deduct Money (Single)
  const deductStudent = (studentId, amount, reason) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setStudents(prev => prev.map(st => {
      if (st.id === studentId) {
        return {
          ...st,
          balance: Math.max(0, st.balance - numAmount)
        };
      }
      return st;
    }));

    const newTx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId,
      type: 'SPEND',
      amount: numAmount,
      reason: reason || '화폐 차감',
      date: new Date().toLocaleString('ko-KR')
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // 3. Batch Reward / Deduct
  const batchRewardStudents = (studentIds, amount, reason) => {
    studentIds.forEach(id => rewardStudent(id, amount, reason));
  };

  const batchDeductStudents = (studentIds, amount, reason) => {
    studentIds.forEach(id => deductStudent(id, amount, reason));
  };

  // 4. Toggle 1인 1역 Task Completion Today
  const toggleRoleTask = (studentId) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    const assignedRole = roles.find(r => r.id === targetStudent.roleId);
    const reward = assignedRole ? assignedRole.reward : 100;
    const isCompletedNow = !targetStudent.roleTaskCompletedToday;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, roleTaskCompletedToday: isCompletedNow };
      }
      return s;
    }));

    if (isCompletedNow) {
      rewardStudent(studentId, reward, `[1인 1역] ${assignedRole ? assignedRole.title : '역할'} 업무 완수 수당`);
      triggerConfetti();
    }
  };

  // 5. Toggle Today's Mission Task
  const toggleMissionTask = (studentId, missionId) => {
    const targetStudent = students.find(s => s.id === studentId);
    const mission = missions.find(m => m.id === missionId);
    if (!targetStudent || !mission) return;

    const isAlreadyDone = targetStudent.completedMissions?.includes(missionId);

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedMissions = isAlreadyDone
          ? s.completedMissions.filter(mId => mId !== missionId)
          : [...(s.completedMissions || []), missionId];
        return { ...s, completedMissions: updatedMissions };
      }
      return s;
    }));

    if (!isAlreadyDone) {
      rewardStudent(studentId, mission.reward, `[오늘의 미션] ${mission.title} 완수`);
      triggerConfetti();
    }
  };

  // 6. Buy Shop Item
  const buyShopItem = (studentId, itemId) => {
    const student = students.find(s => s.id === studentId);
    const item = shopItems.find(i => i.id === itemId);

    if (!student || !item) return { success: false, message: '상품 정보를 찾을 수 없습니다.' };
    if (student.balance < item.price) return { success: false, message: '잔액이 부족합니다.' };
    if (item.stock <= 0) return { success: false, message: '상품 재고가 소진되었습니다.' };

    // Deduct Balance
    deductStudent(studentId, item.price, `[상점] ${item.title} 구매`);

    // Decrease Stock
    setShopItems(prev => prev.map(i => i.id === itemId ? { ...i, stock: i.stock - 1 } : i));

    // Create Coupon
    const newCoupon = {
      id: `coupon-${Date.now()}`,
      studentId,
      itemId,
      title: item.title,
      price: item.price,
      icon: item.icon,
      purchasedAt: new Date().toLocaleDateString('ko-KR'),
      status: 'ACTIVE' // 'ACTIVE', 'PENDING', 'USED'
    };
    setCoupons(prev => [newCoupon, ...prev]);
    triggerConfetti();

    return { success: true, message: `${item.title} 구매가 완료되었습니다!` };
  };

  // 7. Coupon Usage
  const submitCouponForUse = (couponId) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, status: 'PENDING' } : c));
  };

  const approveCouponUse = (couponId) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, status: 'USED' } : c));
    triggerConfetti();
  };

  // 8. Management Actions (Role, Shop, Mission)
  const assignRoleToStudent = (studentId, roleId) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, roleId } : s));
  };

  const addShopItem = (item) => {
    const newItem = { ...item, id: `item-${Date.now()}` };
    setShopItems(prev => [...prev, newItem]);
  };

  const deleteShopItem = (itemId) => {
    setShopItems(prev => prev.filter(i => i.id !== itemId));
  };

  const addMission = (mission) => {
    const newMission = { ...mission, id: `mission-${Date.now()}` };
    setMissions(prev => [...prev, newMission]);
  };

  const deleteMission = (missionId) => {
    setMissions(prev => prev.filter(m => m.id !== missionId));
  };

  const addRole = (role) => {
    const newRole = { ...role, id: `role-${Date.now()}` };
    setRoles(prev => [...prev, newRole]);
  };

  const deleteRole = (roleId) => {
    setRoles(prev => prev.filter(r => r.id !== roleId));
  };

  // Reset All Sample Data
  const resetData = () => {
    if (window.confirm('모든 학급 데이터를 초기 샘플 상태로 리셋하시겠습니까?')) {
      setStudents(INITIAL_STUDENTS);
      setRoles(INITIAL_ROLES);
      setShopItems(INITIAL_SHOP_ITEMS);
      setMissions(INITIAL_MISSIONS);
      setCoupons(INITIAL_COUPONS);
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.clear();
      alert('초기화가 완료되었습니다.');
    }
  };

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <ClassContext.Provider value={{
      students,
      roles,
      shopItems,
      missions,
      coupons,
      transactions,
      mode,
      setMode,
      selectedStudentId,
      setSelectedStudentId,
      currentStudent,
      getLevelInfo,
      rewardStudent,
      deductStudent,
      batchRewardStudents,
      batchDeductStudents,
      toggleRoleTask,
      toggleMissionTask,
      buyShopItem,
      submitCouponForUse,
      approveCouponUse,
      assignRoleToStudent,
      addShopItem,
      deleteShopItem,
      addMission,
      deleteMission,
      addRole,
      deleteRole,
      resetData
    }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClassContext = () => useContext(ClassContext);
