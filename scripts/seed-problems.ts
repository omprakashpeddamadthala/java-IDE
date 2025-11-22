import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProblems() {
  console.log('Starting to seed problems...');

  const jsonPath = path.join(__dirname, '../src/data/seedProblems.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const allProblems: any[] = [];

  ['basic', 'intermediate', 'advanced', 'expert'].forEach((difficulty) => {
    if (jsonData[difficulty]) {
      jsonData[difficulty].forEach((problem: any) => {
        allProblems.push({
          number: problem.number,
          title: problem.title,
          difficulty: difficulty,
          input: problem.input || '',
          solution: problem.solution,
          output: problem.output || ''
        });
      });
    }
  });

  console.log(`Found ${allProblems.length} problems to insert`);

  const { data, error } = await supabase
    .from('java_problems')
    .insert(allProblems);

  if (error) {
    console.error('Error inserting problems:', error);
  } else {
    console.log('Successfully seeded all problems!');
  }
}

seedProblems();
