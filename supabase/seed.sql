-- ============================================================
-- GainFile Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

insert into public.exercises (name, muscle_group, equipment, is_custom) values
  -- Pecho
  ('Press de Banca',              'chest',     'barbell',    false),
  ('Press de Banca Inclinado',    'chest',     'barbell',    false),
  ('Flexiones',                   'chest',     'bodyweight', false),
  ('Apertura con Mancuernas',     'chest',     'dumbbell',   false),
  ('Cruce de Cables',             'chest',     'cable',      false),
  -- Espalda
  ('Dominadas',                   'back',      'bodyweight', false),
  ('Remo con Barra',              'back',      'barbell',    false),
  ('Jalón al Pecho',              'back',      'machine',    false),
  ('Remo en Polea Baja',          'back',      'cable',      false),
  ('Peso Muerto',                 'back',      'barbell',    false),
  -- Hombros
  ('Press Militar',               'shoulders', 'barbell',    false),
  ('Elevaciones Laterales',       'shoulders', 'dumbbell',   false),
  ('Face Pull',                   'shoulders', 'cable',      false),
  ('Press Arnold',                'shoulders', 'dumbbell',   false),
  -- Brazos
  ('Curl de Bíceps con Barra',    'arms',      'barbell',    false),
  ('Curl Martillo',               'arms',      'dumbbell',   false),
  ('Extensión de Tríceps Polea',  'arms',      'cable',      false),
  ('Press Francés',               'arms',      'barbell',    false),
  -- Piernas
  ('Sentadilla',                  'legs',      'barbell',    false),
  ('Peso Muerto Rumano',          'legs',      'barbell',    false),
  ('Prensa de Piernas',           'legs',      'machine',    false),
  ('Zancadas',                    'legs',      'dumbbell',   false),
  ('Elevación de Talones',        'legs',      'machine',    false),
  -- Core
  ('Plancha',                     'core',      'bodyweight', false),
  ('Crunch Abdominal',            'core',      'bodyweight', false),
  ('Giro Ruso',                   'core',      'bodyweight', false)
on conflict do nothing;
