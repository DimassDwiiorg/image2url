export type ExpiryDuration = '1_day' | '1_week' | '1_month';

/**
 * Menghasilkan token URL yang panjang, unik, dan aman
 * sesuai permintaan: "url nya kasih yang panjang"
 */
export function generateLongToken(): string {
  const array = new Uint8Array(36);
  window.crypto.getRandomValues(array);
  const randomHex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  const timestampHex = Date.now().toString(16);
  // Prefix terstruktur + hash aman panjang (total ~80 karakter)
  return `img_sec_${timestampHex}_${randomHex}`;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function calculateExpiry(duration: ExpiryDuration): { expiresAt: Date; durationLabel: string } {
  const now = new Date();
  let msToAdd = 0;
  let durationLabel = '1 Hari';

  switch (duration) {
    case '1_day':
      msToAdd = 24 * 60 * 60 * 1000;
      durationLabel = '1 Hari (24 Jam)';
      break;
    case '1_week':
      msToAdd = 7 * 24 * 60 * 60 * 1000;
      durationLabel = '1 Minggu (7 Hari)';
      break;
    case '1_month':
      msToAdd = 30 * 24 * 60 * 60 * 1000;
      durationLabel = '1 Bulan (30 Hari)';
      break;
  }

  const expiresAt = new Date(now.getTime() + msToAdd);
  return { expiresAt, durationLabel };
}

export interface RemainingTime {
  isExpired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

export function getRemainingTime(expiresAtStr: string | Date): RemainingTime {
  const target = new Date(expiresAtStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return {
      isExpired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: 'Kedaluwarsa',
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const parts = [];
  if (days > 0) parts.push(`${days}h`);
  if (hours > 0 || days > 0) parts.push(`${hours}j`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}d`);

  return {
    isExpired: false,
    days,
    hours,
    minutes,
    seconds,
    formatted: parts.join(' '),
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
}
