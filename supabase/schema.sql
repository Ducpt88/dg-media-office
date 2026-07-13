-- ============================================================
-- DUCPT / DG Media — Supabase schema cho Passport Admin + Web
-- Chạy trong: Supabase Dashboard > SQL Editor > New query > Run
-- Nguyên tắc RLS:
--   * Bảng NỘI DUNG (products, services, tools, courses, articles, about, settings):
--       - anon (khách web) ĐƯỢC ĐỌC  -> web ngoài hiển thị dữ liệu admin sửa
--       - chỉ user ĐÃ ĐĂNG NHẬP mới ghi -> admin sửa
--   * Bảng NHẠY CẢM (orders, tickets): KHÔNG cho anon đọc, chỉ authenticated.
-- anon key nhúng ở client là AN TOÀN (RLS bảo vệ). TUYỆT ĐỐI không nhúng service_role key.
-- ============================================================

-- Hàm tiện ích: tự cập nhật updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------- SETTINGS (1 dòng) ----------
create table if not exists public.settings (
  id          int primary key default 1,
  usd_to_vnd  numeric not null default 25000,
  base_currency text not null default 'VND',
  updated_at  timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);
insert into public.settings (id) values (1) on conflict do nothing;

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique,
  name        text not null,
  price_label text,                 -- ví dụ "199K" hoặc "Liên hệ"
  price_vnd   numeric,              -- số thật để tính toán (nullable nếu "Liên hệ")
  status      text not null default 'active',   -- active | draft | hidden
  note        text,
  description text,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------- SERVICES (dịch vụ đào tạo) ----------
create table if not exists public.services (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  audience   text,
  content    text,
  status     text not null default 'draft',
  sort       int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- TOOLS (công cụ AI) ----------
create table if not exists public.tools (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  status     text not null default 'draft',      -- live | draft | setup
  note       text,
  sort       int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- COURSES (khóa học) ----------
create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text,
  lessons_count int not null default 0,
  status       text not null default 'draft',
  sort         int not null default 0,
  updated_at   timestamptz not null default now()
);

-- ---------- ARTICLES (bài viết) ----------
create table if not exists public.articles (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  slug       text unique,
  excerpt    text,
  status     text not null default 'draft',
  sort       int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- ABOUT (về chúng tôi — 1 dòng) ----------
create table if not exists public.about (
  id         int primary key default 1,
  intro      text,
  contact    text,
  updated_at timestamptz not null default now(),
  constraint about_singleton check (id = 1)
);
insert into public.about (id) values (1) on conflict do nothing;

-- ---------- ORDERS / CUSTOMERS (nhạy cảm) ----------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_id       text unique,
  name           text,
  contact        text,
  product        text,
  amount         numeric,
  currency       text default 'VND',
  payment_source text default 'manual',
  status         text default 'paid',
  entitlement    boolean default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------- TICKETS (nhạy cảm) ----------
create table if not exists public.tickets (
  id         uuid primary key default gen_random_uuid(),
  subject    text not null,
  detail     text,
  status     text not null default 'open',
  created_at timestamptz not null default now()
);

-- ---------- Triggers updated_at ----------
do $$
declare t text;
begin
  foreach t in array array['settings','products','services','tools','courses','articles','about','orders']
  loop
    execute format('drop trigger if exists trg_%1$s_upd on public.%1$s;', t);
    execute format('create trigger trg_%1$s_upd before update on public.%1$s
                    for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['settings','products','services','tools','courses','articles','about','orders','tickets']
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Bảng nội dung: anon + authenticated ĐỌC; chỉ authenticated GHI
do $$
declare t text;
begin
  foreach t in array array['settings','products','services','tools','courses','articles','about']
  loop
    execute format('drop policy if exists %1$s_read on public.%1$s;', t);
    execute format('create policy %1$s_read on public.%1$s for select using (true);', t);
    execute format('drop policy if exists %1$s_write on public.%1$s;', t);
    execute format('create policy %1$s_write on public.%1$s for all
                    to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Bảng nhạy cảm: CHỈ authenticated (không anon)
do $$
declare t text;
begin
  foreach t in array array['orders','tickets']
  loop
    execute format('drop policy if exists %1$s_auth on public.%1$s;', t);
    execute format('create policy %1$s_auth on public.%1$s for all
                    to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ============================================================
-- SEED dữ liệu hiện tại (khớp với bản tĩnh đang chạy) — chỉ chèn nếu bảng rỗng
-- ============================================================
insert into public.products (name, price_label, price_vnd, status, note, sort)
select * from (values
  ('Verba Studio','199K',199000,'active','Đang bán',1),
  ('Brain Bot','299K',299000,'active','Đang bán',2),
  ('Pinterest AutoPost','249K',249000,'active','Đang bán',3),
  ('Giải pháp tùy chỉnh','Liên hệ',null,'active','Dịch vụ',4)
) v where not exists (select 1 from public.products);

insert into public.services (name, audience, content, status, sort)
select * from (values
  ('Đào tạo AI doanh nghiệp','Team','Workshop + tài liệu','draft',1),
  ('Kèm workflow AI 1:1','Cá nhân','Tư vấn + setup','draft',2)
) v where not exists (select 1 from public.services);

insert into public.tools (name, status, note, sort)
select * from (values
  ('Verba Studio','live','Landing + checkout',1),
  ('Knowledge Brain Bot','live','Trang sản phẩm',2),
  ('Pinterest AutoPost','draft','Chờ mô tả chi tiết',3),
  ('API tích hợp','setup','Chờ backend',4)
) v where not exists (select 1 from public.tools);

insert into public.courses (name, category, lessons_count, status, sort)
select * from (values
  ('AI cho người mới','Nền tảng',0,'draft',1),
  ('AI cho Creator','Nội dung',0,'draft',2),
  ('Automation thực chiến','Automation',0,'draft',3)
) v where not exists (select 1 from public.courses);
