# How to Seed the Database

## Quick Method (Recommended)

### Step 1: Create the problems.json file

1. Copy **ALL** the JSON data you provided (starting from `{` and ending with `}`)
2. Save it as `/tmp/cc-agent/60566767/project/public/problems.json`

The file should look like this structure:
```json
{
  "basic": [ ... ],
  "intermediate": [ ... ],
  "advanced": [ ... ],
  "expert": [ ... ]
}
```

### Step 2: Update the seed.html file with your Supabase credentials

1. Open `/tmp/cc-agent/60566767/project/public/seed.html`
2. Find these lines:
```javascript
const SUPABASE_URL = '__SUPABASE_URL__';
const SUPABASE_ANON_KEY = '__SUPABASE_ANON_KEY__';
```
3. Replace them with your actual values from `.env`:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 3: Run the seeding tool

1. Start your dev server (if not already running)
2. Visit: `http://localhost:5173/seed.html`
3. Click the "Seed Database with 70 Problems" button
4. Wait for the progress bar to complete
5. You should see: "✅ Successfully seeded 70 problems!"

### Step 4: Test the Random Button

1. Go back to your main app: `http://localhost:5173`
2. Click the purple "Random" button
3. A random Java problem should load with:
   - Difficulty badge
   - Problem title
   - Input/output description
   - Solution code in the editor

---

## Alternative Method: Direct SQL Insert

If you prefer SQL, you can:

1. Go to your Supabase Dashboard → SQL Editor
2. Use this template to insert problems:

```sql
INSERT INTO java_problems (number, title, difficulty, input, solution, output) VALUES
(1, 'Problem Title', 'basic', 'input text', 'solution code', 'expected output'),
(2, 'Problem Title 2', 'intermediate', 'input text', 'solution code', 'expected output');
-- ... continue for all 70 problems
```

---

## Verification

After seeding, verify the data:

```sql
-- Check total count
SELECT COUNT(*) FROM java_problems;

-- Check by difficulty
SELECT difficulty, COUNT(*)
FROM java_problems
GROUP BY difficulty;

-- View a random problem
SELECT * FROM java_problems
ORDER BY RANDOM()
LIMIT 1;
```

You should see:
- Total: 70 problems
- Basic: 15 problems
- Intermediate: 20 problems
- Advanced: 25 problems
- Expert: 10 problems

---

## Troubleshooting

**Error: "Failed to fetch problems.json"**
- Make sure `problems.json` exists in the `public` folder
- Check that the JSON is valid (no syntax errors)

**Error: "Failed to insert"**
- Check your Supabase credentials in `seed.html`
- Verify RLS policies allow inserts (they should allow public reads, but check if inserts need auth)

**No problems showing up after clicking Random**
- Open browser console (F12) to see any errors
- Verify problems were inserted: Check Supabase Dashboard → Table Editor → java_problems
