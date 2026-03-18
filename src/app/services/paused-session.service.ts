import { Injectable } from '@angular/core';

const PAUSED_SESSION_KEY = 'paused_exercise_session';
const PAUSE_LIMIT_MS = 60 * 60 * 1000; // 60 minutos

export interface PausedSession {
  status?: 'paused';
  pausedAt?: number;
  [key: string]: any;
}

export interface ResumeStatus {
  canResume: boolean;
  reason: 'NO_PAUSED_SESSION' | 'SESSION_EXPIRED' | null;
  session?: PausedSession;
}

@Injectable({
  providedIn: 'root',
})
export class PausedSessionService {
  savePausedSession(sessionState: PausedSession): PausedSession {
    try {
      const payload: PausedSession = {
        ...sessionState,
        status: 'paused',
        pausedAt: Date.now(),
      };

      localStorage.setItem(PAUSED_SESSION_KEY, JSON.stringify(payload));
      return payload;
    } catch (error) {
      console.error('Error guardando sesión pausada:', error);
      throw error;
    }
  }

  getPausedSession(): PausedSession | null {
    try {
      const raw = localStorage.getItem(PAUSED_SESSION_KEY);

      if (!raw) return null;

      return JSON.parse(raw);
    } catch (error) {
      console.error('Error leyendo sesión pausada:', error);
      localStorage.removeItem(PAUSED_SESSION_KEY);
      return null;
    }
  }

  clearPausedSession(): void {
    try {
      localStorage.removeItem(PAUSED_SESSION_KEY);
    } catch (error) {
      console.error('Error limpiando sesión pausada:', error);
    }
  }

  isPauseExpired(pausedAt?: number): boolean {
    if (!pausedAt) return true;
    return Date.now() - pausedAt > PAUSE_LIMIT_MS;
  }

  getRemainingPauseTime(pausedAt?: number): number {
    if (!pausedAt) return 0;
    const elapsed = Date.now() - pausedAt;
    return Math.max(0, PAUSE_LIMIT_MS - elapsed);
  }

  getResumeStatus(): ResumeStatus {
    const session = this.getPausedSession();

    if (!session) {
      return { canResume: false, reason: 'NO_PAUSED_SESSION' };
    }

    if (this.isPauseExpired(session.pausedAt)) {
      this.clearPausedSession();
      return { canResume: false, reason: 'SESSION_EXPIRED' };
    }

    return {
      canResume: true,
      reason: null,
      session,
    };
  }
}
