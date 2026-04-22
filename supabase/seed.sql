-- CockRoach default profiles. Run AFTER schema.sql.
-- Idempotent: re-running refreshes names/avatars without creating duplicates.
--
-- UUIDs are fixed (1111.../2222.../3333.../4444...) so the client store and
-- DB stay in lockstep. Avatars reference files in public/profiles/.

insert into public.users (id, name, email, avatar) values
  ('11111111-1111-1111-1111-111111111111', 'DagnA',     'angad@email.com',            '/profiles/DagnA.png'),
  ('22222222-2222-2222-2222-222222222222', 'Subi',      'shbhsingh25@gmail.com',      '/profiles/Subi.png'),
  ('33333333-3333-3333-3333-333333333333', 'ManU',      'abhi.prabal@gmail.com',      '/profiles/ManU.png'),
  ('44444444-4444-4444-4444-444444444444', 'Gill Saab', 'singhgillaakriti@gmail.com', '/profiles/Gill.png')
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  avatar = excluded.avatar;
