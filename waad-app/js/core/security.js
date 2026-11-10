/**
 * موديول الأمان وتطهير البيانات لمنع ثغرات الـ XSS
 */
export const Security = {
  /**
   * تحويل الرموز الحساسة إلى كيانات HTML آمنة تمنع تشغيل أي سكريبت خبيث
   * @param {string} str النص القادم من المستخدم
   * @returns {string} النص المعقم
   */
  sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  },

  /**
   * توليد معرّف فريد لجهاز المستخدم وتخزينه محلياً
   * الفائدة: نمنع الشخص الواحد إنه يضغط 10 مرات فيسجل 10 مرات في الداتابيز
   */
  getDeviceToken() {
    let token = localStorage.getItem('waad_device_token');
    if (!token) {
      // توليد نص عشوائي قوي مبني على التوقيت والرياضيات
      token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('waad_device_token', token);
    }
    return token;
  }
};