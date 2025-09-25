--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (PGlite 0.2.0)
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: embeddings; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.embeddings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding public.vector(384) NOT NULL
);


ALTER TABLE meta.embeddings OWNER TO postgres;

--
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.embeddings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.embeddings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migrations (
    version text NOT NULL,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migrations OWNER TO postgres;

--
-- Name: antecedentes_penales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedentes_penales (
    id bigint NOT NULL,
    usuario_id bigint,
    descripcion text NOT NULL,
    fecha_registro timestamp with time zone DEFAULT now(),
    gravedad text NOT NULL
);


ALTER TABLE public.antecedentes_penales OWNER TO postgres;

--
-- Name: antecedentes_penales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.antecedentes_penales ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.antecedentes_penales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: calificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calificaciones (
    id bigint NOT NULL,
    usuario_id bigint,
    viaje_id bigint,
    calificacion numeric,
    comentario text,
    fecha timestamp with time zone DEFAULT now(),
    CONSTRAINT calificaciones_calificacion_check CHECK (((calificacion >= (0)::numeric) AND (calificacion <= (5)::numeric)))
);


ALTER TABLE public.calificaciones OWNER TO postgres;

--
-- Name: calificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.calificaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.calificaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historial_servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_servicios (
    id bigint NOT NULL,
    usuario_id bigint,
    servicio text NOT NULL,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE public.historial_servicios OWNER TO postgres;

--
-- Name: historial_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historial_servicios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historial_servicios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historial_viajes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_viajes (
    id bigint NOT NULL,
    usuario_id bigint,
    viaje_id bigint,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE public.historial_viajes OWNER TO postgres;

--
-- Name: historial_viajes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historial_viajes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historial_viajes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mensajes_chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mensajes_chats (
    id bigint NOT NULL,
    usuario_id bigint,
    contenido text NOT NULL,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE public.mensajes_chats OWNER TO postgres;

--
-- Name: mensajes_chats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.mensajes_chats ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.mensajes_chats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: metodos_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodos_pago (
    id bigint NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public.metodos_pago OWNER TO postgres;

--
-- Name: metodos_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.metodos_pago ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.metodos_pago_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id bigint NOT NULL,
    usuario_id bigint,
    mensaje text NOT NULL,
    leido boolean DEFAULT false,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.notificaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notificaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ofertas_tarifas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ofertas_tarifas (
    id bigint NOT NULL,
    descripcion text NOT NULL,
    tipo text NOT NULL,
    valor numeric NOT NULL,
    fecha_inicio timestamp with time zone NOT NULL,
    fecha_fin timestamp with time zone NOT NULL,
    estado text DEFAULT 'activo'::text NOT NULL
);


ALTER TABLE public.ofertas_tarifas OWNER TO postgres;

--
-- Name: ofertas_tarifas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ofertas_tarifas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ofertas_tarifas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id bigint NOT NULL,
    viaje_id bigint,
    monto numeric NOT NULL,
    metodo_pago text NOT NULL,
    fecha_pago timestamp with time zone DEFAULT now(),
    metodo_pago_id bigint
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pagos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: puntos_usuarios_conductores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puntos_usuarios_conductores (
    id bigint NOT NULL,
    usuario_id bigint,
    puntos integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.puntos_usuarios_conductores OWNER TO postgres;

--
-- Name: puntos_usuarios_conductores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.puntos_usuarios_conductores ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.puntos_usuarios_conductores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: rutas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rutas (
    id bigint NOT NULL,
    ubicacion_inicio text NOT NULL,
    ubicacion_fin text NOT NULL,
    distancia_km numeric NOT NULL,
    trafico text,
    rutas_alternativas text
);


ALTER TABLE public.rutas OWNER TO postgres;

--
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rutas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.routes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipos_vehiculo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_vehiculo (
    id bigint NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public.tipos_vehiculo OWNER TO postgres;

--
-- Name: tipos_vehiculo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipos_vehiculo ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipos_vehiculo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: viajes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.viajes (
    id bigint NOT NULL,
    usuario_id bigint,
    vehiculo_id bigint,
    ruta_id bigint,
    hora_inicio timestamp with time zone DEFAULT now(),
    hora_fin timestamp with time zone,
    estado text DEFAULT 'active'::text NOT NULL,
    tarifa_dinamica numeric,
    calificacion numeric,
    CONSTRAINT viajes_calificacion_check CHECK (((calificacion >= (0)::numeric) AND (calificacion <= (5)::numeric)))
);


ALTER TABLE public.viajes OWNER TO postgres;

--
-- Name: trips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.viajes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.trips_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    nombre text NOT NULL,
    correo text NOT NULL,
    contrasena text NOT NULL,
    rol_id bigint,
    verificacion_antecedentes text NOT NULL,
    estado text DEFAULT 'pending'::text NOT NULL,
    contacto_emergencia text,
    calificacion_promedio numeric,
    comentarios text,
    CONSTRAINT usuarios_calificacion_promedio_check CHECK (((calificacion_promedio >= (0)::numeric) AND (calificacion_promedio <= (5)::numeric)))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    id bigint NOT NULL,
    tipo text NOT NULL,
    placa text NOT NULL,
    usuario_id bigint,
    marca text,
    modelo text,
    ano integer,
    fotos text[],
    tipo_vehiculo_id bigint
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vehiculos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vehicles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: meta; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: meta; Owner: postgres
--

INSERT INTO meta.migrations VALUES ('202407160001', 'embeddings', '2025-09-09 19:11:07.404+00');


--
-- Data for Name: antecedentes_penales; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.antecedentes_penales OVERRIDING SYSTEM VALUE VALUES (1, 2, 'Conducción bajo influencia de alcohol', '2025-09-09 20:09:19.711+00', 'Moderada');
INSERT INTO public.antecedentes_penales OVERRIDING SYSTEM VALUE VALUES (2, 3, 'Robo menor', '2025-09-09 20:09:19.711+00', 'Leve');


--
-- Data for Name: calificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: historial_servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: historial_viajes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mensajes_chats; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: metodos_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.metodos_pago OVERRIDING SYSTEM VALUE VALUES (1, 'Tarjeta de crédito');
INSERT INTO public.metodos_pago OVERRIDING SYSTEM VALUE VALUES (2, 'Tarjeta de débito');
INSERT INTO public.metodos_pago OVERRIDING SYSTEM VALUE VALUES (3, 'Efectivo');
INSERT INTO public.metodos_pago OVERRIDING SYSTEM VALUE VALUES (4, 'PayPal');
INSERT INTO public.metodos_pago OVERRIDING SYSTEM VALUE VALUES (5, 'Transferencia bancaria');


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ofertas_tarifas; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pagos OVERRIDING SYSTEM VALUE VALUES (1, 1, 15.00, 'credit card', '2025-09-09 20:02:24.625+00', 1);


--
-- Data for Name: puntos_usuarios_conductores; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (1, 'admin');
INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (2, 'driver');
INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (3, 'passenger');


--
-- Data for Name: rutas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rutas OVERRIDING SYSTEM VALUE VALUES (1, 'Location A', 'Location B', 10.5, 'Moderado', 'Ruta C, Ruta D');


--
-- Data for Name: tipos_vehiculo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipos_vehiculo OVERRIDING SYSTEM VALUE VALUES (1, 'Sedán');
INSERT INTO public.tipos_vehiculo OVERRIDING SYSTEM VALUE VALUES (2, 'SUV');
INSERT INTO public.tipos_vehiculo OVERRIDING SYSTEM VALUE VALUES (3, 'Camioneta');
INSERT INTO public.tipos_vehiculo OVERRIDING SYSTEM VALUE VALUES (4, 'Motocicleta');


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios OVERRIDING SYSTEM VALUE VALUES (1, 'Admin User', 'admin@via.com', 'securepassword', 1, 'clear', 'active', '1234567890', NULL, NULL);
INSERT INTO public.usuarios OVERRIDING SYSTEM VALUE VALUES (3, 'Passenger User', 'passenger@via.com', 'securepassword', 3, 'clear', 'active', '1122334455', NULL, NULL);
INSERT INTO public.usuarios OVERRIDING SYSTEM VALUE VALUES (2, 'Driver User', 'driver@via.com', 'securepassword', 2, 'clear', 'active', '0987654321', 4.5, 'Excelente conductor');


--
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vehiculos OVERRIDING SYSTEM VALUE VALUES (1, 'car', 'ABC123', 2, 'Toyota', 'Corolla', 2018, NULL, 1);
INSERT INTO public.vehiculos OVERRIDING SYSTEM VALUE VALUES (2, 'motorcycle', 'XYZ789', 2, NULL, NULL, NULL, NULL, 2);


--
-- Data for Name: viajes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.viajes OVERRIDING SYSTEM VALUE VALUES (1, 3, 1, 1, '2025-09-09 20:02:24.625+00', NULL, 'active', 1.2, 5);


--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.embeddings_id_seq', 1, false);


--
-- Name: antecedentes_penales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.antecedentes_penales_id_seq', 33, true);


--
-- Name: calificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calificaciones_id_seq', 1, false);


--
-- Name: historial_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_servicios_id_seq', 1, false);


--
-- Name: historial_viajes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_viajes_id_seq', 1, false);


--
-- Name: mensajes_chats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mensajes_chats_id_seq', 1, false);


--
-- Name: metodos_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodos_pago_id_seq', 33, true);


--
-- Name: notificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificaciones_id_seq', 1, false);


--
-- Name: ofertas_tarifas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ofertas_tarifas_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 33, true);


--
-- Name: puntos_usuarios_conductores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.puntos_usuarios_conductores_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 33, true);


--
-- Name: routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.routes_id_seq', 33, true);


--
-- Name: tipos_vehiculo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_vehiculo_id_seq', 33, true);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trips_id_seq', 33, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 33, true);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 33, true);


--
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: antecedentes_penales antecedentes_penales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_penales
    ADD CONSTRAINT antecedentes_penales_pkey PRIMARY KEY (id);


--
-- Name: calificaciones calificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_pkey PRIMARY KEY (id);


--
-- Name: historial_servicios historial_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_servicios
    ADD CONSTRAINT historial_servicios_pkey PRIMARY KEY (id);


--
-- Name: historial_viajes historial_viajes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_viajes
    ADD CONSTRAINT historial_viajes_pkey PRIMARY KEY (id);


--
-- Name: mensajes_chats mensajes_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes_chats
    ADD CONSTRAINT mensajes_chats_pkey PRIMARY KEY (id);


--
-- Name: metodos_pago metodos_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodos_pago
    ADD CONSTRAINT metodos_pago_pkey PRIMARY KEY (id);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- Name: ofertas_tarifas ofertas_tarifas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ofertas_tarifas
    ADD CONSTRAINT ofertas_tarifas_pkey PRIMARY KEY (id);


--
-- Name: pagos payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: puntos_usuarios_conductores puntos_usuarios_conductores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puntos_usuarios_conductores
    ADD CONSTRAINT puntos_usuarios_conductores_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rutas routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rutas
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- Name: tipos_vehiculo tipos_vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_vehiculo
    ADD CONSTRAINT tipos_vehiculo_pkey PRIMARY KEY (id);


--
-- Name: viajes trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viajes
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: usuarios users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_email_key UNIQUE (correo);


--
-- Name: usuarios users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehiculos vehicles_license_plate_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehicles_license_plate_key UNIQUE (placa);


--
-- Name: vehiculos vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: antecedentes_penales antecedentes_penales_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedentes_penales
    ADD CONSTRAINT antecedentes_penales_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: calificaciones calificaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: calificaciones calificaciones_viaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificaciones
    ADD CONSTRAINT calificaciones_viaje_id_fkey FOREIGN KEY (viaje_id) REFERENCES public.viajes(id);


--
-- Name: historial_servicios historial_servicios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_servicios
    ADD CONSTRAINT historial_servicios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: historial_viajes historial_viajes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_viajes
    ADD CONSTRAINT historial_viajes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: historial_viajes historial_viajes_viaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_viajes
    ADD CONSTRAINT historial_viajes_viaje_id_fkey FOREIGN KEY (viaje_id) REFERENCES public.viajes(id);


--
-- Name: mensajes_chats mensajes_chats_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes_chats
    ADD CONSTRAINT mensajes_chats_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: notificaciones notificaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: pagos pagos_metodo_pago_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_metodo_pago_id_fkey FOREIGN KEY (metodo_pago_id) REFERENCES public.metodos_pago(id);


--
-- Name: pagos payments_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT payments_trip_id_fkey FOREIGN KEY (viaje_id) REFERENCES public.viajes(id);


--
-- Name: puntos_usuarios_conductores puntos_usuarios_conductores_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puntos_usuarios_conductores
    ADD CONSTRAINT puntos_usuarios_conductores_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: viajes trips_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viajes
    ADD CONSTRAINT trips_route_id_fkey FOREIGN KEY (ruta_id) REFERENCES public.rutas(id);


--
-- Name: viajes trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viajes
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: viajes trips_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viajes
    ADD CONSTRAINT trips_vehicle_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id);


--
-- Name: usuarios users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- Name: vehiculos vehicles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehicles_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: vehiculos vehiculos_tipo_vehiculo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_tipo_vehiculo_id_fkey FOREIGN KEY (tipo_vehiculo_id) REFERENCES public.tipos_vehiculo(id);


--
-- PostgreSQL database dump complete
--

