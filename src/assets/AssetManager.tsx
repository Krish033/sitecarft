import React, { useCallback, useRef, useState } from 'react';
import type { Asset } from '../types/document';
import { CloseIcon, UploadIcon, VideoIcon } from '../components/Icons';

// ─── Props ───────────────────────────────────────────────────────────────────

interface AssetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  onUpload?: (file: File) => Promise<Asset>;
  onBrowse?: () => Promise<Asset[]>;
}

// ─── AssetManager ────────────────────────────────────────────────────────────

export function AssetManager({
  isOpen,
  onClose,
  onSelect,
  onUpload,
  onBrowse,
}: AssetManagerProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load assets
  const handleBrowse = useCallback(async () => {
    if (!onBrowse) return;
    setLoading(true);
    try {
      const result = await onBrowse();
      setAssets(result);
    } catch (err) {
      console.error('Failed to browse assets:', err);
    } finally {
      setLoading(false);
    }
  }, [onBrowse]);

  // Upload file
  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !onUpload) return;

      setUploading(true);
      try {
        const asset = await onUpload(file);
        setAssets((prev) => [asset, ...prev]);
        onSelect(asset);
      } catch (err) {
        console.error('Failed to upload asset:', err);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, onSelect]
  );

  // Trigger file dialog on open
  React.useEffect(() => {
    if (isOpen && onBrowse) {
      handleBrowse();
    }
  }, [isOpen, handleBrowse, onBrowse]);

  if (!isOpen) return null;

  return (
    <div className="rsb-asset-modal">
      <div className="rsb-asset-modal__overlay" onClick={onClose} />
      <div className="rsb-asset-modal__content">
        <div className="rsb-asset-modal__header">
          <h3>Media Library</h3>
          <button className="rsb-asset-modal__close" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="rsb-asset-modal__actions">
          {onUpload && (
            <>
              <button
                className="rsb-toolbar__btn rsb-toolbar__btn--primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <UploadIcon size={16} />
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.svg"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
            </>
          )}
        </div>

        <div className="rsb-asset-modal__grid">
          {loading && (
            <div className="rsb-asset-modal__loading">Loading assets...</div>
          )}
          {!loading && assets.length === 0 && (
            <div className="rsb-asset-modal__empty">
              No assets yet. Upload files to get started.
            </div>
          )}
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rsb-asset-modal__item"
              onClick={() => {
                onSelect(asset);
                onClose();
              }}
            >
              {asset.type === 'video' ? (
                <div className="rsb-asset-modal__video-thumb">
                  <VideoIcon size={24} />
                </div>
              ) : (
                <img
                  src={asset.thumbnailUrl || asset.url}
                  alt={asset.name}
                  className="rsb-asset-modal__thumb"
                />
              )}
              <span className="rsb-asset-modal__name">{asset.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
