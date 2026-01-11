-- =========================
-- ROLES
-- =========================
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES
('reader'),
('author'),
('admin')
ON CONFLICT (name) DO NOTHING;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    date_of_birth DATE,
    gender VARCHAR(20),

    country VARCHAR(100),
    street VARCHAR(150),
    street_number VARCHAR(20),

    profile_image TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USER ROLES
-- =========================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

-- =========================
-- AUTHOR REQUESTS
-- =========================
CREATE TABLE IF NOT EXISTS author_requests (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- RECIPES
-- =========================
CREATE TABLE IF NOT EXISTS recipes (
    id BIGSERIAL PRIMARY KEY,

    author_id BIGINT NOT NULL,

    name VARCHAR(255) NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    prep_time INT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    servings INT NOT NULL,

    image TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- INGREDIENTS
-- =========================
CREATE TABLE IF NOT EXISTS ingredients (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- =========================
-- RECIPE INGREDIENTS
-- =========================
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,

    quantity VARCHAR(50) NOT NULL,

    PRIMARY KEY (recipe_id, ingredient_id),

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(id)
        ON DELETE CASCADE
);

-- =========================
-- RECIPE STEPS
-- =========================
CREATE TABLE IF NOT EXISTS recipe_steps (
    id BIGSERIAL PRIMARY KEY,

    recipe_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    description TEXT NOT NULL,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE
);

-- =========================
-- TAGS
-- =========================
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- =========================
-- RECIPE TAGS
-- =========================
CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    PRIMARY KEY (recipe_id, tag_id),

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

-- =========================
-- COMMENTS
-- =========================
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE
);

-- =========================
-- RATINGS
-- =========================
CREATE TABLE IF NOT EXISTS ratings (
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,

    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, recipe_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE
);

-- =========================
-- FAVORITES
-- =========================
CREATE TABLE IF NOT EXISTS favorites (
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, recipe_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE
);
