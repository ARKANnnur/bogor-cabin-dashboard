import { useQuery } from '@tanstack/react-query';
import { getCabins } from '../../services/apiCabins';

export default function useCabin() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
  });

  return { isLoading, cabins, error };
}
