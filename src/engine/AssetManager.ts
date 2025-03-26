import * as THREE from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export enum AssetType {
  MODEL = "model",
  TEXTURE = "texture",
  AUDIO = "audio",
  JSON = "json",
  TEXT = "text",
}

export type AssetTypeMap = {
  [AssetType.MODEL]: GLTF;
  [AssetType.TEXTURE]: THREE.Texture;
  [AssetType.AUDIO]: AudioBuffer;
  [AssetType.JSON]: any;
  [AssetType.TEXT]: string;
};

type AssetToLoad<T extends AssetType = AssetType> = { type: T; url: string };

type AssetLoadOptions = {
  onProgress?: (progress: number) => void;
  onComplete?: (asset: any) => void;
  onError?: (error: any) => void;
};

type AssetStatus = "not_loaded" | "loading" | "loaded" | "error";

export class AssetManager {
  private caches = new Map<AssetType, Map<string, any>>([
    [AssetType.MODEL, new Map<string, THREE.Object3D>()],
    [AssetType.TEXTURE, new Map<string, THREE.Texture>()],
    [AssetType.AUDIO, new Map<string, AudioBuffer>()],
    [AssetType.JSON, new Map<string, any>()],
    [AssetType.TEXT, new Map<string, string>()],
  ]);

  private assetStatus = new Map<string, AssetStatus>();
  private gltfLoader = new GLTFLoader();
  private textureLoader = new THREE.TextureLoader();
  private audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  constructor() {
    console.log("AssetManager initialized.");
  }

  public async loadAsset<T extends AssetType>(
    asset: AssetToLoad<T>,
    options?: AssetLoadOptions
  ): Promise<AssetTypeMap[T]> {
    switch (asset.type) {
      case AssetType.MODEL:
        return await this.loadModel(asset.url, options);
      case AssetType.TEXTURE:
        return this.loadTexture(asset.url, options);
      case AssetType.AUDIO:
        return this.loadAudio(asset.url, options);
      case AssetType.JSON:
        return this.loadJSON(asset.url, options);
      case AssetType.TEXT:
        return this.loadText(asset.url, options);
      default:
        throw new Error(`Unsupported asset type: ${asset.type}`);
    }
  }

  public async preloadAssets(assets: AssetToLoad[]): Promise<void> {
    await Promise.all(
      assets.map((asset) => this.loadAsset(asset).catch(() => {}))
    );
  }

  public getAsset<T>(type: AssetType, url: string): T | undefined {
    return this.caches.get(type)?.get(url);
  }

  public clearCache(): void {
    this.caches
      .get(AssetType.TEXTURE)
      ?.forEach((texture: THREE.Texture) => texture.dispose());
    this.caches.forEach((cache) => cache.clear());
    this.assetStatus.clear();
  }

  private loadModel(url: string, options?: AssetLoadOptions): Promise<GLTF> {
    return this.loadWithCache(
      url,
      AssetType.MODEL,
      this.gltfLoader.load.bind(this.gltfLoader),
      options,
      (gltf) => ({
        ...gltf,
        scene: SkeletonUtils.clone(gltf.scene) as THREE.Group,
        animations: gltf.animations,
      })
    );
  }

  private loadTexture(
    url: string,
    options?: AssetLoadOptions
  ): Promise<THREE.Texture> {
    return this.loadWithCache(
      url,
      AssetType.TEXTURE,
      this.textureLoader.load.bind(this.textureLoader),
      options,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      }
    );
  }

  private async loadAudio(
    url: string,
    options?: AssetLoadOptions
  ): Promise<AudioBuffer> {
    return this.loadWithCache(
      url,
      AssetType.AUDIO,
      async (url) => {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(buffer);
      },
      options
    );
  }

  private async loadJSON(
    url: string,
    options?: AssetLoadOptions
  ): Promise<any> {
    return this.loadWithCache(
      url,
      AssetType.JSON,
      async (url) => (await fetch(url)).json(),
      options
    );
  }

  private async loadText(
    url: string,
    options?: AssetLoadOptions
  ): Promise<string> {
    return this.loadWithCache(
      url,
      AssetType.TEXT,
      async (url) => (await fetch(url)).text(),
      options
    );
  }

  private async loadWithCache<T>(
    url: string,
    type: AssetType,
    loader: (
      url: string,
      onLoad: (asset: T) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: any) => void
    ) => void,
    options?: AssetLoadOptions,
    transform?: (asset: T) => T
  ): Promise<T> {
    const cache = this.caches.get(type)!;
    if (cache.has(url)) return cache.get(url);

    return new Promise((resolve, reject) => {
      this.assetStatus.set(url, "loading");

      loader(
        url,
        (asset: T) => {
          const processedAsset = transform ? transform(asset) : asset;
          cache.set(url, processedAsset);
          this.assetStatus.set(url, "loaded");
          options?.onComplete?.(processedAsset);
          resolve(processedAsset);
        },
        (progress) => options?.onProgress?.(progress.loaded / progress.total),
        (error) => {
          this.assetStatus.set(url, "error");
          options?.onError?.(error);
          reject(error);
        }
      );
    });
  }
}
