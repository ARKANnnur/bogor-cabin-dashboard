import { useQuery } from '@tanstack/react-query';
import { getFlagCode } from '../../services/apiGuests';

const useFlagCode = (flagCode) => {
  return useQuery(['flagCode', flagCode], () => getFlagCode(flagCode));
};

export default useFlagCode
