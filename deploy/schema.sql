-- SolarTasker database schema (MariaDB 11.4 / MySQL compatible).
-- Derived from the queries in server/. Applied on every deploy by
-- deploy/server-deploy.sh; every statement is idempotent (IF NOT EXISTS),
-- so existing tables and data are never changed or dropped.
-- No foreign keys: the API checks references itself before deletes.

SET NAMES utf8mb4;

-- Dashboard users (login.js, Users/*, userAuth.js)
CREATE TABLE IF NOT EXISTS owners (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NULL,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hash
  role        VARCHAR(50)  NOT NULL DEFAULT 'Admin',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_owners_user_name (user_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Service areas; region maps to a weekday (REGION_DAY_MAPPING)
CREATE TABLE IF NOT EXISTS area_region (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  area        VARCHAR(255) NOT NULL,
  region      VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clients (
  id                     INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name                   VARCHAR(255)  NOT NULL,
  number                 VARCHAR(30)   NOT NULL,     -- WhatsApp number
  email                  VARCHAR(255)  NULL,
  address                TEXT          NULL,
  area_region_id         INT UNSIGNED  NULL,
  amount                 DECIMAL(12,2) NOT NULL DEFAULT 0,
  service_plan_duration  INT           NULL,         -- days between services
  plan                   TINYINT       NOT NULL DEFAULT 0,  -- 0 Basic, 1 Premium
  region_preference      TINYINT       NULL,         -- 1..6 = Mon..Sat
  last_service_date      DATE          NULL,
  upcoming_service_date  DATE          NULL,
  created_at             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_clients_area_region (area_region_id),
  KEY idx_clients_number (number),
  KEY idx_clients_upcoming (upcoming_service_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS workers (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(255) NOT NULL,
  number       VARCHAR(30)  NOT NULL,
  address      TEXT         NULL,
  cnic_number  VARCHAR(30)  NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_workers_number (number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- member1 is the team lead (gets WhatsApp messages)
CREATE TABLE IF NOT EXISTS team (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  team_name   VARCHAR(255) NULL,
  member1_id  INT UNSIGNED NOT NULL,
  member2_id  INT UNSIGNED NOT NULL,
  member3_id  INT UNSIGNED NULL,
  isactive    TINYINT      NOT NULL DEFAULT 0,   -- 0 = available (as used by the app)
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_team_members (member1_id, member2_id, member3_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- isactive: 0 = open/upcoming, 1 = closed
-- response (client): 0 none, 1 confirmed, 2 missed/declined
-- task_status (team): 0 pending ... 3 completed
CREATE TABLE IF NOT EXISTS tasks (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id         INT UNSIGNED NOT NULL,
  service_date      DATE         NOT NULL,
  team_id           INT UNSIGNED NULL,
  plan              TINYINT      NULL,
  response          TINYINT      NOT NULL DEFAULT 0,
  task_status       TINYINT      NOT NULL DEFAULT 0,
  isactive          TINYINT      NOT NULL DEFAULT 0,
  re_task_done      TINYINT      NOT NULL DEFAULT 0,
  whats_client_res  TINYINT      NOT NULL DEFAULT 0,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_client (client_id),
  KEY idx_tasks_team (team_id),
  KEY idx_tasks_service_date (service_date),
  KEY idx_tasks_active (isactive, response, task_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS feedback (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  task_id     INT UNSIGNED NOT NULL,
  rating      TINYINT      NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_feedback_task (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team status updates sent over WhatsApp (live tracking page)
CREATE TABLE IF NOT EXISTS tracking (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  task_id     INT UNSIGNED NOT NULL,
  status      TINYINT      NOT NULL,
  time_stamp  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tracking_task (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dashboard notifications (websocket); cleaned up by cron
CREATE TABLE IF NOT EXISTS notification (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  message     TEXT         NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notification_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
