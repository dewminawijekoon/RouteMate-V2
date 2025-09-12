-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.buses (
  bus_id character varying NOT NULL,
  bus_owner character varying,
  contact_number character varying,
  capacity integer,
  bus_type character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  route_id integer,
  CONSTRAINT buses_pkey PRIMARY KEY (bus_id),
  CONSTRAINT buses_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id)
);
CREATE TABLE public.lost_items (
  lost_item_id integer NOT NULL DEFAULT nextval('lost_items_lost_item_id_seq'::regclass),
  user_id integer,
  trip_id integer,
  item_name character varying,
  description text,
  item_category character varying,
  status character varying,
  lost_date timestamp without time zone,
  contact_info character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  lost_location character varying,
  CONSTRAINT lost_items_pkey PRIMARY KEY (lost_item_id),
  CONSTRAINT lost_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT lost_items_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id)
);
CREATE TABLE public.notifications (
  notification_id integer NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
  user_id integer,
  trip_id integer,
  notification_type character varying,
  title character varying,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  read_at timestamp without time zone,
  CONSTRAINT notifications_pkey PRIMARY KEY (notification_id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT notifications_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id)
);
CREATE TABLE public.routes (
  route_id integer NOT NULL DEFAULT nextval('routes_route_id_seq'::regclass),
  route_name character varying NOT NULL,
  stops jsonb,
  start_location jsonb,
  end_location jsonb,
  estimated_duration double precision,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT routes_pkey PRIMARY KEY (route_id)
);
CREATE TABLE public.sos_alerts (
  sos_id integer NOT NULL DEFAULT nextval('sos_alerts_sos_id_seq'::regclass),
  user_id integer,
  trip_id integer,
  alert_type character varying,
  message text,
  lat double precision,
  lng double precision,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  resolved_at timestamp without time zone,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  first_upvote_time timestamp without time zone,
  authority_notified boolean DEFAULT false,
  CONSTRAINT sos_alerts_pkey PRIMARY KEY (sos_id),
  CONSTRAINT sos_alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT sos_alerts_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id)
);
CREATE TABLE public.sos_votes (
  vote_id integer NOT NULL DEFAULT nextval('sos_votes_vote_id_seq'::regclass),
  sos_id integer,
  user_id integer,
  vote_type character varying CHECK (vote_type::text = ANY (ARRAY['upvote'::character varying, 'downvote'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT sos_votes_pkey PRIMARY KEY (vote_id),
  CONSTRAINT sos_votes_sos_id_fkey FOREIGN KEY (sos_id) REFERENCES public.sos_alerts(sos_id),
  CONSTRAINT sos_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.trips (
  trip_id integer NOT NULL DEFAULT nextval('trips_trip_id_seq'::regclass),
  route_id integer,
  bus_id character varying,
  current_lat double precision,
  current_lng double precision,
  crowd_level character varying CHECK (crowd_level::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying]::text[])),
  start_time timestamp without time zone,
  end_time timestamp without time zone,
  trip_status character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT trips_pkey PRIMARY KEY (trip_id),
  CONSTRAINT trips_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(route_id),
  CONSTRAINT trips_bus_id_fkey FOREIGN KEY (bus_id) REFERENCES public.buses(bus_id)
);
CREATE TABLE public.user_locations (
  location_id integer NOT NULL DEFAULT nextval('user_locations_location_id_seq'::regclass),
  user_id integer,
  trip_id integer,
  latitude double precision NOT NULL CHECK (latitude >= '-90'::integer::double precision AND latitude <= 90::double precision),
  longitude double precision NOT NULL CHECK (longitude >= '-180'::integer::double precision AND longitude <= 180::double precision),
  timestamp timestamp without time zone DEFAULT now(),
  CONSTRAINT user_locations_pkey PRIMARY KEY (location_id),
  CONSTRAINT user_locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT user_locations_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id)
);
CREATE TABLE public.user_trips (
  user_id integer NOT NULL,
  trip_id integer NOT NULL,
  joined_at timestamp without time zone,
  left_at timestamp without time zone,
  passenger_status character varying,
  is_active boolean DEFAULT true,
  CONSTRAINT user_trips_pkey PRIMARY KEY (user_id, trip_id),
  CONSTRAINT user_trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT user_trips_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id)
);
CREATE TABLE public.users (
  user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password text NOT NULL,
  phone character varying,
  profile_picture text,
  gamification_points integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);