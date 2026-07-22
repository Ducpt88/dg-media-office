-- ============================================================
-- DUCPT — GHI LAI "HOC VIEN DANG KY KHOA/CLIP NAO"
-- Founder yeu cau 2026-07-22: bang Khach hang phai hien ca khoa hoc ma
-- thanh vien do dang ky, khong chi ten + email.
--
-- Chay MOT lan trong: Supabase Dashboard > SQL Editor > New query > Run.
-- An toan chay lai nhieu lan (idempotent), khong lam mat du lieu cu.
-- ============================================================

-- 1. Them 2 cot moi (khong dung du lieu dang co)
alter table public.profiles add column if not exists signup_product_key text;
alter table public.profiles add column if not exists signup_product     text;

-- 2. Trigger tao ho so: chep them khoa hoc tu thong tin dang ky gui len
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, contact, note, source,
    signup_product_key, signup_product
  )
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'full_name',''),
    nullif(new.raw_user_meta_data->>'contact',''),
    nullif(new.raw_user_meta_data->>'note',''),
    nullif(new.raw_user_meta_data->>'source',''),
    nullif(new.raw_user_meta_data->>'product_key',''),
    nullif(new.raw_user_meta_data->>'product','')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Va lai cho nhung nguoi DA dang ky truoc khi co 2 cot nay:
--    lay nguoc tu thong tin dang ky con luu trong auth.users.
update public.profiles p
set signup_product_key = coalesce(p.signup_product_key, nullif(u.raw_user_meta_data->>'product_key','')),
    signup_product     = coalesce(p.signup_product,     nullif(u.raw_user_meta_data->>'product',''))
from auth.users u
where u.id = p.id
  and (p.signup_product_key is null or p.signup_product is null);

-- 4. Cho nguoi dang ky tu trang khoa hoc ma chua co nhan khoa: dat theo nguon
update public.profiles
set signup_product_key = 'course:doanh-nghiep-mot-nguoi',
    signup_product     = 'Doanh nghiệp một người'
where signup_product_key is null
  and source in ('khoa-hoc','course-student-form');

-- 5. Kiem tra ket qua (chay xong nhin bang nay la biet da an chua)
select email, full_name, contact, signup_product, source, plan, role, created_at
from public.profiles
order by created_at desc;
