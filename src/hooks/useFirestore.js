import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestore(user) {
  const [goals, setGoalsState] = useState([]);
  const [checklist, setChecklistState] = useState(null);
  const [history, setHistoryState] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) {
      setGoalsState([]);
      setChecklistState(null);
      setHistoryState([]);
      setLoadingData(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.goals) setGoalsState(data.goals);
        if (data.checklist) setChecklistState(data.checklist);
        else setChecklistState({ date: null, tasks: [] });
        if (data.history) setHistoryState(data.history);
      } else {
        // Initialize empty document for new user
        setDoc(userDocRef, {
          goals: [],
          checklist: { date: null, tasks: [] },
          history: []
        });
        setChecklistState({ date: null, tasks: [] });
      }
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Wrapper functions to update Firestore immediately instead of just local state
  const setGoals = (newGoals) => {
    if (!user) return;
    const valueToStore = newGoals instanceof Function ? newGoals(goals) : newGoals;
    setGoalsState(valueToStore);
    setDoc(doc(db, 'users', user.uid), { goals: valueToStore }, { merge: true });
  };

  const setChecklist = (newChecklist) => {
    if (!user) return;
    const valueToStore = newChecklist instanceof Function ? newChecklist(checklist) : newChecklist;
    setChecklistState(valueToStore);
    setDoc(doc(db, 'users', user.uid), { checklist: valueToStore }, { merge: true });
  };

  const setHistory = (newHistory) => {
    if (!user) return;
    const valueToStore = newHistory instanceof Function ? newHistory(history) : newHistory;
    setHistoryState(valueToStore);
    setDoc(doc(db, 'users', user.uid), { history: valueToStore }, { merge: true });
  };

  return {
    goals, setGoals,
    checklist, setChecklist,
    history, setHistory,
    loadingData
  };
}
