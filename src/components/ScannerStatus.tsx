import { motion } from 'framer-motion';
import { Radar, Play, Loader2 } from 'lucide-react';
import type { ScannerStatus as ScannerStatusType } from '../types';

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatNextScan(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

interface Props {
  status: ScannerStatusType | null;
  isScanning: boolean;
  onRunScan: () => void;
}

export const ScannerStatus = ({ status, isScanning, onRunScan }: Props) => {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="scanner-status">
      <div className="scanner-status__left">
        <div className={`scanner-status__dot ${isScanning ? 'scanner-status__dot--active' : ''}`} />
        <Radar size={14} style={{ color: isScanning ? 'var(--color-primary)' : 'var(--color-ink-muted)' }} />
        <div className="scanner-status__info">
          {isScanning ? (
            <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Scanning 6 sources...</span>
          ) : status ? (
            <>
              <span>Last scan: <strong>{timeAgo(status.lastScanAt!)}</strong></span>
              <span className="scanner-status__sep">&middot;</span>
              <span>Next: <strong>{formatNextScan(status.nextScanAt!)}</strong></span>
              <span className="scanner-status__sep">&middot;</span>
              <span>{status.newSinceLastScan} new found</span>
            </>
          ) : (
            <span>Scanner initializing...</span>
          )}
        </div>
      </div>

      <button
        onClick={onRunScan}
        disabled={isScanning}
        className={`scanner-status__btn ${isScanning ? 'scanner-status__btn--scanning' : ''}`}
      >
        {isScanning ? <Loader2 size={13} className="spin" /> : <Play size={13} />}
        {isScanning ? 'Scanning...' : 'Run Scan Now'}
      </button>
    </motion.div>
  );
};
