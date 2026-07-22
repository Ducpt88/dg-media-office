-- ============================================================
-- DUCPT — BAO TELEGRAM KHI CO HOC VIEN MOI DANG KY
-- Chay trong: Supabase Dashboard > SQL Editor (project ducpt).
--
-- CACH DUNG:
--   1. Thay <BOT_TOKEN> = token bot Telegram (vd 123456:ABC-DEF...).
--   2. Thay <CHAT_ID>   = id chat/nhom nhan tin (vd 123456789 hoac -100xxxx cho nhom).
--   3. Bam Run.
--
-- Token nam TRONG database rieng cua ban, KHONG len repo cong khai.
-- Lay CHAT_ID: nhan tin bat ky cho bot -> mo
--   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates -> lay "chat":{"id":...}
-- ============================================================

-- pg_net: cho phep goi HTTP tu trong Postgres
create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_member()
returns trigger
language plpgsql
security definer set search_path = public, extensions
as $$
declare
  bot_token text := '<BOT_TOKEN>';
  chat_id   text := '<CHAT_ID>';
  msg text;
begin
  -- Chua dien token thi khong lam gi (tranh loi khi test).
  if bot_token = '<' || 'BOT_TOKEN' || '>' or chat_id = '<' || 'CHAT_ID' || '>' then
    return new;
  end if;

  msg := '🆕 HOC VIEN MOI DANG KY — DUCPT' || E'\n'
      || '👤 ' || coalesce(nullif(new.full_name,''),'(chua co ten)') || E'\n'
      || '📧 ' || coalesce(new.email,'') || E'\n'
      || '📱 ' || coalesce(nullif(new.contact,''),'(chua co SDT)') || E'\n'
      || '🎯 ' || coalesce(nullif(new.note,''),'(chua ghi nhu cau)') || E'\n'
      || '🌐 Nguon: ' || coalesce(nullif(new.source,''),'web') || ' · Goi: ' || new.plan;

  -- Goi Telegram (khong chan luong dang ky neu Telegram loi)
  begin
    perform net.http_post(
      url     := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
      headers := jsonb_build_object('Content-Type','application/json'),
      body    := jsonb_build_object('chat_id', chat_id, 'text', msg, 'disable_web_page_preview', true)
    );
  exception when others then
    raise notice 'Telegram notify loi (bo qua): %', sqlerrm;
  end;

  return new;
end $$;

drop trigger if exists trg_notify_new_member on public.profiles;
create trigger trg_notify_new_member
  after insert on public.profiles
  for each row execute function public.notify_new_member();

-- ============================================================
-- KIEM TRA NHANH (sau khi da dien token + chay o tren):
--   select net.http_post(
--     url := 'https://api.telegram.org/bot<BOT_TOKEN>/sendMessage',
--     headers := jsonb_build_object('Content-Type','application/json'),
--     body := jsonb_build_object('chat_id','<CHAT_ID>','text','Test DUCPT notify OK'));
-- Neu nhan duoc tin "Test DUCPT notify OK" la trigger se chay.
-- ============================================================
