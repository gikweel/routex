export interface InAppAlert {
  id: string;
  title: string;
  body: string;
  category: 'departure' | 'delay' | 'calendar' | 'system';
  timestamp: number;
}

let audioCtx: AudioContext | null = null;

function playAudibleChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440.0, now); // A4
    osc2.frequency.exponentialRampToValueAtTime(587.33, now + 0.15); // D5

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (err) {
    console.warn('Audio chime playback omitted or unsupported:', err);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    if (Notification.permission === 'granted') return true;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch {
    return false;
  }
}

export function triggerPushAlert(title: string, body: string, category: InAppAlert['category'] = 'departure'): InAppAlert {
  // 1. Play audible sound
  playAudibleChime();

  // 2. Dispatch native browser notification if granted
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`[GeoPulse] ${title}`, {
        body,
        icon: '/favicon.ico',
        tag: 'geopulse-commute-alert',
      });
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }

  // 3. Dispatch in-app notification event for UI toasts
  const alert: InAppAlert = {
    id: 'alert-' + Math.random().toString(36).substring(2, 9),
    title,
    body,
    category,
    timestamp: Date.now(),
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('geopulse-notification', { detail: alert }));
  }

  return alert;
}
