import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260904122000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "bl_device" (
        "id" text not null,
        "asset_tag" text not null,
        "serial_number" text not null,
        "status" text not null default 'in_build',
        "configuration_id" text null,
        "order_id" text null,
        "device_condition" text not null default 'new',
        "qc_status" text null,
        "qc_report_url" text null,
        "photos" jsonb null,
        "wipe_status" text null,
        "warranty_end_at" timestamptz null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "bl_device_pkey" primary key ("id")
      );
    `)
    this.addSql(`create unique index if not exists "IDX_bl_device_asset_tag" on "bl_device" ("asset_tag") where deleted_at is null;`)
    this.addSql(`create unique index if not exists "IDX_bl_device_serial" on "bl_device" ("serial_number") where deleted_at is null;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "bl_device" cascade;`)
  }
}
