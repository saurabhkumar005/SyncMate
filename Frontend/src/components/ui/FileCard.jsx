// src/components/ui/FileCard.jsx
import { FileText, Image, Archive, File, Download } from 'lucide-react';
import { getFileType, formatFileSize } from '../../utils/helpers.js';

const iconMap = {
  pdf: { Icon: FileText, cls: 'pdf' },
  img: { Icon: Image, cls: 'img' },
  zip: { Icon: Archive, cls: 'zip' },
  doc: { Icon: FileText, cls: 'doc' },
  default: { Icon: File, cls: 'default' },
};

export default function FileCard({ filename, filesize, url, isSent = false }) {
  const type = getFileType(filename);
  const { Icon, cls } = iconMap[type] || iconMap.default;
  const size = typeof filesize === 'number' ? formatFileSize(filesize) : filesize;

  const handleDownload = () => {
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    }
  };

  return (
    <div
      className={`file-card ${isSent ? '' : 'received-file'}`}
      onClick={handleDownload}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
    >
      <div className={`file-icon ${cls}`}>
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div className="file-info">
        <div className="file-name">{filename}</div>
        {size && <div className="file-size">{size}</div>}
      </div>
      <Download size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </div>
  );
}
