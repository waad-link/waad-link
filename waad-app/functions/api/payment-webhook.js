/**
 * =========================================================================
 * WAAD PLATFORM - CRYPTOGRAPHIC PAYMENT WEBHOOK (HMAC-SHA512)
 * التحقق البنكي المشفر وتفعيل الدعوات أوتوماتيكياً
 * =========================================================================
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const bodyText = await request.text();
    const data = JSON.parse(bodyText);

    const hmacSecret = env.PAYMENT_HMAC_SECRET;
    const supabaseUrl = env.SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    // استخراج التوقيع الرقمي البنكي
    const receivedHmac = url.searchParams.get("hmac") || request.headers.get("X-Signature");

    if (!receivedHmac || !hmacSecret) {
      return new Response("Unauthorized Signature Missing", { status: 401 });
    }

    // التحقق بالـ HMAC المشفر لمنع التزوير
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(hmacSecret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyText));
    const expectedHmac = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedHmac !== receivedHmac) {
      return new Response("Fraud Detection: Signature Mismatch", { status: 403 });
    }

    const isSuccess = data.success === true || data.obj?.success === true;
    const eventSlug = data.slug || data.obj?.order?.merchant_order_id;

    if (isSuccess && eventSlug) {
      // تفعيل الدعوة في قاعدة البيانات بمفتاح السيرفر
      await fetch(`${supabaseUrl}/rest/v1/invitations?slug=eq.${encodeURIComponent(eventSlug)}`, {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "active",
          updated_at: new Date().toISOString()
        })
      });

      return new Response(JSON.stringify({ status: "activated_successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ status: "ignored_unsuccessful_transaction" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
