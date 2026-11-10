/**
 * تشغيل العداد التنازلي بالثواني الحقيقية
 * @param {string} targetDateISO التاريخ المستهدف بصيغة ISO
 * @param {Function} onTick دالة تنفذ كل ثانية لتحديث أرقام الشاشة
 */
export function initCountdown(targetDateISO, onTick) {
    const target = new Date(targetDateISO).getTime();

    function update() {
        const diff = target - Date.now();
        // إذا انتهى موعد الفرح يتم تصفير العداد
        if (diff <= 0) {
            onTick({ days: "00", hours: "00", mins: "00", secs: "00" });
            return;
        }

        // معادلات رياضية دقيقة لتحويل الفروق لـ (أيام / ساعات / دقائق / ثواني)
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        onTick({
            days: String(d).padStart(2, '0'),
            hours: String(h).padStart(2, '0'),
            mins: String(m).padStart(2, '0'),
            secs: String(s).padStart(2, '0')
        });
    }

    update();
    return setInterval(update, 1000); // تحديث دوري كل 1 ثانية
}