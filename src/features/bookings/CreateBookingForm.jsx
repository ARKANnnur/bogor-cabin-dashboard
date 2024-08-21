/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import { useDarkMode } from '../../contexts/DarkModeContexts';

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
import useBookingsSelectedDays from './useBookingsDatesHasBooked';
import FormFlex from '../../ui/FormFlex';
import { getDisabledDates } from '../../utils/getDisabledDates';
import {
  convertToCustomTimestamp,
  formattedInitialDate,
} from '../../utils/helpers';
import useUser from '../authentication/useUser';

function CreateBookingForm({ bookingToEdit = {}, onCloseModal }) {
  const { isDarkMode } = useDarkMode();
  const { isLoading: isSettings, settings = {} } = useSettings();
  const { isLoading: isCabins, cabins = {} } = useCabin();
  const { isLoading: isGuests, guests = {} } = useGuests();
  const { guestUser } = useUser();

  const { isCreating, createBooking } = useCreateBooking();
  const { isEditing, editBooking } = useEditBooking();
  const {
    isBookingsDatesHasBooked,
    setBookingsDatesHasBooked,
    bookingsDatesHasBooked,
  } = useBookingsSelectedDays();

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
    ? formattedInitialDate(startDate)
    : new Date();
  const editEndDate = isEditSession
    ? formattedInitialDate(endDate)
    : new Date();
  const bookingEditValue = {
    startDate: editStartDate,
    endDate: editEndDate,
    ...editValues,
  };

  // Form Settings
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? bookingEditValue : {},
  });
  const numGuests = Number(watch('numGuests'));

  // Operation has Breakfast
  const [hasBreakfast, setHasBreakfast] = useState(
    editHasBreakfast ? editHasBreakfast : false
  );

  // Operation set Cabin Price
  const [cabinPrice, setCabinPrice] = useState({
    id: editCabinId ? editCabinId : cabins[0]?.id,
    price: editCabinPrice
      ? editCabinPrice
      : cabins[0]?.regularPrice - cabins[0]?.discount,
  });

  useEffect(() => {
    setCabinPrice({
      id: editCabinId ? editCabinId : cabins[0]?.id,
      price: editCabinPrice
        ? editCabinPrice
        : cabins[0]?.regularPrice - cabins[0]?.discount,
    });
  }, [cabins, editCabinId, editCabinPrice]);

  // Operation setSelected Day bookinged
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectNowDays, setSelectNowDays] = useState({
    from: isEditSession ? editStartDate : '',
    to: isEditSession ? editEndDate : '',
  });

  useEffect(() => {
    if (cabinPrice.id) setBookingsDatesHasBooked(cabinPrice.id);
    setSelectedDays(getDisabledDates(bookingsDatesHasBooked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabinPrice]);
  useEffect(() => {
    if (bookingsDatesHasBooked)
      setSelectedDays(getDisabledDates(bookingsDatesHasBooked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingsDatesHasBooked]);

  // operation getNumNights auto
  const operationNumNights = selectNowDays?.from
    ? selectNowDays?.to - selectNowDays?.from
    : 0;
  const resultNumNights = editNumNights
    ? operationNumNights
      ? operationNumNights / (1000 * 60 * 60 * 24)
      : editNumNights
    : operationNumNights / (1000 * 60 * 60 * 24);

  const [guestId, setGuestId] = useState(
    editGuestId ? editGuestId : guests[0]?.id
  );
  useEffect(() => {
    setGuestId(guests[0]?.id);
  }, [guests]);

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
    if(guestUser) return
    const startDate = convertToCustomTimestamp(selectNowDays?.from);
    const endDate = convertToCustomTimestamp(selectNowDays?.to);

    const newBooking = {
      startDate,
      endDate,
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

  if (isWorking)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Spinner />
      </div>
    );

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      {guests.length > 0 && (
        <FormRow label="Guest Name Booking">
          <StyledSelect
            type="text"
            id="guestId"
            disabled={isWorking || guestUser}
            onChange={(e) => setGuestId(e.target.value)}
          >
            {guests.map((guest) => (
              <option
                key={guest.id}
                value={guest.id}
                defaultValue={guests[0]?.id}
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
          disabled={isWorking || guestUser}
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
          placeholder={`num guests must 1 - ${settings.maxGuestsPerBooking}`}
        />
      </FormRow>

      <FormRow label="Cabin Name">
        {cabins.length > 0 && (
          <StyledSelect
            type="text"
            id="cabinId"
            disabled={isWorking || guestUser}
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
          disabled={isWorking || guestUser}
          value={cabinPrice.price}
        />
      </FormRow>

      <FormFlex>
        {isBookingsDatesHasBooked ? (
          <Spinner />
        ) : (
          <DayPicker
            mode="range"
            defaultMonth={isEditSession ? new Date(editStartDate) : new Date()}
            selected={selectNowDays || null}
            disabled={selectedDays}
            modifiersStyles={{
              selected: {
                background: `${isDarkMode ? '#111827' : '#d1d5db'}`,
                color: `${isDarkMode ? '#f9fafb' : '#111827'}`,
                border: 'none',
              },
              disabled: {
                color: '#b91c1c',
                opacity: '100',
                fontWeight: 'bold',
              },
              today: {
                color: '#4338ca',
              },
            }}
            fromDate={new Date()}
            onSelect={(date) => setSelectNowDays(date)}
            required="this field is require "
          />
        )}
      </FormFlex>

      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          value={
            selectNowDays?.from
              ? new Date(selectNowDays?.from).toISOString().substring(0, 10)
              : ''
          }
          required="this field is require"
          disabled
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          value={
            selectNowDays?.to
              ? new Date(selectNowDays?.to).toISOString().substring(0, 10)
              : ''
          }
          required="this field is require"
          disabled
        />
      </FormRow>

      <FormRow label="Number Night" error={errors?.numNights?.message}>
        <Input
          type="text"
          id="numNights"
          disabled
          required="Capacity value at least 1"
          value={resultNumNights ? resultNumNights : 0}
        />
      </FormRow>

      <FormRow label="Has Breakfast" error={errors?.hasBreakfast?.message}>
        <StyledSelect
          type="text"
          id="hasBreakfast"
          disabled={isWorking || guestUser}
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
          value={extrasPrice ? extrasPrice : 0}
          required="this field is require"
        />
      </FormRow>

      <FormRow label="Total Price" error={errors?.totalPrice?.message}>
        <Input
          type="text"
          id="totalPrice"
          disabled
          value={totalPrice ? totalPrice : 0}
          required="this field is require"
        />
      </FormRow>

      <FormRow label="Status" error={errors?.status?.message}>
        <StyledSelect
          type="number"
          id="status"
          disabled={isWorking || guestUser}
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
          disabled={isWorking || guestUser}
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
          disabled={isWorking || guestUser}
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
        <Button disabled={isWorking || guestUser}>
          {isEditSession ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
