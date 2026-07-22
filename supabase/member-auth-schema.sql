-- ============================================================
-- DUCPT — TAI KHOAN CHUNG TOAN WEBSITE (Supabase Auth)
-- Chay trong: Supabase Dashboard > SQL Editor > New query > Run
-- Chay SAU schema.sql va course-video-schema.sql.
--
-- Mo hinh Founder chot 2026-07-22:
--   Dang ky MOT lan o bat ky trang nao (trang chu, /dang-ky/, /khoa-hoc/)
--   -> dung chung cho TOAN BO ducpt.com. Chua tra phi thi bi gioi han quyen.
--
-- Quyen doc theo 2 tang, chi can 1 trong 2 la mo:
--   1. profiles.plan = 'premium'        -> mo toan bo (nang cap ca tai khoan)
--   2. entitlements  co dong con hieu luc -> mo dung 1 san pham (mua le)
--
-- CANH BAO BAO MAT DA VA TRONG FILE NAY:
--   schema.sql cu cho MOI user 'authenticated' GHI vao products/orders/courses...
--   Luc do chi Founder dang nhap nen khong sao. Nhung khi mo tai khoan cho hoc vien,
--   moi hoc vien deu la 'authenticated' -> se sua duoc gia san pham va don hang.
--   Phan cuoi file nay siet lai: GHI = chi admin.
-- ============================================================

-- ---------- 0. HAM PHU TRO (dinh nghia neu chua co, de file nay chay DOC LAP
--             tren project trong, khong phu thuoc schema.sql da chay truoc) ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- 1. HO SO THANH VIEN ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  contact    text,          -- SDT / Zalo
  note       text,          -- "mong muon hoc"
  plan       text not null default 'free',    -- free | premium
  role       text not null default 'member',  -- member | admin
  source     text,          -- dang ky tu trang nao
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_plan_check check (plan in ('free','premium')),
  constraint profiles_role_check check (role in ('member','admin'))
);

-- ---------- 2. QUYEN THEO TUNG SAN PHAM ----------
-- product_key vi du: 'course:doanh-nghiep-mot-nguoi' | 'tool:verba-studio'
create table if not exists public.entitlements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_key text not null,
  tier        text not null default 'premium',  -- free | premium
  status      text not null default 'active',   -- active | paused | revoked
  order_id    text,
  granted_by  text,
  expires_at  timestamptz,                      -- null = vinh vien
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, product_key)
);

create index if not exists entitlements_user_idx on public.entitlements(user_id);

-- ---------- 3. TU TAO HO SO KHI CO NGUOI DANG KY ----------
-- Khong de client tu insert profiles (tranh gia mao role/plan).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, contact, note, source)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'full_name',''),
    nullif(new.raw_user_meta_data->>'contact',''),
    nullif(new.raw_user_meta_data->>'note',''),
    nullif(new.raw_user_meta_data->>'source','')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 4. HAM KIEM TRA ADMIN ----------
