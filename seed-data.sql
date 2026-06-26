-- =============================================
-- NOVAIX FITNESS - Dados Iniciais
-- Execute DEPOIS do create-tables.sql
-- =============================================

-- Inserir treinos iniciais
INSERT INTO workouts (title, name, description, category, level, duration, video_id, equipment, exercises) VALUES
-- Musculação
('Peito e Tríceps', 'Peito e Tríceps', 'Treino focado em hipertrofia para peito e tríceps', 'Musculação', 'Intermediário', 50, 'dQw4w9WgXcQ', '["Barra", "Halteres", "Polia"]', '[
  {"name": "Supino Reto Barra", "sets": 4, "reps": 10, "rest": 60, "muscle": "Peito"},
  {"name": "Supino Inclinado Halteres", "sets": 4, "reps": 12, "rest": 45, "muscle": "Peito Superior"},
  {"name": "Crossover Polia", "sets": 3, "reps": 15, "rest": 30, "muscle": "Peito"},
  {"name": "Tríceps Pulley", "sets": 4, "reps": 12, "rest": 45, "muscle": "Tríceps"},
  {"name": "Tríceps Testa Barra", "sets": 3, "reps": 12, "rest": 45, "muscle": "Tríceps"}
]'),

('Costas e Bíceps', 'Costas e Bíceps', 'Treino para costas e bíceps', 'Musculação', 'Intermediário', 50, 'dQw4w9WgXcQ', '["Barra", "Halteres"]', '[
  {"name": "Puxada Alta", "sets": 4, "reps": 10, "rest": 60, "muscle": "Costas"},
  {"name": "Remada Curvada", "sets": 4, "reps": 10, "rest": 60, "muscle": "Costas"},
  {"name": "Rosca Direta", "sets": 3, "reps": 12, "rest": 45, "muscle": "Bíceps"},
  {"name": "Rosca Alternada", "sets": 3, "reps": 12, "rest": 45, "muscle": "Bíceps"}
]'),

('Pernas Completo', 'Pernas Completo', 'Treino completo de pernas', 'Musculação', 'Intermediário', 60, 'dQw4w9WgXcQ', '["Barra", "Máquina"]', '[
  {"name": "Agachamento Livre", "sets": 4, "reps": 10, "rest": 90, "muscle": "Quadríceps"},
  {"name": "Leg Press", "sets": 4, "reps": 12, "rest": 60, "muscle": "Quadríceps"},
  {"name": "Mesa Flexora", "sets": 3, "reps": 12, "rest": 45, "muscle": "Posteriores"},
  {"name": "Extensora", "sets": 3, "reps": 15, "rest": 30, "muscle": "Quadríceps"},
  {"name": "Gêmeos", "sets": 4, "reps": 20, "rest": 30, "muscle": "Panturrilha"}
]'),

-- Cardio
('HIIT Queima 30', 'HIIT Queima 30''', 'Treino intervalado de alta intensidade', 'Cardio', 'Avançado', 30, 'dQw4w9WgXcQ', '[]', '[
  {"name": "Burpee", "sets": 4, "reps": 10, "rest": 20, "muscle": "Corpo todo"},
  {"name": "Mountain Climber", "sets": 4, "reps": 20, "rest": 20, "muscle": "Core"},
  {"name": "Jumping Jack", "sets": 4, "reps": 30, "rest": 20, "muscle": "Cardio"},
  {"name": "Agachamento com Salto", "sets": 4, "reps": 15, "rest": 20, "muscle": "Pernas"}
]'),

('Cardio LISS 40', 'Cardio LISS 40''', 'Cardio de baixa intensidade para resistência', 'Cardio', 'Iniciante', 40, 'dQw4w9WgXcQ', '[]', '[
  {"name": "Caminhada Rápida", "sets": 1, "reps": 1, "rest": 0, "muscle": "Cardio"},
  {"name": "Corrida Leve", "sets": 1, "reps": 1, "rest": 0, "muscle": "Cardio"}
]'),

-- Calistenia
('Calistenia Básica', 'Calistenia Básica', 'Treino introdutório com peso corporal', 'Calistenia', 'Iniciante', 40, 'dQw4w9WgXcQ', '[]', '[
  {"name": "Flexão de Joelhos", "sets": 3, "reps": 10, "rest": 60, "muscle": "Peito"},
  {"name": "Agachamento Livre", "sets": 3, "reps": 15, "rest": 60, "muscle": "Pernas"},
  {"name": "Prancha", "sets": 3, "reps": 30, "rest": 45, "muscle": "Core"},
  {"name": "Australian Pull-up", "sets": 3, "reps": 8, "rest": 60, "muscle": "Costas"}
]'),

-- Flexibilidade
('Yoga Matinal', 'Yoga Matinal', 'Sessão de yoga para começar o dia', 'Flexibilidade', 'Iniciante', 35, 'dQw4w9WgXcQ', '["Tapete"]', '[
  {"name": "Saudação ao Sol", "sets": 3, "reps": 5, "rest": 15, "muscle": "Corpo todo"},
  {"name": "Postura da Cobra", "sets": 3, "reps": 10, "rest": 15, "muscle": "Lombar"},
  {"name": "Downward Dog", "sets": 3, "reps": 10, "rest": 15, "muscle": "Costas"}
]');
