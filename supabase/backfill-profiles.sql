-- ============================================================
-- DUCPT — KEO BU HO SO CHO TAI KHOAN DA DANG KY MA THIEU dong profiles
-- Chay trong: Supabase Dashboard > SQL Editor > New query > Run
--
-- Vi sao can: nhung tai khoan tao TU SOM (truoc khi gan trigger handle_new_user)
-- co trong auth.users nhung CHUA co dong trong public.profiles, nen danh sach
-- quan tri (doc tu profiles) khong hien. Cau lenh nay tao dong profiles con thieu.
-- An toan: chi INSERT dong CON THIEU, khong dung toi dong da co.
-- ============================================================
insert into public.profiles (id, email, full_name, contact, note, source)
select
  u.id,
  u.email,
  nullif(u.raw_user_meta_data->>'full_name',''),
  nullif(u.raw_user_meta_data->>'contact',''),
  nullif(u.raw_user_meta_data->>'note',''),
  coalesce(nullif(u.raw_user_meta_data->>'source',''), 'backfill')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- Xem lai tong so ho so sau khi keo bu:
-- select count(*) as tong_ho_so from public.profiles;
