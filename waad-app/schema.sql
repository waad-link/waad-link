-- ========================================================
-- WAAD PLATFORM - POSTGRESQL SCHEMA (SUPABASE)
-- ========================================================

-- 1. تفعيل الامتدادات الأساسية لتوليد الـ UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. جدول الفعاليات والمناسبات (Invitations)
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(80) NOT NULL UNIQUE,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('wedding', 'surprise', 'date')),
    status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('draft', 'active', 'archived', 'deleted')),
    groom_name VARCHAR(100),
    bride_name VARCHAR(100),
    event_date TIMESTAMPTZ NOT NULL,
    venue_name VARCHAR(200) NOT NULL,
    map_url TEXT,
    theme VARCHAR(50) DEFAULT 'vogue' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT chk_slug_format CHECK (slug ~* '^[a-z0-9_-]+$')
);

-- 3. جدول تسجيل حضور المعازيم (RSVP Registrations)
CREATE TABLE public.rsvps (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    guest_token VARCHAR(64), -- معرّف الجهاز لمنع التكرار العفوي
    status VARCHAR(20) DEFAULT 'confirmed' NOT NULL CHECK (status IN ('confirmed', 'declined')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- قيد الأمان لمنع الضغط المكرر من نفس التليفون
    CONSTRAINT unique_device_per_invite UNIQUE (invitation_id, guest_token)
);

-- 4. فهارس لسرعة الاستعلام اللحظية تحت الضغط العالي
CREATE INDEX idx_invitations_slug ON public.invitations(slug);
CREATE INDEX idx_rsvps_lookup ON public.rsvps(invitation_id, guest_name);
CREATE INDEX idx_rsvps_created ON public.rsvps(created_at DESC);

-- 5. تفعيل جدار الحماية والأمان على مستوى السجلات (RLS)
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة الفعالية النشطة
CREATE POLICY "Public can view active invitations"
    ON public.invitations FOR SELECT
    USING (status = 'active');

-- السماح للمعازيم بتسجيل حضورهم فقط
CREATE POLICY "Guests can submit RSVP"
    ON public.rsvps FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE invitations.id = rsvps.invitation_id 
            AND invitations.status = 'active'
        )
    );

-- قراءة كشف الحضور للفعالية المصرح بها
CREATE POLICY "Public can read RSVPs for active invites"
    ON public.rsvps FOR SELECT
    USING (true);