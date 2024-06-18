import { API_URL } from '../utils/constants';
import supabase from './supabase';

export async function getGuests() {
  const { data, error } = await supabase.from('guests').select('id, fullName, email, nationality, nationalID, countryFlag');

  if (error) {
    console.error(error);
    throw new Error('Guests could not be loaded');
  }

  return data;
}

export async function createEditGuest(newGuest, id) {
  let query = supabase.from('guests');

  //Create
  if (!id) query = query.insert([{ ...newGuest }]);

  //Edit
  if (id) query = query.update({ ...newGuest }).eq('id', id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error('Guests could not be created');
  }

  return data;
}

export async function deleteGuest(id) {
  const { error } = await supabase.from('guests').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Guests could not be Deleted');
  }
}

export async function getFlagCode(flagCode) {
  const controller = new AbortController()
  try {
    // Panggil REST Countries API dengan nama negara
    const response = await fetch(`${API_URL}/${flagCode}`, { signal: controller.signal });
    const countries = await response.json();

    // Periksa apakah negara ditemukan dan memiliki kode ISO-2
    if (countries.length > 0 && countries[0].cca2) {
      const iso2Code = countries[0].cca2;
      console.log(`Kode ISO-2 untuk ${flagCode}: ${iso2Code}`);
      return iso2Code;
    } else {
      console.error(`Tidak dapat menemukan kode ISO-2 untuk ${flagCode}`);
      return null;
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    return null;
  }
}
