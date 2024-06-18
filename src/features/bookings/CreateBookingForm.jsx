/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';
import useCreateBooking from './useCreateBooking';
import StyledSelect from '../../ui/Select';
import Spinner from '../../ui/Spinner';

import useSettings from '../settings/useSettings';
import { useEditBooking } from './useEditBooking';
import useGuests from '../guests/useGuests';
import useCabin from '../cabins/useCabin';

function CreateBookingForm({ bookingToEdit = {}, onCloseModal }) {
  const { isLoading: isSettings, settings = {} } = useSettings();
  const { isLoading: isCabins, cabins = {} } = useCabin();
  const { isLoading: isGuests, guests = {} } = useGuests();

  const { isCreating, createBooking } = useCreateBooking();
  const { isEditing, editBooking } = useEditBooking();

  const isWorking =
    isCreating || isEditing || isSettings || isCabins || isGuests;

  // checking edit or add
  const { id: editId, startDate, endDate, ...editValues } = bookingToEdit;

  // destructuring
  const {
    guests: { id: editGuestId, fullName } = {},
    cabins: { id: editCabinId, name } = {},
    numNights: editNumNights = 0,
    cabinPrice: editCabinPrice = 0,
    hasBreakfast: editHasBreakfast = false,
    extrasPrice: editExtrasPrice = 0,
  } = bookingToEdit;

  const isEditSession = Boolean(editId);

  // setting defaul date
  const editStartDate = isEditSession
    ? new Date(startDate).toISOString().substring(0, 10)
    : new Date();
  const editEndDate = isEditSession
    ? new Date(endDate).toISOString().substring(0, 10)
    : new Date();
  const bookingEditValue = {
    startDate: editStartDate,
    endDate: editEndDate,
    ...editValues,
  };

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? bookingEditValue : {},
  });

  // operation getNumNights auto
  const operationNumNights = watch('endDate') - watch('startDate');
  const resultNumNights = editNumNights
    ? editNumNights
    : operationNumNights / (1000 * 60 * 60 * 24);

  const numGuests = Number(watch('numGuests'));
  const [hasBreakfast, setHasBreakfast] = useState(
    editHasBreakfast ? editHasBreakfast : false
  );
  const [cabinPrice, setCabinPrice] = useState({
    id: editCabinId ? editCabinId : cabins[0]?.id,
    price: editCabinPrice
      ? editCabinPrice
      : cabins[0]?.regularPrice - cabins[0]?.discount,
  });

  const [guestId, setGuestId] = useState(
    editGuestId ? editGuestId : guests[0]?.id
  );
  const [extrasPrice, setExtraPrice] = useState(
    editExtrasPrice ? editExtrasPrice : 0
  );

  // operation get totalPrice
  const totalPrice =
    cabinPrice || extrasPrice
      ? (Number(cabinPrice.price) + Number(extrasPrice)) *
        Number(resultNumNights)
      : 0;

  // setting extraPrice
  useEffect(() => {
    if (!hasBreakfast) return setExtraPrice(0);
    if (hasBreakfast)
      return setExtraPrice(
        settings.breakfastPrice * resultNumNights * numGuests
      );
  }, [
    hasBreakfast,
    extrasPrice,
    settings.breakfastPrice,
    resultNumNights,
    numGuests,
  ]);

  function onSubmit(data) {
    const newBooking = {
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      isPaid: Boolean(data.isPaid),
      observations: data.observations,
      numNights: resultNumNights,
      numGuests,
      guestId: parseInt(guestId),
      cabinId: parseInt(cabinPrice.id),
      cabinPrice: parseFloat(cabinPrice.price),
      hasBreakfast,
      extrasPrice: parseFloat(extrasPrice),
      totalPrice: parseFloat(totalPrice),
    };

    if (isEditSession)
      return editBooking(
        { newBookingEdit: newBooking, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    createBooking(newBooking, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  function onError(error) {
    console.log(error);
  }

  if (isWorking) return <Spinner />;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isWorking}
          {...register('startDate', {
            valueAsDate: true,
            required: 'this field is require',
            validate: (value) => {
              if (value > getValues('endDate'))
                return 'The date must be before the end date';
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isWorking}
          {...register('endDate', {
            valueAsDate: true,
            required: 'this field is require',
            validate: (value) => {
              if (value < getValues('startDate'))
                return 'The date must be after the start date';
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="Number Night" error={errors?.numNights?.message}>
        <Input
          type="number"
          id="numNights"
          disabled={isWorking}
          minLength={1}
          required="Capacity value at least 1"
          value={resultNumNights}
        />
      </FormRow>

      {guests.length > 0 && (
        <FormRow label="Guest Name Booking">
          <StyledSelect
            type="text"
            id="guestId"
            disabled={isWorking}
            onChange={(e) => setGuestId(e.target.value)}
          >
            {guests.map((guest) => (
              <option
                key={guest.id}
                value={guest.id}
                selected={fullName ? guest.fullName === fullName : null}
              >
                {guest.fullName}
              </option>
            ))}
          </StyledSelect>
        </FormRow>
      )}

      <FormRow label="Number Guest" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isWorking}
          {...register('numGuests', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity value at least 1',
            },
            validate: (value) => {
              if (Number(value) < 0) {
                return 'Number of guests must not be negative';
              } else if (Number(value) > settings.maxGuestsPerBooking) {
                return `Number of guests must be less than ${settings.maxGuestsPerBooking}`;
              }
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="Cabin Name">
        {cabins.length > 0 && (
          <StyledSelect
            type="text"
            id="cabinId"
            disabled={isWorking}
            onChange={(e) =>
              setCabinPrice({
                id: e.target.options[e.target.selectedIndex].getAttribute(
                  'data-id'
                ),
                price: e.target.value,
              })
            }
          >
            {cabins.map((cabin) => (
              <option
                key={cabin.id}
                data-id={cabin.id}
                value={cabin.regularPrice - cabin.discount}
                selected={name ? cabin.name === name : null}
              >
                {cabin.name}
              </option>
            ))}
          </StyledSelect>
        )}
      </FormRow>

      <FormRow label="Cabin Price">
        <Input
          type="text"
          id="cabinPrice"
          disabled={isWorking}
          value={cabinPrice.price}
        />
      </FormRow>

      <FormRow label="Has Breakfast" error={errors?.hasBreakfast?.message}>
        <StyledSelect
          type="text"
          id="hasBreakfast"
          disabled={isWorking}
          value={hasBreakfast}
          onChange={() => setHasBreakfast((set) => !set)}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </StyledSelect>
      </FormRow>

      <FormRow label="Extra Price" error={errors?.extrasPrice?.message}>
        <Input
          type="text"
          id="extrasPrice"
          disabled
          value={extrasPrice}
          required="this field is require"
        />
      </FormRow>

      <FormRow label="Total Price" error={errors?.totalPrice?.message}>
        <Input
          type="text"
          id="totalPrice"
          disabled
          value={
            cabinPrice || extrasPrice
              ? (Number(cabinPrice.price) + Number(extrasPrice)) *
                Number(resultNumNights)
              : 0
          }
          required="this field is require"
        />
      </FormRow>

      <FormRow label="Status" error={errors?.status?.message}>
        <StyledSelect
          type="number"
          id="status"
          disabled={isWorking}
          defaultValue="unconfirmed"
          {...register('status', {
            required: 'this field is require',
          })}
        >
          <option value="unconfirmed">unconfirmed</option>
          <option value="checked-in">checked-in</option>
          <option value="checked-out">checked-out</option>
        </StyledSelect>
      </FormRow>

      <FormRow label="Is Paid" error={errors?.isPaid?.message}>
        <StyledSelect
          type="Boolean"
          id="isPaid"
          disabled={isWorking}
          defaultValue="False"
          {...register('isPaid', {
            required: 'this field is require',
          })}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </StyledSelect>
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          type="number"
          id="observations"
          disabled={isWorking}
          defaultValue=""
          {...register('observations', { required: 'this field is require' })}
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
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
