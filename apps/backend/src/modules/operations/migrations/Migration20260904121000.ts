import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260904121000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "bl_build_order" (
        "id" text not null,
        "order_id" text not null,
        "configuration_id" text null,
        "state" text not null default 'queued',
        "component_reservation_status" text not null default 'pending',
        "assembler" text null,
        "qc_checklist" jsonb null,
        "burn_in_started_at" timestamptz null,
        "burn_in_completed_at" timestamptz null,
        "shipping_ready_at" timestamptz null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_build_order_pkey" primary key ("id")
      );
    `)

    this.addSql(`
      create table if not exists "bl_rma_case" (
        "id" text not null,
        "device_id" text not null,
        "customer_id" text null,
        "type" text not null,
        "status" text not null default 'open',
        "reported_issue" text not null,
        "diagnosis" text null,
        "repair_cost_cents" integer null,
        "return_label_url" text null,
        "evidence_urls" jsonb null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_rma_case_pkey" primary key ("id")
      );
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "bl_rma_case" cascade;`)
    this.addSql(`drop table if exists "bl_build_order" cascade;`)
  }
}
