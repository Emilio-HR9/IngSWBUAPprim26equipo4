import AsyncStorage from '@react-native-async-storage/async-storage';

const PAUSED_SESSION_KEY = 'paused_exercise_session';
const PAUSE_LIMIT_MS = 60 * 60 * 1000; // 60 minutos

export async function savePausedSession(sessionState) {
  try {
    const payload = {
      ...sessionState,
      status: 'paused',
      pausedAt: Date.now(),
    };

    await AsyncStorage.setItem(PAUSED_SESSION_KEY, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error('Error guardando sesión pausada:', error);
    throw error;
  }
}

export async function getPausedSession() {
  try {
    const raw = await AsyncStorage.getItem(PAUSED_SESSION_KEY);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch (error) {
    console.error('Error leyendo sesión pausada:', error);
    await AsyncStorage.removeItem(PAUSED_SESSION_KEY);
    return null;
  }
}

export async function clearPausedSession() {
  try {
    await AsyncStorage.removeItem(PAUSED_SESSION_KEY);
  } catch (error) {
    console.error('Error limpiando sesión pausada:', error);
  }
}

export function isPauseExpired(pausedAt) {
  if (!pausedAt) return true;
  return Date.now() - pausedAt > PAUSE_LIMIT_MS;
}

export function getRemainingPauseTime(pausedAt) {
  if (!pausedAt) return 0;
  const elapsed = Date.now() - pausedAt;
  return Math.max(0, PAUSE_LIMIT_MS - elapsed);
}

export async function getResumeStatus() {
  const session = await getPausedSession();

  if (!session) {
    return { canResume: false, reason: 'NO_PAUSED_SESSION' };
  }

  if (isPauseExpired(session.pausedAt)) {
    await clearPausedSession();
    return { canResume: false, reason: 'SESSION_EXPIRED' };
  }

  return {
    canResume: true,
    reason: null,
    session,
  };
}
