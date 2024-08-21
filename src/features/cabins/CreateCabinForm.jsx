import { PropTypes } from 'prop-types';
import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import useCreateCabin from './useCreateCabin';
import useEditCabin from './useEditCabin';
import useUser from '../authentication/useUser';

CreateCabinForm.propTypes = {
  cabinToEdit: PropTypes.object,
  onCloseModal: PropTypes.func,
};

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const { guestUser } = useUser();

  const isEditSession = Boolean(editId);

  const { register, reset, handleSubmit, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];
    if(guestUser) return

    if (isEditSession)
      return editCabin(
        { newCabin: { ...data, image }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    createCabin(
      { ...data, image: image },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  function onError(error) {
    console.log(error);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking || guestUser}
          {...register('name', { required: 'this field is require' })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking || guestUser}
          {...register('maxCapacity', {
            required: 'this field is require',
            min: { value: 1 },
            message: 'Capacity value at least 1',
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking || guestUser}
          {...register('regularPrice', {
            required: 'this field is require',
            min: { value: 1 },
            message: 'Capacity value at least 1',
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking || guestUser}
          defaultValue={0}
          {...register('discount', {
            required: 'this field is require',
            validate: (value) =>
              Number(value) <= Number(getValues('regularPrice')) ||
              'Discount should be less than price',
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isWorking || guestUser}
          defaultValue=""
          {...register('description', { required: 'this field is require' })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking || guestUser}
          {...register('image', {
            required: isEditSession ? false : 'this field is require',
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking || guestUser}>
          {isEditSession ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
