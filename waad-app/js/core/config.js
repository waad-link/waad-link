/**
 * مركز البيانات الموحد للمشروع (Single Source of Truth)
 * كل بيانات المناسبة ومفاتيح الداتابيز بتتعرف هنا مرة واحدة ومبتتكررش في أي ملف تاني
 */
export const CONFIG = {
    // مفاتيح Supabaseا
    supabaseUrl: "https://ytrxocqpzjmojajpexup.supabase.co", // رابط مشروعك من Supabase Project Settings
    supabaseKey: "sb_publishable_a_MBKX2GL97-0iqmhKy7uw_X8unWb93",                 // المفتاح العام anon public key

    // البيانات التشغيلية للدعوة
    slug: "ahmed-mona",                           // معرف الرابط
    groom: "أحمد",                                 // اسم العريس
    bride: "منى",                                 // اسم العروسة
    dateISO: "2027-07-15T20:00:00+02:00",         // تاريخ الحفل بصيغة ISO الرسمية
    dateHuman: "الخميس، 15 يوليو 2027",            // التاريخ المعروض باللغة العربية
    timeHuman: "الساعة 8:00 مساءً",                // التوقيت المعروض
    venue: "قاعة فيردي الملكية - التجمع الخامس",    // اسم ومكان القاعة
    mapUrl: "https://maps.google.com/?q=New+Cairo",// رابط خرائط جوجل للقاعة
    phone: "201012345678",                         // رقم واتساب العروسين لاستقبال التهنئة
    adminPin: "1234"                               // الرقم السري للدخول للوحة كشف العريس
};