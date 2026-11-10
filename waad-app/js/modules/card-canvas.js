import { CONFIG } from '../core/config.js';

/**
 * رسم بطاقة دعوة ملكية وحفظها كصورة PNG عالية الدقة (600x800) مباشرة في المتصفح
 */
export function generateVIPCardPNG(guestName) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // 1. رسم الخلفية السوداء الفاخرة
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, 600, 800);

    // 2. رسم الإطار الذهبي المزدوج
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 540, 740);
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 520, 720);

    // 3. كتابة نصوص الدعوة
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c5a059';
    ctx.font = '24px Tajawal, sans-serif';
    ctx.fillText('دعوة زفاف خاصة 💍', 300, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Amiri, serif';
    ctx.fillText(`${CONFIG.groom} & ${CONFIG.bride}`, 300, 180);

    ctx.fillStyle = '#888888';
    ctx.font = '18px Tajawal, sans-serif';
    ctx.fillText('يتشرف العروسان بدعوة كريم تشريفكم:', 300, 260);

    // 4. برواز اسم الضيف الذهبي
    ctx.fillStyle = '#141824';
    ctx.fillRect(60, 290, 480, 85);
    ctx.strokeStyle = '#c5a059';
    ctx.strokeRect(60, 290, 480, 85);

    ctx.fillStyle = '#f7e7c4';
    ctx.font = 'bold 24px Tajawal, sans-serif';
    ctx.fillText(guestName || 'ضيفنا العزيز', 300, 345);

    // 5. الموعد والمكان والدريس كود
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Tajawal, sans-serif';
    ctx.fillText(`📅 ${CONFIG.dateHuman}`, 300, 440);
    ctx.fillText(`📍 ${CONFIG.venue}`, 300, 490);

    ctx.fillStyle = '#c5a059';
    ctx.font = '16px Tajawal, sans-serif';
    ctx.fillText('Dress Code: سواريه ملكي ✨', 300, 560);

    ctx.fillStyle = '#666666';
    ctx.font = '14px Tajawal, sans-serif';
    ctx.fillText('صُنعت بكل حب بواسطة وعد', 300, 720);

    // 6. تحميل الصورة فوراً في تليفون الضيف
    const link = document.createElement('a');
    link.download = `دعوة_${(guestName || 'الضيف').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}