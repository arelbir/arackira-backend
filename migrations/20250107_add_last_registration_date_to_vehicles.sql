-- Migration: Add last_registration_date column to vehicles table
-- Date: 2025-01-07
-- Description: Adds last_registration_date field to track the most recent vehicle registration date

ALTER TABLE vehicles 
ADD COLUMN last_registration_date DATE;

-- Add comment for documentation
COMMENT ON COLUMN vehicles.last_registration_date IS 'Son tescil tarihi - Aracın en son tescil edildiği tarih';
