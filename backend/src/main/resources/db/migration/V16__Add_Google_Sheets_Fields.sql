-- Add Google Sheets management fields to properties table
ALTER TABLE properties ADD COLUMN google_sheets_url TEXT;
ALTER TABLE properties ADD COLUMN google_sheets_note TEXT;
