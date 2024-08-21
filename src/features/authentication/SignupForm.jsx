import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import useSignup from './useSignup';
import SpinnerMini from '../../ui/SpinnerMini';
import useUser from './useUser';
import toast from 'react-hot-toast';

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { register, formState, handleSubmit, getValues, reset } = useForm();
  const { guestUser } = useUser();
  const { errors } = formState;
  const { isLoading, signup } = useSignup();

  function onSubmit({ fullName, email, password }) {
    if (guestUser) return toast.error('You are not allowed');
    else signup({ fullName, email, password }, { onSettled: () => reset() });
  }

  function onError(error) {
    console.log(error);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading || guestUser}
          {...register('fullName', { required: 'this field required' })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading || guestUser}
          {...register('email', {
            required: 'this field required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'please provide a valid email addres',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading || guestUser}
          {...register('password', {
            required: 'this field required',
            minLength: {
              value: 8,
              message: 'Passwor needs a minimum of 8 character',
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading || guestUser}
          {...register('passwordConfirm', {
            required: 'this field required',
            validate: (value) =>
              value === getValues().password || 'Password need to match',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isLoading || guestUser}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isLoading || guestUser}>
          {!isLoading ? 'Create new user' : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
