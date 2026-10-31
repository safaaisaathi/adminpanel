import React from 'react';
import { ComplaintStatus, VanStatus } from '../types';
import { Inbox, UserCheck, CheckCircle2, AlertTriangle, Truck, PauseCircle, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface StatusChipProps {
  status: ComplaintStatus | VanStatus | 'queued';
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const { t } = useApp();

  let fillBg = '';
  let textColor = '';
  let label = '';
  let IconComponent: React.ElementType = Inbox;

  switch (status) {
    case 'received':
      fillBg = 'bg-[#FFF1D1] dark:bg-[#3A2E0E]';
      textColor = 'text-[#8A5A00] dark:text-[#F7C85A]';
      label = t.status.received;
      IconComponent = Inbox;
      break;
    case 'assigned':
      fillBg = 'bg-[#E3EDFF] dark:bg-[#1B2B4D]';
      textColor = 'text-[#1D4FB8] dark:text-[#8DB4FF]';
      label = t.status.assigned;
      IconComponent = UserCheck;
      break;
    case 'resolved':
      fillBg = 'bg-[#DDF3E4] dark:bg-[#17382A]';
      textColor = 'text-[#146B3A] dark:text-[#7ED6A1]';
      label = t.status.resolved;
      IconComponent = CheckCircle2;
      break;
    case 'escalated':
      fillBg = 'bg-[#FDE3E0] dark:bg-[#43201C]';
      textColor = 'text-[#B3261E] dark:text-[#FF9B91]';
      label = t.status.escalated;
      IconComponent = AlertTriangle;
      break;
    case 'on_shift':
      fillBg = 'bg-[#DDF3E4] dark:bg-[#17382A]';
      textColor = 'text-[#146B3A] dark:text-[#7ED6A1]';
      label = t.status.on_shift;
      IconComponent = Truck;
      break;
    case 'idle':
      fillBg = 'bg-[#E9F1E6] dark:bg-[#1E2D24]';
      textColor = 'text-[#566259] dark:text-[#9DB0A2]';
      label = t.status.idle;
      IconComponent = PauseCircle;
      break;
    case 'offline':
      fillBg = 'bg-[#FDE3E0] dark:bg-[#43201C]';
      textColor = 'text-[#B3261E] dark:text-[#FF9B91]';
      label = t.status.offline;
      IconComponent = WifiOff;
      break;
    case 'queued':
      fillBg = 'bg-[#E9F1E6] dark:bg-[#1E2D24]';
      textColor = 'text-[#566259] dark:text-[#9DB0A2]';
      label = 'Queued';
      IconComponent = Inbox;
      break;
  }

  const py = size === 'sm' ? 'py-0.5 px-2.5 text-xs' : 'py-1 px-3 text-sm';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border border-black/5 dark:border-white/5 ${fillBg} ${textColor} ${py} ${className}`}
    >
      <IconComponent size={iconSize} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
};
