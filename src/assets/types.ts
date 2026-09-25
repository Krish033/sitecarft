export type { Asset } from '../types/document';

/**
 * Callbacks the host application provides for asset management.
 */
export interface AssetCallbacks {
  /** Resolve an asset ID to its displayable URL */
  onResolveAsset?: (assetId: string) => Promise<string>;
  /** Upload a file and return asset metadata */
  onUploadAsset?: (file: File) => Promise<import('../types/document').Asset>;
  /** Browse and return available assets */
  onBrowseAssets?: () => Promise<import('../types/document').Asset[]>;
}
