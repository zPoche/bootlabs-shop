import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260904120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "bl_component" (
        "id" text not null,
        "sku" text not null,
        "ean" text null,
        "name" text not null,
        "manufacturer" text not null,
        "manufacturer_part_number" text null,
        "component_type" text not null,
        "purchase_price_cents" integer not null,
        "target_margin_percent" integer not null,
        "tax_rate" integer not null default 19,
        "technical_specification" jsonb not null default '{}'::jsonb,
        "active" boolean not null default true,
        "purchasable" boolean not null default true,
        "stock_status" text not null default 'in_stock',
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_component_pkey" primary key ("id")
      );
    `)
    this.addSql(`create unique index if not exists "IDX_bl_component_sku" on "bl_component" ("sku") where deleted_at is null;`)

    this.addSql(`
      create table if not exists "bl_compatible_rule" (
        "id" text not null,
        "rule_type" text not null,
        "severity" text not null,
        "source_component_type" text null,
        "target_component_type" text null,
        "expression" jsonb not null default '{}'::jsonb,
        "message_customer" text not null,
        "message_internal" text null,
        "active" boolean not null default true,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_compatible_rule_pkey" primary key ("id")
      );
    `)

    this.addSql(`
      create table if not exists "bl_pc_configuration" (
        "id" text not null,
        "public_reference" text not null,
        "status" text not null default 'draft',
        "customer_id" text null,
        "selected_components" jsonb not null default '[]'::jsonb,
        "calculated_price_cents" integer not null default 0,
        "estimated_power_watt" integer not null default 0,
        "estimated_build_time_days" integer not null default 5,
        "compatibility_result" jsonb not null default '{}'::jsonb,
        "price_breakdown" jsonb not null default '{}'::jsonb,
        "expires_at" timestamptz not null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_pc_configuration_pkey" primary key ("id")
      );
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "bl_pc_configuration" cascade;`)
    this.addSql(`drop table if exists "bl_compatible_rule" cascade;`)
    this.addSql(`drop table if exists "bl_component" cascade;`)
  }
}
