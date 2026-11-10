import { CONFIG } from '../core/config.js';
import { Security } from '../core/security.js';

/**
 * موديول الاتصال المباشر مع Supabase عبر REST API بدون مكتبات خارجية
 */
export const SupabaseService = {
    /**
     * تسجيل اسم الضيف في جدول rsvps في صمت بالخلفية
     */
    async registerRSVP(guestName) {
        const payload = {
            invitation_slug: CONFIG.slug,
            guest_name: Security.sanitizeText(guestName),
            guest_token: Security.getDeviceToken(),
            status: 'confirmed'
        };

        // إرسال طلب POST مباشر ومتوافق مع سياسات الأمان RLS
        const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/rsvps`, {
            method: 'POST',
            headers: {
                'apikey': CONFIG.supabaseKey,
                'Authorization': `Bearer ${CONFIG.supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal' // يطلب من السيرفر الرد بسرعة بدون إرجاع بيانات مكررة
            },
            body: JSON.stringify(payload)
        });

        // كود 409 يعني مسجل مسبقاً من نفس الجهاز، ونتعامل معاه بنجاح
        if (!response.ok && response.status !== 409) {
            throw new Error(`فشل التسجيل السحابي: ${response.status}`);
        }
        return true;
    },

    /**
     * جلب كشف المعازيم لايف من الداتابيز للعريس مرتب من الأحدث للأقدم
     */
    async getGuestsList() {
        const response = await fetch(
            `${CONFIG.supabaseUrl}/rest/v1/rsvps?invitation_slug=eq.${CONFIG.slug}&order=created_at.desc`,
            {
                headers: {
                    'apikey': CONFIG.supabaseKey,
                    'Authorization': `Bearer ${CONFIG.supabaseKey}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('فشل جلب بيانات المعازيم');
        }
        return await response.json();
    }
};