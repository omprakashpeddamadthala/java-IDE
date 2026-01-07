/*
  # Add description column to java_problems table

  1. Changes
    - Add `description` column to `java_problems` table
      - Type: text
      - Default: ''
      - Not null

  2. Notes
    - Description helps provide detailed problem descriptions
    - Existing problems will get empty string as default description
*/

-- Add description column to java_problems table
ALTER TABLE java_problems ADD COLUMN description text NOT NULL DEFAULT '';
