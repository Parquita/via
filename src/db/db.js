import { createClient } from '@supabase/supabase-js';

const  supabaseUrl = 'https://rjfsuxiaoovjyljaarhg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnN1eGlhb292anlsamFhcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDU1NzksImV4cCI6MjA3MzAyMTU3OX0.NtlbSC92JOLvG76OwggSNsHwYv-1ve9ebB_D4DXW9UE';

const  supabase = createClient(supabaseUrl, supabaseKey);



async function getData() {
    const { data, error } = await supabase
      .from('viajes')
      .select('*');

    if (error) {
      console.error('Error al obtener datos:', error);
    } else {
      console.log(data);
    }
  }

  getData();
/*
router.delete('/usuarios/delete/:id', async (req, res) => {
  const id = 34; // ID del usuario a eliminar

  const { data, error } = await supabase
    .from('usuarios')
    .delete(id)
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('❌ Error al eliminar usuario:', error.message);
    return res.status(500).json({ error: 'Error al eliminar el usuario.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  res.json({ message: '✅ Usuario eliminado con éxito.', id: data[0].id });
});

async function getData() {
    const { data, error } = await supabase
    .from('usuarios')
    .delete(34)
    .eq('id', 34)
    .select('id');

    if (error) {
      console.error('Error al obtener datos:', error);
    } else {
      console.log(data);
    }
  }

  getData()*/