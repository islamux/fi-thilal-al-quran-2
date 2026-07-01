import { useState } from 'react';
import { localStorageBackend } from '../utils/localStorage';

const DEVICE_ID_KEY = 'thilal_device_id';

function generateId(): string {
  return crypto.randomUUID();
}

export function useDeviceId(): string {
  const [deviceId] = useState<string>(() => {
    const existing = localStorageBackend.get<string>(DEVICE_ID_KEY);
    if (existing) return existing;
    const id = generateId();
    localStorageBackend.set(DEVICE_ID_KEY, id);
    return id;
  });
  return deviceId;
}

export function getDeviceId(): string {
  const existing = localStorageBackend.get<string>(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = generateId();
  localStorageBackend.set(DEVICE_ID_KEY, id);
  return id;
}
