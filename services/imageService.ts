import { fileToImage } from '../utils/fileUtils';
import type { EventDetails } from '../types';

const THUMB_SIZE = 256;
const COLS = 4;

/**
 * Creates a single grid image from multiple photo files for efficient AI analysis.
 */
export async function createThumbnailGrid(files: File[]): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not get canvas context");

  const rows = Math.ceil(files.length / COLS);
  canvas.width = COLS * THUMB_SIZE;
  canvas.height = rows * THUMB_SIZE;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(files.map(fileToImage));

  images.forEach((img, i) => {
    const scale = Math.min(THUMB_SIZE / img.width, THUMB_SIZE / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const x = col * THUMB_SIZE + (THUMB_SIZE - w) / 2;
    const y = row * THUMB_SIZE + (THUMB_SIZE - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  });

  return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
}

/**
 * Draws an image onto the canvas, cropping it to fit the target dimensions without distortion.
 */
function drawImageCropped(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sx, sy, sw, sh;

  if (imgRatio > targetRatio) { // Image is wider than target
    sw = img.height * targetRatio;
    sh = img.height;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else { // Image is taller than target
    sw = img.width;
    sh = img.width / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * Generates the final collage image on a canvas.
 */
export async function generateCollage(
  selectedFiles: File[],
  logoImg: HTMLImageElement,
  details: EventDetails
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Could not get canvas context");

  const N = details.numberOfPhotos; // Use number of photos from details
  const W = 2400; // Increased resolution
  const H = 3000; // Increased resolution
  const HDR = 300; // Scaled
  const PAD = 20; // Scaled

  canvas.width = W;
  canvas.height = H;
  
  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  
  // Header
  ctx.fillStyle = details.headerColor;
  ctx.fillRect(0, 0, W, HDR);
  
  // Header Text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold 100px sans-serif`; // Scaled
  ctx.textBaseline = 'middle';
  
  // Adjust date format to be more readable
  const eventDate = new Date(details.eventDate + 'T00:00:00'); // Ensure correct date parsing
  const formattedDate = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillText(details.schoolName, 60, HDR / 2 - 40); // Scaled
  ctx.font = `60px sans-serif`; // Scaled
  ctx.fillText(formattedDate, 60, HDR / 2 + 60); // Scaled
  
  // Header Logo
  const logoH = HDR - 100; // Scaled
  const logoW = logoImg.width * (logoH / logoImg.height);
  ctx.drawImage(logoImg, W - logoW - 60, 50, logoW, logoH); // Scaled

  const images = await Promise.all(selectedFiles.slice(0, N).map(fileToImage));

  // Layout logic
  const bodyY = HDR + PAD;
  const bodyH = H - HDR - PAD;

  if (N === 4) {
    const heroW = 1500; // Scaled
    const sideW = W - heroW - PAD;
    const heroH = H - HDR - 2 * PAD;
    const sideH = (heroH - 2 * PAD) / 3;
    drawImageCropped(ctx, images[0], PAD, HDR + PAD, heroW - PAD, heroH);
    drawImageCropped(ctx, images[1], heroW, HDR + PAD, sideW - PAD, sideH);
    drawImageCropped(ctx, images[2], heroW, HDR + 2 * PAD + sideH, sideW - PAD, sideH);
    drawImageCropped(ctx, images[3], heroW, HDR + 3 * PAD + 2 * sideH, sideW - PAD, sideH);
  } else if (N === 5) {
    const topH = 1400; // Scaled
    drawImageCropped(ctx, images[0], PAD, bodyY, W - 2 * PAD, topH);
    const bottomY = bodyY + topH + PAD;
    const bottomH = H - bottomY - PAD;
    const cellW = (W - 3 * PAD) / 2;
    drawImageCropped(ctx, images[1], PAD, bottomY, cellW, bottomH / 2 - PAD / 2);
    drawImageCropped(ctx, images[2], PAD + cellW + PAD, bottomY, cellW, bottomH / 2 - PAD / 2);
    drawImageCropped(ctx, images[3], PAD, bottomY + bottomH / 2 + PAD / 2, cellW, bottomH / 2 - PAD / 2);
    drawImageCropped(ctx, images[4], PAD + cellW + PAD, bottomY + bottomH / 2 + PAD / 2, cellW, bottomH / 2 - PAD / 2);
  } else if (N === 6) { // 2x3 grid
    const cols = 3, rows = 2;
    const cellW = (W - (cols + 1) * PAD) / cols;
    const cellH = (bodyH - (rows + 1) * PAD) / rows;
     images.forEach((img, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        drawImageCropped(ctx, img, PAD + col * (cellW + PAD), bodyY + PAD + row * (cellH + PAD), cellW, cellH);
    });
  } else if (N === 7) {
    const topH = 1200; // Scaled
    drawImageCropped(ctx, images[0], PAD, bodyY, W - 2*PAD, topH);
    const gridY = bodyY + topH + PAD;
    const gridH = H - gridY - PAD;
    const cols = 3, rows = 2;
    const cellW = (W - (cols + 1) * PAD) / cols;
    const cellH = (gridH - (rows + 1) * PAD) / rows;
     images.slice(1).forEach((img, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        drawImageCropped(ctx, img, PAD + col * (cellW + PAD), gridY + PAD + row * (cellH + PAD), cellW, cellH);
    });
  }
  else { // Fallback grid layout for other numbers
    const cols = N <= 3 ? N : Math.ceil(Math.sqrt(N));
    const rows = Math.ceil(N / cols);
    const cellW = (W - (cols + 1) * PAD) / cols;
    const cellH = (bodyH - (rows + 1) * PAD) / rows;
    images.forEach((img, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        drawImageCropped(ctx, img, PAD + col * (cellW + PAD), bodyY + PAD + row * (cellH + PAD), cellW, cellH);
    });
  }

  return canvas.toDataURL('image/jpeg', 0.92); // Slightly increased quality for larger image
}