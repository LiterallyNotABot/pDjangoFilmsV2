CREATE TABLE Films (
    film_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT CHECK (release_year >= 1880 AND release_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    runtime INT CHECK (runtime >= 0),
    synopsis TEXT,
    budget BIGINT CHECK (budget >= 0),
    revenue BIGINT CHECK (revenue >= 0),
    status VARCHAR(255),
    tagline VARCHAR(255),
    awards_and_nominations VARCHAR(255),
    poster_url VARCHAR(255),
    backdrop_url VARCHAR(255),
    original_language VARCHAR(20),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(80) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE FilmsAndGenres (
    film_genre_id SERIAL PRIMARY KEY,
    film_id INT NOT NULL,
    genre_id INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_film FOREIGN KEY (film_id) REFERENCES Films(film_id),
    CONSTRAINT fk_genre FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);

CREATE TABLE FilmsRoles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Persons (
    person_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    biography TEXT,
    place_of_birth VARCHAR(255),
    birthday DATE,
    deathday DATE,
    picture_url VARCHAR(255),
    alias VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE FilmsAndPersons (
  record_id SERIAL PRIMARY KEY,
  person_id INT NOT NULL REFERENCES Persons(person_id),
  film_id INT NOT NULL REFERENCES Films(film_id),
  role_id INT NOT NULL REFERENCES FilmsRoles(role_id),
  character VARCHAR(255),
  display_order INT,
  active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE ProductionCompanies (
  company_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  origin_country VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE FilmsAndProductionCompanies (
  record_id SERIAL PRIMARY KEY,
  film_id INT NOT NULL,
  company_id INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (film_id) REFERENCES Films(film_id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES ProductionCompanies(company_id) ON DELETE CASCADE
);

CREATE TABLE Countries (
  country_id SERIAL PRIMARY KEY,
  country_name VARCHAR(255) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE FilmsAndCountries (
  record_id SERIAL PRIMARY KEY,
  film_id INT NOT NULL,
  country_id INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_film FOREIGN KEY (film_id) REFERENCES Films(film_id) ON DELETE CASCADE,
  CONSTRAINT fk_country FOREIGN KEY (country_id) REFERENCES Countries(country_id) ON DELETE CASCADE
);

CREATE TABLE Languages (
  language_id SERIAL PRIMARY KEY,
  language_name VARCHAR(255) NOT NULL UNIQUE,
  iso_639_1 VARCHAR(10) NOT NULL UNIQUE,  -- Código ISO 639-1 para el idioma
  active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE FilmsAndLanguages (
  record_id SERIAL PRIMARY KEY,
  film_id INT NOT NULL,
  language_id INT NOT NULL,
  original_language BOOLEAN DEFAULT FALSE,  -- Indica si el idioma es el original
  active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_film FOREIGN KEY (film_id) REFERENCES Films(film_id) ON DELETE CASCADE,
  CONSTRAINT fk_language FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);



--------------
ALTER TABLE Films
DROP COLUMN original_language;
--------------

CREATE TABLE Ratings (
    pk SERIAL PRIMARY KEY,
    rating_value DECIMAL(2, 1) NOT NULL CHECK (rating_value >= 0.5 AND rating_value <= 5),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Lists (
    list_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    list_name VARCHAR(100) NOT NULL,
    list_description TEXT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE Lists
RENAME COLUMN date TO date_of_creation;

CREATE TABLE Watchlists (
    entry_id SERIAL PRIMARY KEY,
    film_id INT NOT NULL REFERENCES Films(film_id),
    user_id INT NOT NULL REFERENCES auth_user(id),
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE ListsAndFilms (
    list_film_id SERIAL PRIMARY KEY,
    list_id INT NOT NULL REFERENCES Lists(list_id),
    film_id INT NOT NULL REFERENCES Films(film_id),
    sort_order INT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT unique_sort_order UNIQUE (list_id, film_id, sort_order)
);

CREATE TABLE FilmsAndUsers (
    film_and_user_id SERIAL PRIMARY KEY,         -- ID único de la relación
    film_id INT NOT NULL,                        -- ID de la película
    user_id INT NOT NULL,                        -- ID del usuario
    rating_id INT,                               -- ID de la calificación, puede ser nulo
    watched BOOLEAN NOT NULL DEFAULT TRUE,       -- Indica si el usuario ha visto la película
    liked BOOLEAN NOT NULL DEFAULT FALSE,        -- Indica si al usuario le gustó la película
    active BOOLEAN NOT NULL DEFAULT TRUE,        -- Estado de la relación (activo/inactivo)
    deleted BOOLEAN NOT NULL DEFAULT FALSE,      -- Estado de eliminación (lógica)
    FOREIGN KEY (film_id) REFERENCES Films(film_id) ON DELETE CASCADE,    -- Relación con la tabla de películas
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,     -- Relación con la tabla de usuarios (Django)
    FOREIGN KEY (rating_id) REFERENCES Ratings(pk) ON DELETE SET NULL     -- Relación con la tabla de ratings, y se permite que sea nulo
);

CREATE TABLE Logs (
    log_id SERIAL PRIMARY KEY,            -- ID único del log
    film_id INT NOT NULL,                 -- ID de la película (clave foránea)
    user_id INT NOT NULL,                 -- ID del usuario (clave foránea)
    rating_id INT,                        -- ID de la calificación (clave foránea)
    liked BOOLEAN NOT NULL DEFAULT FALSE, -- Si le gustó la película (por defecto FALSE)
    entry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora del log (por defecto la actual)
    active BOOLEAN NOT NULL DEFAULT TRUE, -- Estado del log, si está activo (por defecto TRUE)
    deleted BOOLEAN NOT NULL DEFAULT FALSE, -- Estado de eliminación lógica, por defecto FALSE
    FOREIGN KEY (film_id) REFERENCES Films(film_id) ON DELETE CASCADE, -- Relación con la tabla Films
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE, -- Relación con la tabla de usuarios de Django
    FOREIGN KEY (rating_id) REFERENCES Ratings(pk) ON DELETE SET NULL -- Relación con la tabla Ratings
);

CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,       -- ID único de la reseña
    log_id INT NOT NULL,                -- Clave foránea que hace referencia a la tabla Logs
    FOREIGN KEY (log_id) REFERENCES Logs(log_id) ON DELETE CASCADE, -- Relación con la tabla Logs
    
    active BOOLEAN NOT NULL DEFAULT TRUE, -- Campo para activar o desactivar el registro
    deleted BOOLEAN NOT NULL DEFAULT FALSE -- Campo para marcar si el registro está eliminado
);

CREATE TABLE ReviewsAndLikesByUser (
    like_id SERIAL PRIMARY KEY,          -- ID único para el like
    log_id INT NOT NULL,                 -- Clave foránea que hace referencia a la tabla Logs
    user_id INT NOT NULL,                -- ID del usuario que ha dado el like
    FOREIGN KEY (log_id) REFERENCES Logs(log_id) ON DELETE CASCADE, -- Relación con la tabla Logs
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE, -- Relación con la tabla de usuarios de Django

    active BOOLEAN NOT NULL DEFAULT TRUE, -- Campo para activar o desactivar el registro
    deleted BOOLEAN NOT NULL DEFAULT FALSE -- Campo para marcar si el registro está eliminado
);

CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    film_id INT NOT NULL,
    parent_comment_id INT DEFAULT NULL,
    body TEXT NOT NULL,  -- Campo para texto, incluyendo emojis
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE, -- Conecta con la tabla de usuarios
    FOREIGN KEY (film_id) REFERENCES Films(film_id) ON DELETE CASCADE, -- Conecta con la tabla de películas
    FOREIGN KEY (parent_comment_id) REFERENCES Comments(comment_id) ON DELETE CASCADE -- Auto-referencia para los comentarios
);

CREATE TABLE CommentsAndLikesByUser (
    like_id SERIAL PRIMARY KEY,  -- Clave primaria auto_increment
    comment_id INT NOT NULL,     -- Clave foránea que hace referencia al comentario
    user_id INT NOT NULL,        -- Clave foránea que hace referencia al usuario
    FOREIGN KEY (comment_id) REFERENCES Comments(comment_id) ON DELETE CASCADE,  -- Relación con la tabla Comments
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,            -- Relación con la tabla de usuarios
    active BOOLEAN NOT NULL DEFAULT TRUE,  -- Estado de la relación (activo o no)
    deleted BOOLEAN NOT NULL DEFAULT FALSE -- Marca si está eliminado
);

CREATE TABLE Followers (
    record_id SERIAL PRIMARY KEY,
    follower_id INT NOT NULL,  -- ID del usuario que sigue
    followed_id INT NOT NULL,  -- ID del usuario seguido
    date_followed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Fecha en que se realiza el seguimiento
    active BOOLEAN NOT NULL DEFAULT TRUE,  -- Para marcar si el registro está activo
    deleted BOOLEAN NOT NULL DEFAULT FALSE,  -- Para marcar si el registro ha sido eliminado
    FOREIGN KEY (follower_id) REFERENCES auth_user(id),  -- Relación con la tabla de usuarios (puedes ajustar el nombre de la tabla si es diferente)
    FOREIGN KEY (followed_id) REFERENCES auth_user(id)  -- Relación con la tabla de usuarios (puedes ajustar el nombre de la tabla si es diferente)
);

CREATE TABLE ListsAndLikesByUsers (
    like_id SERIAL PRIMARY KEY,  -- Clave primaria autoincremental
    user_id INT NOT NULL,  -- ID del usuario que le da like a la lista
    list_id INT NOT NULL,  -- ID de la lista a la que se le da like
    active BOOLEAN NOT NULL DEFAULT TRUE,  -- Para marcar si el registro está activo
    deleted BOOLEAN NOT NULL DEFAULT FALSE,  -- Para marcar si el registro ha sido eliminado
    FOREIGN KEY (user_id) REFERENCES auth_user(id),  -- Relación con la tabla de usuarios
    FOREIGN KEY (list_id) REFERENCES Lists(list_id)  -- Relación con la tabla de listas
);

CREATE TABLE PrivateConversation (
    conversation_id SERIAL PRIMARY KEY,
    creator_id INT NOT NULL,
    target_id INT NOT NULL,
    subject VARCHAR(255),
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (creator_id) REFERENCES auth_user(id),
    FOREIGN KEY (target_id) REFERENCES auth_user(id)
);

CREATE TABLE PrivateMessages (
    message_id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    date_sent TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (conversation_id) REFERENCES PrivateConversation(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES auth_user(id)
);



