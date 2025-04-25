
import { useState, useEffect } from 'react';

interface UseOfflineStorageProps<T> {
  key: string;
  initialData?: T;
  syncFunction?: (data: T) => Promise<void>;
}

export function useOfflineStorage<T>({ 
  key, 
  initialData, 
  syncFunction 
}: UseOfflineStorageProps<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Setup online/offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      // Check if there's pendingSync data
      const syncNeeded = localStorage.getItem(`${key}_needs_sync`);
      if (syncNeeded === 'true' && syncFunction) {
        setPendingSync(true);
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [key, syncFunction]);

  // Handle sync when coming back online
  useEffect(() => {
    const syncData = async () => {
      if (isOnline && pendingSync && syncFunction && data) {
        setIsSyncing(true);
        try {
          await syncFunction(data);
          localStorage.removeItem(`${key}_needs_sync`);
          setPendingSync(false);
        } catch (error) {
          console.error('Error syncing data:', error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncData();
  }, [isOnline, pendingSync, syncFunction, data, key]);

  // Update function that saves to localStorage and marks for sync
  const updateData = (newData: T) => {
    setData(newData);
    localStorage.setItem(key, JSON.stringify(newData));
    
    // If offline, mark for future sync
    if (!isOnline && syncFunction) {
      localStorage.setItem(`${key}_needs_sync`, 'true');
      setPendingSync(true);
    } else if (isOnline && syncFunction) {
      // If online, sync immediately
      (async () => {
        setIsSyncing(true);
        try {
          await syncFunction(newData);
        } catch (error) {
          console.error('Error syncing data:', error);
          localStorage.setItem(`${key}_needs_sync`, 'true');
          setPendingSync(true);
        } finally {
          setIsSyncing(false);
        }
      })();
    }
  };

  return {
    data,
    updateData,
    loading,
    isOnline,
    isSyncing,
    pendingSync
  };
}