-- security definer de KHONG bi de quy RLS khi doc chinh bang profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- 5. TRIGGER updated_at ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','entitlements']
  loop
    execute format('drop trigger if exists trg_%1$s_upd on public.%1$s;', t);
    execute format('create trigger trg_%1$s_upd before update on public.%1$s
                    for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ---------- 6. RLS CHO profiles / entitlements ----------
alter table public.profiles     enable row level security;
alter table public.entitlements enable row level security;

-- Thanh vien DOC ho so cua chinh minh; admin doc tat ca.
drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Thanh vien SUA duoc ten/lien he cua minh.
-- KHONG duoc tu nang plan/role: chan bang trigger o muc 7 ben duoi.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Chi admin duoc them/xoa ho so.
drop policy if exists profiles_admin_insert on public.profiles;
create policy profiles_admin_insert on public.profiles
  for insert to authenticated with check (public.is_admin());
drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete on public.profiles
  for delete to authenticated using (public.is_admin());

-- Thanh vien chi DOC quyen cua chinh minh. Ghi quyen = chi admin.
drop policy if exists entitlements_read_own on public.entitlements;
create policy entitlements_read_own on public.entitlements
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists entitlements_admin_write on public.entitlements;
create policy entitlements_admin_write on public.entitlements
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- 7. CHAN THANH VIEN TU NANG QUYEN ----------
-- Khong co cai nay thi hoc vien Free co the tu UPDATE plan='premium'.
create or replace function public.guard_profile_privilege()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  new.plan := old.plan;
  new.role := old.role;
  return new;
end $$;

drop trigger if exists trg_profiles_guard on public.profiles;
create trigger trg_profiles_guard
  before update on public.profiles
  for each row execute function public.guard_profile_privilege();

-- ---------- 8. HAM WEB GOI DE HOI "TOI DUOC XEM GI" ----------
-- Tra ve dung mot dong, web chi can goi 1 lan la biet mo bao nhieu.
create or replace function public.my_access()
returns table (
  user_id  uuid,
  email    text,
  full_name text,
  plan     text,
  role     text,
  products text[]
)
language sql
stable
security definer set search_path = public
as $$
  select
    p.id,
    p.email,
    p.full_name,
    p.plan,
    p.role,
    coalesce(
      array(
        select e.product_key from public.entitlements e
        where e.user_id = p.id
          and e.status = 'active'
          and (e.expires_at is null or e.expires_at > now())
      ),
      array[]::text[]
    )
  from public.profiles p
  where p.id = auth.uid();
$$;

grant execute on function public.my_access() to authenticated;

-- ============================================================
-- 9. VA LO HONG CU: GHI NOI DUNG = CHI ADMIN
-- Truoc day la "to authenticated" = MOI hoc vien deu ghi duoc.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['settings','products','services','tools','courses','articles','about']
  loop
    -- Bo qua bang chua ton tai (project trong / schema.sql chua chay) — khong loi.
    if to_regclass('public.'||t) is null then continue; end if;
    execute format('alter table public.%1$s enable row level security;', t);
    -- doc: ai cung doc duoc (web ngoai hien thi)
    execute format('drop policy if exists %1$s_read on public.%1$s;', t);
    execute format('create policy %1$s_read on public.%1$s for select using (true);', t);
    -- ghi: CHI admin
    execute format('drop policy if exists %1$s_write on public.%1$s;', t);
    execute format('create policy %1$s_write on public.%1$s for all
                    to authenticated using (public.is_admin())
                    with check (public.is_admin());', t);
  end loop;

  -- Bang nhay cam: hoc vien KHONG duoc dong vao
  foreach t in array array['orders','tickets']
  loop
    if to_regclass('public.'||t) is null then continue; end if;
    execute format('alter table public.%1$s enable row level security;', t);
    execute format('drop policy if exists %1$s_auth on public.%1$s;', t);
    execute format('drop policy if exists %1$s_admin on public.%1$s;', t);
    execute format('create policy %1$s_admin on public.%1$s for all
                    to authenticated using (public.is_admin())
                    with check (public.is_admin());', t);
  end loop;
end $$;

-- Bai hoc / tai san khoa hoc: doc duoc de hien danh muc, ghi chi admin.
do $$
declare t text;
begin
  foreach t in array array['course_lessons','course_assets']
  loop
    if to_regclass('public.'||t) is not null then
      execute format('drop policy if exists %1$s_write on public.%1$s;', t);
      execute format('create policy %1$s_write on public.%1$s for all
                      to authenticated using (public.is_admin())
                      with check (public.is_admin());', t);
    end if;
  end loop;
end $$;

-- Kho video: ghi chi admin (truoc day moi authenticated deu ghi/xoa duoc).
-- Boc trong DO...EXCEPTION: neu thieu quyen tren storage.objects thi BO QUA,
-- khong lam hong ca script (bang profiles van duoc tao).
do $$
begin
  drop policy if exists course_videos_auth_write on storage.objects;
  drop policy if exists course_videos_admin_write on storage.objects;
  create policy course_videos_admin_write on storage.objects
    for all to authenticated
    using (bucket_id = 'course-videos' and public.is_admin())
    with check (bucket_id = 'course-videos' and public.is_admin());
exception when others then
  raise notice 'Bo qua policy storage.objects (thieu quyen hoac chua co storage): %', sqlerrm;
end $$;

-- ============================================================
-- 10. TU TAY CAP QUYEN (chay khi can, thay email that vao)
-- ============================================================
-- Dat Founder lam admin (BAT BUOC chay 1 lan sau khi Founder dang ky tai khoan):
--   update public.profiles set role='admin', plan='premium'
--   where email = 'email-cua-founder@example.com';
--
-- Nang mot hoc vien len Premium toan tai khoan:
--   update public.profiles set plan='premium' where email = 'hocvien@example.com';
--
-- Cap quyen dung MOT san pham cho hoc vien:
--   insert into public.entitlements (user_id, product_key, granted_by)
--   select id, 'course:doanh-nghiep-mot-nguoi', 'founder' from public.profiles
--   where email = 'hocvien@example.com'
--   on conflict (user_id, product_key) do update set status='active', updated_at=now();
--
-- Thu hoi quyen:
--   update public.entitlements set status='revoked'
--   where product_key='course:doanh-nghiep-mot-nguoi'
--     and user_id = (select id from public.profiles where email='hocvien@example.com');
