const DEFAULT_MAX_DIMENSION = 1920;
const DEFAULT_QUALITY = 0.85;
const DEFAULT_MIN_SIZE = 1024 * 1024;
const OUTPUT_TYPE = "image/jpeg";

const UNSUPPORTED_TYPES = new Set(["image/gif", "image/svg+xml"]);

type CompressionOptions = {
  maxDimension?: number;
  quality?: number;
  minSizeToCompress?: number;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to load image for compression"));
    };

    image.src = url;
  });
}

function replaceExtension(filename: string, extension: string): string {
  return filename.includes(".")
    ? filename.replace(/\.[^.]+$/, extension)
    : `${filename}${extension}`;
}

export async function compressImageForUpload(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  if (!file.type.startsWith("image/") || UNSUPPORTED_TYPES.has(file.type)) {
    return file;
  }

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = options.quality ?? DEFAULT_QUALITY;
  const minSizeToCompress = options.minSizeToCompress ?? DEFAULT_MIN_SIZE;
  const image = await loadImage(file);
  const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const shouldResize = largestSide > maxDimension;

  if (!shouldResize && file.size < minSizeToCompress) {
    return file;
  }

  const scale = shouldResize ? maxDimension / largestSide : 1;
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  ctx.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, OUTPUT_TYPE, quality);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File([blob], replaceExtension(file.name, ".jpg"), {
    type: OUTPUT_TYPE,
    lastModified: Date.now(),
  });
}
