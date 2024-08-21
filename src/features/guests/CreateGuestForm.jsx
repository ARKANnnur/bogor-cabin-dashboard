/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';

import useCreateGuest from './useCreateGuest';
import { useEditGuest } from './useEditGuest';
import { getFlagCode } from '../../services/apiGuests';
import useUser from '../authentication/useUser';

function CreateGuestFrom({ guestToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = guestToEdit;
  const { guestUser } = useUser();

  const isEditSession = Boolean(editId);

  const { register, reset, handleSubmit, watch, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const { isCreating, createGuest } = useCreateGuest();
  const { isEditing, editGuest } = useEditGuest();

  const isWorking = isCreating || isEditing;

  const [countryFlag, setCountryFlag] = useState(
    guestToEdit ? guestToEdit.countryFlag : null
  );
  const nationality = watch('nationality');
  const [value] = useDebounce(nationality, 500);

  useEffect(() => {
    async function getFlag() {
      const flag = await getFlagCode(value);
      setCountryFlag(flag);
    }
    getFlag();
  }, [value]);

  function onSubmit(data) {
    if (guestUser) return;
    if (isEditSession)
      return editGuest(
        {
          newGuest: {
            ...data,
            countryFlag: `https://flagcdn.com/${countryFlag.toLowerCase()}.svg`,
          },
          id: editId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    createGuest(
      {
        ...data,
        countryFlag: `https://flagcdn.com/${countryFlag.toLowerCase()}.svg`,
      },
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
      <FormRow label="Name Guest" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isWorking || guestUser}
          {...register('fullName', { required: 'this field is require' })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking || guestUser}
          {...register('email', {
            required: 'this field is require',
            validate: (value) =>
              // eslint-disable-next-line no-useless-escape
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                value
              ) || 'wrong email type',
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Input
          type="text"
          id="nationality"
          disabled={isWorking || guestUser}
          {...register('nationality', { required: 'this field is require' })}
        />
      </FormRow>

      <FormRow label="National Id" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isWorking || guestUser}
          {...register('nationalID', { required: 'this field is require' })}
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
          {isEditSession ? 'Edit Guest' : 'Create new Guest'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestFrom;
