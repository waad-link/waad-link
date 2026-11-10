/**
 * إدارة وتصدير كشف المعازيم إلى ملف Excel متوافق مع الحروف العربية
 */
export const RSVPManager = {
    exportToCSV(guestsList, groom, bride) {
        if (!guestsList || guestsList.length === 0) {
            alert('لا توجد أسماء مسجلة حتى الآن لتصديرها');
            return;
        }

        // إضافة علامة \uFEFF وهي المسؤولة عن فتح الملف باللغة العربية في Microsoft Excel بدون رموز مشوهة
        let csv = "data:text/csv;charset=utf-8,\uFEFFم,اسم المعزوم,توقيت التسجيل\n";
        guestsList.forEach((g, idx) => {
            const time = new Date(g.created_at).toLocaleString('ar-EG');
            csv += `${idx + 1},"${g.guest_name}","${time}"\n`;
        });

        const link = document.createElement('a');
        link.href = encodeURI(csv);
        link.download = `كشف_معازيم_فرح_${groom}_و_${bride}.csv`;
        link.click();
    }
};