import { useEffect, useRef, useState, useCallback } from 'react';

export const useAutoSave = <T>(
  data: T,
  onSave: (data: T) => void,
  delay: number = 10000
) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const save = useCallback(() => {
    setIsSaving(true);
    onSave(dataRef.current);
    setLastSaved(new Date());
    setIsSaving(false);
  }, [onSave]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(save, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, save, delay]);

  return { lastSaved, isSaving, saveNow: save };
};
