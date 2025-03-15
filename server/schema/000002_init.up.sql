/*
    CREATE TABLES
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE USERS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(18) NOT NULL DEFAULT 'UNKNOW USER',
    user_role VARCHAR(6) NOT NULL DEFAULT 'ANONYM'
);

CREATE TABLE ORDERS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_date DATE,
    order_address VARCHAR(50) NOT NULL,
    phone_number VARCHAR(13) NOT NULL,
    meters DECIMAL(6,2) NOT NULL,
    price INT NOT NULL,
    driver_id UUID,
    note TEXT,
    order_state VARCHAR(18) NOT NULL,

    FOREIGN KEY (driver_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE TABLE ORDER_WORKERS (
    order_id UUID NOT NULL,
    worker_id UUID NOT NULL,
    worker_payment INT NOT NULL,
    
    PRIMARY KEY (order_id, worker_id),
    FOREIGN KEY (order_id) REFERENCES ORDERS(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE TABLE PAYMENTS (
    order_id UUID PRIMARY KEY,
    driver_id UUID NOT NULL,
    total_price INT NOT NULL,
    driver_price INT NOT NULL,
    polish INT NOT NULL,
    other_price INT NOT NULL,

    FOREIGN KEY (order_id) REFERENCES ORDERS(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE TABLE CARS (
    driver_id UUID PRIMARY KEY,
    color VARCHAR(7) NOT NULL,
    carname VARCHAR(20) NOT NULL,
    chat_id BIGINT UNIQUE,
    telegram_id BIGINT UNIQUE NOT NULL,

    FOREIGN KEY (driver_id) REFERENCES USERS(id) ON DELETE CASCADE
);