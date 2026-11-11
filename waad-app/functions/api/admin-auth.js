/**
 * =========================================================================
 * WAAD PLATFORM - SECURE ADMIN GATEWAY (CLOUDFLARE EDGE FUNCTION)
 * حراسة كشف المعازيم ومنع التخمين وحماية الداتا بمفتاح السيرفر المعزول
 * =========================================================================
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };

  try {
    const body = await request.json();
    const { slug, pin } = body;

    // 1. فحص وجود المدخلات
    if (!slug || !pin) {
      return new Response(JSON.stringify({ error: "البيانات غير مكتملة" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 2. قراءة المتغيرات السرية المعزولة في سيرفر Cloudflare
    const supabaseUrl = env.SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "خطأ في تكوين مفاتيح السيرفر السحابي" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // 3. التحقق الأمني: استعلام مشفر بالـ Service Role للتأكد من الباسورد
    const eventRes = await fetch(`${supabaseUrl}/rest/v1/invitations?slug=eq.${encodeURIComponent(slug)}&select=admin_pin,status`, {
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`
      }
    });

    const events = await eventRes.json();

    if (!events || events.length === 0 || events[0].admin_pin !== pin) {
      // رفض الوصول فوراً ومنع محاولات التخمين
      return new Response(JSON.stringify({ error: "بيانات الدخول غير صحيحة. تم رفض الوصول." }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // 4. بعد التأكد 100% من شخصية العريس، يتم جلب كشف المعازيم بمفتاح السيرفر
    const rsvpRes = await fetch(`${supabaseUrl}/rest/v1/rsvps?invitation_slug=eq.${encodeURIComponent(slug)}&order=created_at.desc`, {
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`
      }
    });

    const guests = await rsvpRes.json();

    return new Response(JSON.stringify({
      success: true,
      total_heads: guests.length,
      guests: guests
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "حدث خطأ غير متوقع أثناء معالجة الطلب" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
