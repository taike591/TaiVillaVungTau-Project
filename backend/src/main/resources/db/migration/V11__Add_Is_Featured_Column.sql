ALTER TABLE properties ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
UPDATE properties SET is_featured = FALSE WHERE is_featured IS NULL;
