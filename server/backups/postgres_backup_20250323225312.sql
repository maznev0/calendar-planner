--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3 (Debian 17.3-1.pgdg120+1)
-- Dumped by pg_dump version 17.3 (Debian 17.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cars (
    driver_id uuid NOT NULL,
    color character varying(7) NOT NULL,
    carname character varying(20) NOT NULL,
    chat_id bigint NOT NULL
);


ALTER TABLE public.cars OWNER TO postgres;

--
-- Name: order_workers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_workers (
    order_id uuid NOT NULL,
    worker_id uuid NOT NULL,
    worker_payment integer NOT NULL
);


ALTER TABLE public.order_workers OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_date date,
    order_address character varying(50) NOT NULL,
    phone_number character varying(13) NOT NULL,
    meters numeric(6,2) NOT NULL,
    price integer NOT NULL,
    driver_id uuid,
    note text,
    order_state character varying(19) NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    order_id uuid NOT NULL,
    driver_id uuid,
    total_price integer NOT NULL,
    driver_price integer NOT NULL,
    polish integer NOT NULL,
    other_price integer NOT NULL,
    profit integer NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(18) DEFAULT 'UNKNOW USER'::character varying NOT NULL,
    user_role character varying(6) DEFAULT 'ANONYM'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cars (driver_id, color, carname, chat_id) FROM stdin;
15f2b755-bd7f-4dc6-8dca-9c625c4e7932	#EA0004	Saab 9-5	558742720
52a0ddc2-f9f9-4aa8-831c-dc9eba5a8ff8	#006DEA	Polo	589647231
ed498545-36ca-4828-bbf4-f690689a5345	#EA8D00	Tesla	258098745
\.


--
-- Data for Name: order_workers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_workers (order_id, worker_id, worker_payment) FROM stdin;
be5d0d66-ca31-4fc0-bfe3-2e626ae11a3e	90d24b1c-904e-4364-9a98-7508af491700	55
be5d0d66-ca31-4fc0-bfe3-2e626ae11a3e	7a0fe67a-4113-4bc2-b832-2e1f9532fcd4	55
be5d0d66-ca31-4fc0-bfe3-2e626ae11a3e	f02b973c-f68f-4b25-80b5-e5f1d32e1972	55
583260f7-0691-48f6-9a54-f7bfa5661ab7	90d24b1c-904e-4364-9a98-7508af491700	0
583260f7-0691-48f6-9a54-f7bfa5661ab7	e1e65dcd-3268-4856-9dbe-91afed6947c3	0
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_date, order_address, phone_number, meters, price, driver_id, note, order_state) FROM stdin;
be5d0d66-ca31-4fc0-bfe3-2e626ae11a3e	2025-03-22	Левкова 67-10	+375253699635	70.00	40	15f2b755-bd7f-4dc6-8dca-9c625c4e7932	проверка	Готов
154b352c-a94d-4dec-bd1a-26a4765a4a8c	2025-04-02	влада	+375548	100.00	50	15f2b755-bd7f-4dc6-8dca-9c625c4e7932		Отправлено
583260f7-0691-48f6-9a54-f7bfa5661ab7	2025-03-19	Лидская 90-89	+375442563696	50.00	55	52a0ddc2-f9f9-4aa8-831c-dc9eba5a8ff8		Ожидает отправления
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (order_id, driver_id, total_price, driver_price, polish, other_price, profit) FROM stdin;
583260f7-0691-48f6-9a54-f7bfa5661ab7	52a0ddc2-f9f9-4aa8-831c-dc9eba5a8ff8	0	0	0	0	0
be5d0d66-ca31-4fc0-bfe3-2e626ae11a3e	15f2b755-bd7f-4dc6-8dca-9c625c4e7932	2800	55	5	20	2560
154b352c-a94d-4dec-bd1a-26a4765a4a8c	15f2b755-bd7f-4dc6-8dca-9c625c4e7932	0	0	0	0	0
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schema_migrations (version, dirty) FROM stdin;
2	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, user_role) FROM stdin;
2297600c-fba5-441c-89a2-eb10e980f031	Николай	worker
384ce5f8-4a95-41b0-aa8c-9c093f074c3a	Кирилл	worker
7a0fe67a-4113-4bc2-b832-2e1f9532fcd4	Александр	worker
90d24b1c-904e-4364-9a98-7508af491700	Кирилл	worker
e1e65dcd-3268-4856-9dbe-91afed6947c3	Николай	worker
f02b973c-f68f-4b25-80b5-e5f1d32e1972	Петр	worker
723a68d0-9b7f-4c3d-a939-0b4b2176be89	Леонид	worker
ed498545-36ca-4828-bbf4-f690689a5345	Никита	driver
15f2b755-bd7f-4dc6-8dca-9c625c4e7932	Влад	driver
f6d0dc01-888e-4dc7-b2f3-86b8260a7869	Виктор	worker
52a0ddc2-f9f9-4aa8-831c-dc9eba5a8ff8	Вадим	driver
\.


--
-- Name: cars cars_chat_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_chat_id_key UNIQUE (chat_id);


--
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (driver_id);


--
-- Name: order_workers order_workers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_workers
    ADD CONSTRAINT order_workers_pkey PRIMARY KEY (order_id, worker_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (order_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cars cars_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_workers order_workers_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_workers
    ADD CONSTRAINT order_workers_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_workers order_workers_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_workers
    ADD CONSTRAINT order_workers_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: orders orders_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

