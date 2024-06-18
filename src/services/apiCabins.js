import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImage = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replace('/', '');
  const imagePath = hasImage
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  // https://tflsekewlkxwtizhmaod.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // 1.create/edit cabin
  let query = supabase.from('cabins');

  //Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  //Edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be created');
  }

  //2.upload image
  if (hasImage) return data;

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // 3.Delete the cabin if There was a error when upload image
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', newCabin.id);
    console.error(storageError);
    throw new Error(
      'Cabin image could be uploaded and the cabin was not created'
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}
