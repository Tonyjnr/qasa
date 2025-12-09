CREATE TABLE "aqi_daily_summary" (
	"id" text PRIMARY KEY NOT NULL,
	"monitoring_station_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"aqi_avg" text,
	"aqi_min" text,
	"aqi_max" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "aqi_time_series" (
	"id" text PRIMARY KEY NOT NULL,
	"monitoring_station_id" text NOT NULL,
	"recorded_at" timestamp NOT NULL,
	"aqi" text NOT NULL,
	"pm25" text,
	"pm10" text,
	"o3" text,
	"no2" text,
	"so2" text,
	"co" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "datasets" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"size" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'ready'
);
--> statement-breakpoint
CREATE TABLE "monitoring_stations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"lat" real NOT NULL,
	"lng" real NOT NULL,
	"country" text,
	"city" text,
	"source" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"device_name" text,
	"ip_address" text,
	"user_agent" text,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"monitoring_station_id" text,
	"type" text NOT NULL,
	"threshold" real NOT NULL,
	"operator" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"notification_method" text DEFAULT 'in_app' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"saved_locations" jsonb,
	"notifications_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"avatar_url" text,
	"role" text DEFAULT 'resident' NOT NULL,
	"email_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weather_daily_summary" (
	"id" text PRIMARY KEY NOT NULL,
	"monitoring_station_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"temp_avg" real,
	"temp_min" real,
	"temp_max" real,
	"humidity_avg" real,
	"wind_speed_avg" real,
	"weather_description_dominant" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weather_time_series" (
	"id" text PRIMARY KEY NOT NULL,
	"monitoring_station_id" text NOT NULL,
	"recorded_at" timestamp NOT NULL,
	"temperature" real,
	"feels_like" real,
	"humidity" real,
	"pressure" real,
	"wind_speed" real,
	"wind_deg" real,
	"weather_icon" text,
	"weather_description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "aqi_daily_summary" ADD CONSTRAINT "aqi_daily_summary_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "public"."monitoring_stations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aqi_time_series" ADD CONSTRAINT "aqi_time_series_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "public"."monitoring_stations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_alerts" ADD CONSTRAINT "user_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_alerts" ADD CONSTRAINT "user_alerts_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "public"."monitoring_stations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_daily_summary" ADD CONSTRAINT "weather_daily_summary_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "public"."monitoring_stations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_time_series" ADD CONSTRAINT "weather_time_series_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "public"."monitoring_stations"("id") ON DELETE cascade ON UPDATE no action;