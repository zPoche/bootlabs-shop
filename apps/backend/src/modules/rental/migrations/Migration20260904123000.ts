import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260904123000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "bl_rental_contract" (
        "id" text not null,
        "customer_id" text null,
        "device_id" text null,
        "medusa_order_id" text null,
        "stripe_customer_id" text null,
        "stripe_subscription_id" text null,
        "stripe_price_id" text null,
        "status" text not null default 'pending_review',
        "starts_at" timestamptz null,
        "minimum_term_ends_at" timestamptz null,
        "monthly_rate_cents" integer not null,
        "deposit_cents" integer not null default 0,
        "deductible_cents" integer not null default 0,
        "ownership" text not null default 'bootlabs',
        "configuration_id" text null,
        "notes" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_rental_contract_pkey" primary key ("id")
      );
    `)

    this.addSql(`
      create table if not exists "bl_rental_event" (
        "id" text not null,
        "rental_contract_id" text not null,
        "type" text not null,
        "actor" text not null default 'system',
        "payload" jsonb null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_rental_event_pkey" primary key ("id")
      );
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "bl_rental_event" cascade;`)
    this.addSql(`drop table if exists "bl_rental_contract" cascade;`)
  }
}
