# مرجع الوحدات البرمجية والـ API (API Reference)

## 1. الوحدات الأساسية (`src/js/core/`)
### `config.js`
يحتوي على الكائن المركزي `AppConfig` الذي يغذي المنصة ببيانات المناسبة ومفاتيح الربط السحابي.

### `security.js`
- `Security.sanitize(input)`: تطهير النصوص من أي رموز HTML أو محاولات حقن كود (XSS).
- `Security.formatEgyptPhone(phone)`: تحويل أرقام الهواتف المصرية إلى الصيغة الدولية القياسية (`201xxxxxxxxx`).

---

## 2. الخدمات السحابية والتخزين (`src/js/services/`)
### `supabase.js`
- `SupabaseService.submitRSVP(slug, guestName)`: إرسال صامت لتأكيد حضور الضيف في جدول `rsvps`.
- `SupabaseService.fetchGuests(slug)`: جلب قائمة الحضور المحدثة لحظياً لعرضها في `admin.html`.

### `storage.js`
- `StorageService.get(key)` / `StorageService.set(key, value)`: غلاف آمن حول `localStorage` يمنع توقف المتصفح في وضع التصفح الخفي (Safari Private Mode).

---

## 3. المحركات التفاعلية (`src/js/modules/`)
- `CountdownEngine.start(targetISO, elements)`: حساب وعرض الأيام، الساعات، الدقائق، والثواني المتبقية.
- `CardCanvas.downloadVIPPass(data)`: رسم كارت دعوة ملكي بجودة `600x800` وتنزيله كصورة `PNG` على هاتف الضيف.
- `RSVPManager.exportCSV(guestsList, filename)`: تصدير كشف المعازيم بصيغة متوافقة مع Microsoft Excel باللغة العربية (`UTF-8 BOM`).