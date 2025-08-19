CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'approver', 'admin')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS requests(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    document_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resubmitted')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    decided_by UUID REFERENCES users(id),
    decided_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_history(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    from_user UUID NOT NULL REFERENCES users(id),
    to_user UUID REFERENCES users(id),
    request_status TEXT CHECK (request_status IN ('initiated', 'delegate', 'approved', 'rejected', 'resubmitted')),
    remarks TEXT,
    action_time TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO users (name, email, password, role)
VALUES 
('Admin1','admin1@gmail.com','admin@123','admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password, role)
VALUES
('Approver1','approver@gmail.com','approver@123','approver')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password, role)
VALUES
('User1','user1@gmail.com','user@123','user')
ON CONFLICT (email) DO NOTHING;

-- category created by Admin1 if present
DO $$
DECLARE admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM users WHERE email='admin1@gmail.com';
  IF admin_id IS NOT NULL THEN
    INSERT INTO categories(title, isActive, created_by)
    VALUES ('Management Approval Note', true, admin_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Example request by User1
DO $$
DECLARE u UUID; c UUID; a UUID; rid UUID;
BEGIN
  SELECT id INTO u FROM users WHERE email='user1@gmail.com';
  SELECT id INTO c FROM categories LIMIT 1;
  SELECT id INTO a FROM users WHERE email='approver@gmail.com';
  IF u IS NOT NULL AND c IS NOT NULL THEN
    INSERT INTO requests (user_id, category_id, title, description, decided_by)
    VALUES (u, c, 'Request 1 title', 'Request 1 Desc', a)
    RETURNING id INTO rid;

    INSERT INTO request_history (request_id, from_user, to_user, request_status, remarks)
    VALUES (rid, u, NULL, 'initiated', 'Request created');
  END IF;
END $$;