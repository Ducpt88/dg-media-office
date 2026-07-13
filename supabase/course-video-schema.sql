-- ============================================================
-- DUCPT Passport - course lessons, videos, and assets
-- Run after supabase/schema.sql in Supabase SQL Editor.
-- ============================================================

create table if not exists public.course_lessons (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  lesson_no   int not null default 1,
  title       text not null,
  objective   text,
  outline     text,
  status      text not null default 'draft',
  duration_seconds numeric,
  sort        int not null default 0,
  updated_at  timestamptz not null default now(),
  unique(course_id, lesson_no)
);

create table if not exists public.course_assets (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid references public.courses(id) on delete cascade,
  lesson_id   uuid references public.course_lessons(id) on delete set null,
  asset_type  text not null default 'video',
  title       text not null,
  file_name   text,
  mime_type   text,
  file_size   bigint,
  storage_bucket text default 'course-videos',
  storage_path   text,
  public_url     text,
  duration_seconds numeric,
  thumbnail_url text,
  status      text not null default 'draft',
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index if not exists course_assets_course_storage_path_idx
on public.course_assets(course_id, storage_path)
where storage_path is not null;

do $$
declare t text;
begin
  foreach t in array array['course_lessons','course_assets']
  loop
    execute format('drop trigger if exists trg_%1$s_upd on public.%1$s;', t);
    execute format('create trigger trg_%1$s_upd before update on public.%1$s
                    for each row execute function public.set_updated_at();', t);
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

drop policy if exists course_lessons_read on public.course_lessons;
create policy course_lessons_read on public.course_lessons for select using (true);
drop policy if exists course_lessons_write on public.course_lessons;
create policy course_lessons_write on public.course_lessons for all
  to authenticated using (true) with check (true);

drop policy if exists course_assets_read on public.course_assets;
create policy course_assets_read on public.course_assets for select using (true);
drop policy if exists course_assets_write on public.course_assets;
create policy course_assets_write on public.course_assets for all
  to authenticated using (true) with check (true);

-- Storage bucket for videos. If you want paid/private courses,
-- make this bucket private and serve signed URLs from your backend.
insert into storage.buckets (id, name, public)
values ('course-videos', 'course-videos', true)
on conflict (id) do nothing;

drop policy if exists course_videos_public_read on storage.objects;
create policy course_videos_public_read on storage.objects
for select using (bucket_id = 'course-videos');

drop policy if exists course_videos_auth_write on storage.objects;
create policy course_videos_auth_write on storage.objects
for all to authenticated
using (bucket_id = 'course-videos')
with check (bucket_id = 'course-videos');
