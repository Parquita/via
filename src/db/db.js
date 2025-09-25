import { createClient } from '@supabase/supabase-js';

const  supabaseUrl = 'https://rjfsuxiaoovjyljaarhg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnN1eGlhb292anlsamFhcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDU1NzksImV4cCI6MjA3MzAyMTU3OX0.NtlbSC92JOLvG76OwggSNsHwYv-1ve9ebB_D4DXW9UE';

const  supabase = createClient(supabaseUrl, supabaseKey);



async function getData() {
    const { data, error } = await supabase
      .from('pagos')
      .select('*');

    if (error) {
      console.error('Error al obtener datos:', error);
    } else {
      console.log(data);
    }
  }

  getData();

module.exports = supabase;