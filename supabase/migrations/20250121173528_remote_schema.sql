

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, username, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username',  new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."exercise" (
    "id" integer NOT NULL,
    "exercise_name" "text" NOT NULL,
    "description" "text",
    "rest" "text"
);


ALTER TABLE "public"."exercise" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercise_exercise_set" (
    "exercise_id" integer NOT NULL,
    "set_id" integer NOT NULL
);


ALTER TABLE "public"."exercise_exercise_set" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exercise_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exercise_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exercise_id_seq" OWNED BY "public"."exercise"."id";



CREATE TABLE IF NOT EXISTS "public"."exercise_set" (
    "id" integer NOT NULL,
    "target_repetitions" "text" NOT NULL,
    "achive_repetitions" "text",
    "is_skip" boolean DEFAULT false NOT NULL,
    "target_weight" "text",
    "achive_weight" "text",
    "is_complete" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."exercise_set" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exercise_set_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exercise_set_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exercise_set_id_seq" OWNED BY "public"."exercise_set"."id";



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "username" "text",
    "email" "text" NOT NULL,
    "avatar_url" "text",
    "updated_at" timestamp with time zone,
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workoutday" (
    "id" integer NOT NULL,
    "day_name" "text" NOT NULL,
    "description" "text",
    "difficulty_level" "text",
    "workout_name" "text",
    "is_restday" boolean DEFAULT false
);


ALTER TABLE "public"."workoutday" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workoutday_exercise" (
    "workoutday_id" integer NOT NULL,
    "exercise_id" integer NOT NULL
);


ALTER TABLE "public"."workoutday_exercise" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."workoutday_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."workoutday_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."workoutday_id_seq" OWNED BY "public"."workoutday"."id";



CREATE TABLE IF NOT EXISTS "public"."workoutplan" (
    "id" integer NOT NULL,
    "creator_id" "uuid",
    "plan_name" "text" NOT NULL,
    "difficulty_level" "text",
    "description" "text"
);


ALTER TABLE "public"."workoutplan" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."workoutplan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."workoutplan_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."workoutplan_id_seq" OWNED BY "public"."workoutplan"."id";



CREATE TABLE IF NOT EXISTS "public"."workoutplan_workoutday" (
    "workoutplan_id" integer NOT NULL,
    "workoutday_id" integer NOT NULL
);


ALTER TABLE "public"."workoutplan_workoutday" OWNER TO "postgres";


ALTER TABLE ONLY "public"."exercise" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exercise_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exercise_set" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exercise_set_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."workoutday" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."workoutday_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."workoutplan" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."workoutplan_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exercise_exercise_set"
    ADD CONSTRAINT "exercise_exercise_set_pkey" PRIMARY KEY ("exercise_id", "set_id");



ALTER TABLE ONLY "public"."exercise"
    ADD CONSTRAINT "exercise_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_set"
    ADD CONSTRAINT "exercise_set_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."workoutday_exercise"
    ADD CONSTRAINT "workoutday_exercise_pkey" PRIMARY KEY ("workoutday_id", "exercise_id");



ALTER TABLE ONLY "public"."workoutday"
    ADD CONSTRAINT "workoutday_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workoutplan"
    ADD CONSTRAINT "workoutplan_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workoutplan_workoutday"
    ADD CONSTRAINT "workoutplan_workoutday_pkey" PRIMARY KEY ("workoutplan_id", "workoutday_id");



ALTER TABLE ONLY "public"."exercise_exercise_set"
    ADD CONSTRAINT "exercise_exercise_set_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exercise_exercise_set"
    ADD CONSTRAINT "exercise_exercise_set_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."exercise_set"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutday_exercise"
    ADD CONSTRAINT "workoutday_exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutday_exercise"
    ADD CONSTRAINT "workoutday_exercise_workoutday_id_fkey" FOREIGN KEY ("workoutday_id") REFERENCES "public"."workoutday"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutplan"
    ADD CONSTRAINT "workoutplan_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutplan_workoutday"
    ADD CONSTRAINT "workoutplan_workoutday_workoutday_id_fkey" FOREIGN KEY ("workoutday_id") REFERENCES "public"."workoutday"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workoutplan_workoutday"
    ADD CONSTRAINT "workoutplan_workoutday_workoutplan_id_fkey" FOREIGN KEY ("workoutplan_id") REFERENCES "public"."workoutplan"("id") ON DELETE CASCADE;



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "all_access" ON "public"."exercise_set" FOR SELECT TO "authenticated" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "all_actions" ON "public"."exercise_exercise_set" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "delete_exercise" ON "public"."exercise" FOR DELETE USING (("id" IN ( SELECT "wde"."exercise_id"
   FROM "public"."workoutday_exercise" "wde"
  WHERE ("wde"."workoutday_id" IN ( SELECT "workoutday"."id"
           FROM "public"."workoutday"
          WHERE ("workoutday"."id" IN ( SELECT "wpwd"."workoutday_id"
                   FROM "public"."workoutplan_workoutday" "wpwd"
                  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
                           FROM "public"."workoutplan"
                          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))))))));



CREATE POLICY "delete_workoutday" ON "public"."workoutday" FOR DELETE USING (("id" IN ( SELECT "wpwd"."workoutday_id"
   FROM "public"."workoutplan_workoutday" "wpwd"
  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
           FROM "public"."workoutplan"
          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))));



