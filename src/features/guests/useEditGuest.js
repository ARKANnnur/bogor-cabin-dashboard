import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createEditGuest } from '../../services/apiGuests';

export function useEditGuest() {
  const queryClient = useQueryClient();

  const { isLoading: isEditing, mutate: editGuest } = useMutation({
    mutationFn: ({ newGuest, id }) => createEditGuest(newGuest, id),
    onSuccess: () => {
      toast.success('Guests successfuly Edited ');
      queryClient.invalidateQueries({
        queryKey: ['guests'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editGuest };
}
