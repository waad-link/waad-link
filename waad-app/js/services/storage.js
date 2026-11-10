/**
 * غلاف آمن للتعامل مع localStorage
 * الفائدة: متصفح Safari على الآيفون في الوضع الخاص (Private Browsing) بيعمل Crash لو كلمت الـ Storage مباشرة
 */
export const SafeStorage = {
    get(key) {
        try {
            return localStorage.getItem(key);
        } catch (_) {
            return null;
        }
    },
    set(key, val) {
        try {
            localStorage.setItem(key, val);
            return true;
        } catch (_) {
            return false;
        }
    }
};