CREATE POLICY "delete_workoutplan" ON "public"."workoutplan" FOR DELETE USING (("creator_id" = "auth"."uid"()));



ALTER TABLE "public"."exercise" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_exercise_set" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercise_set" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_exercise" ON "public"."exercise" FOR INSERT WITH CHECK (("id" IN ( SELECT "wde"."exercise_id"
   FROM "public"."workoutday_exercise" "wde"
  WHERE ("wde"."workoutday_id" IN ( SELECT "workoutday"."id"
           FROM "public"."workoutday"
          WHERE ("workoutday"."id" IN ( SELECT "wpwd"."workoutday_id"
                   FROM "public"."workoutplan_workoutday" "wpwd"
                  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
                           FROM "public"."workoutplan"
                          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))))))));



CREATE POLICY "insert_workoutday" ON "public"."workoutday" FOR INSERT WITH CHECK (("id" IN ( SELECT "wpwd"."workoutday_id"
   FROM "public"."workoutplan_workoutday" "wpwd"
  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
           FROM "public"."workoutplan"
          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))));



CREATE POLICY "insert_workoutplan" ON "public"."workoutplan" FOR INSERT WITH CHECK (("creator_id" = "auth"."uid"()));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_exercise" ON "public"."exercise" FOR SELECT USING (("id" IN ( SELECT "wde"."exercise_id"
   FROM "public"."workoutday_exercise" "wde"
  WHERE ("wde"."workoutday_id" IN ( SELECT "workoutday"."id"
           FROM "public"."workoutday"
          WHERE ("workoutday"."id" IN ( SELECT "wpwd"."workoutday_id"
                   FROM "public"."workoutplan_workoutday" "wpwd"
                  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
                           FROM "public"."workoutplan"
                          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))))))));



CREATE POLICY "select_profile" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "select_workoutday" ON "public"."workoutday" FOR SELECT USING (("id" IN ( SELECT "wpwd"."workoutday_id"
   FROM "public"."workoutplan_workoutday" "wpwd"
  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
           FROM "public"."workoutplan"
          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))));



CREATE POLICY "select_workoutplan" ON "public"."workoutplan" FOR SELECT USING (("creator_id" = "auth"."uid"()));



CREATE POLICY "update_exercise" ON "public"."exercise" FOR UPDATE USING (("id" IN ( SELECT "wde"."exercise_id"
   FROM "public"."workoutday_exercise" "wde"
  WHERE ("wde"."workoutday_id" IN ( SELECT "workoutday"."id"
           FROM "public"."workoutday"
          WHERE ("workoutday"."id" IN ( SELECT "wpwd"."workoutday_id"
                   FROM "public"."workoutplan_workoutday" "wpwd"
                  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
                           FROM "public"."workoutplan"
                          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))))))));



CREATE POLICY "update_profile" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"()));



CREATE POLICY "update_workoutday" ON "public"."workoutday" FOR UPDATE USING (("id" IN ( SELECT "wpwd"."workoutday_id"
   FROM "public"."workoutplan_workoutday" "wpwd"
  WHERE ("wpwd"."workoutplan_id" IN ( SELECT "workoutplan"."id"
           FROM "public"."workoutplan"
          WHERE ("workoutplan"."creator_id" = "auth"."uid"()))))));



CREATE POLICY "update_workoutplan" ON "public"."workoutplan" FOR UPDATE USING (("creator_id" = "auth"."uid"()));



ALTER TABLE "public"."workoutday" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workoutday_exercise" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "workoutday_exercise_all_actions" ON "public"."workoutday_exercise" USING (("auth"."uid"() IS NOT NULL));



ALTER TABLE "public"."workoutplan" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workoutplan_workoutday" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "workoutplan_workoutday_all_actions" ON "public"."workoutplan_workoutday" USING (("auth"."uid"() IS NOT NULL));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."exercise" TO "anon";
GRANT ALL ON TABLE "public"."exercise" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_exercise_set" TO "anon";
GRANT ALL ON TABLE "public"."exercise_exercise_set" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_exercise_set" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exercise_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercise_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercise_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_set" TO "anon";
GRANT ALL ON TABLE "public"."exercise_set" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_set" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exercise_set_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercise_set_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercise_set_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."workoutday" TO "anon";
GRANT ALL ON TABLE "public"."workoutday" TO "authenticated";
GRANT ALL ON TABLE "public"."workoutday" TO "service_role";



GRANT ALL ON TABLE "public"."workoutday_exercise" TO "anon";
GRANT ALL ON TABLE "public"."workoutday_exercise" TO "authenticated";
GRANT ALL ON TABLE "public"."workoutday_exercise" TO "service_role";



GRANT ALL ON SEQUENCE "public"."workoutday_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workoutday_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workoutday_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workoutplan" TO "anon";
GRANT ALL ON TABLE "public"."workoutplan" TO "authenticated";
GRANT ALL ON TABLE "public"."workoutplan" TO "service_role";



GRANT ALL ON SEQUENCE "public"."workoutplan_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."workoutplan_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."workoutplan_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workoutplan_workoutday" TO "anon";
GRANT ALL ON TABLE "public"."workoutplan_workoutday" TO "authenticated";
GRANT ALL ON TABLE "public"."workoutplan_workoutday" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
