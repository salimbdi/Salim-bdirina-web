# Supabase Setup Guide

The application requires specific Storage Buckets to be configured in your Supabase project for file uploads to work.

## 1. Storage Buckets

You need to create the following buckets in the **Storage** section of your Supabase dashboard:

### Bucket: `projects`
- **Name:** `projects`
- **Public:** Yes (Toggle "Public bucket" to ON)
- **Allowed MIME types:** `image/*` (optional but recommended)
- **RLS Policies:**
  - **Select (Read):** Allow access to `public` (anon) role.
    - Policy Name: `Public Access`
    - Allowed operations: `SELECT`
    - Target roles: `anon`, `authenticated` (or just check "Public")
  - **Insert (Upload):** Allow access to `authenticated` role.
    - Policy Name: `Authenticated Upload`
    - Allowed operations: `INSERT`
    - Target roles: `authenticated`
  - **Update/Delete:** Allow access to `authenticated` role.
    - Policy Name: `Authenticated Update/Delete`
    - Allowed operations: `UPDATE`, `DELETE`
    - Target roles: `authenticated`

### Bucket: `assets`
(Used by Settings Manager for CV/Resume)
- **Name:** `assets`
- **Public:** Yes
- **RLS Policies:** Same as above.

## 2. Database Tables
Ensure your database has the `projects` and `project_categories` tables created. (These seem to be already set up if you can see the projects list).

## Troubleshooting "Error uploading image"
If you see the error:
> "Error uploading image. Make sure you have a 'projects' bucket with public access."

1. Go to Supabase Dashboard.
2. Navigate to **Storage**.
3. Check if a bucket named `projects` exists.
4. If not, click **New Bucket**, name it `projects`, and ensure **Public bucket** is checked.
5. If it exists, check the **Policies** to ensure authenticated users can `INSERT` (upload) files.
