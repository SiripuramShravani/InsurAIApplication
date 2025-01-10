import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { MdError } from 'react-icons/md';
import { GrMail } from 'react-icons/gr'; 
import { BsFillCheckSquareFill } from 'react-icons/bs';
import cn from 'classnames';

// Utility Functions (you should have these in a separate file)
const findInputError = (errors, name) => {
  return Object.keys(errors).find((error) => error === name);
};

const isFormInvalid = (inputError) => {
  return inputError !== undefined;
};

// Input Component
const Input = ({
  name,
  label,
  type,
  id,
  placeholder,
  validation,
  multiline,
  className,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  const input_tailwind =
    'p-5 font-medium rounded-md w-full border border-slate-300 placeholder:opacity-60';

  return (
    <div className={cn('flex flex-col w-full gap-2', className)}>
      <div className="flex justify-between">
        <label htmlFor={id} className="font-semibold capitalize">
          {label}
        </label>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && (
            <InputError
              message={inputErrors.error.message}
              key={inputErrors.error.message}
            />
          )}
        </AnimatePresence>
      </div>
      {multiline ? ( 
        <textarea
          id={id}
          type={type}
          className={cn(input_tailwind, 'min-h-[10rem] max-h-[20rem] resize-y')}
          placeholder={placeholder}
          {...register(`${name}`, validation)} 
        ></textarea>
      ) : (
        <input
          id={id}
          type={type}
          className={cn(input_tailwind)}
          placeholder={placeholder}
          {...register(name, validation)}
        />
      )}
    </div>
  );
};

// Input Error Component 
const InputError = ({ message }) => {
  return (
    <motion.p
      className="flex items-center gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md"
      {...framer_error} 
    >
      <MdError />
      {message}
    </motion.p>
  );
};

const framer_error = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2 },
};

// Form Component
export const Form = () => {
  const methods = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data); // Handle form submission (e.g., API call)
    methods.reset(); 
    setSuccess(true);
  });

  // Validation Rules (You can define these separately as well)
  const name_validation = {
    name: 'name',
    label: 'name',
    type: 'text',
    id: 'name',
    placeholder: 'write your name ...',
    validation: {
      required: {
        value: true,
        message: 'Name is required',
      },
      maxLength: {
        value: 30,
        message: '30 characters max',
      },
    },
  };

  const password_validation = {
    // ... (similar structure for other fields)
  };

  // Add more validation objects for email, number, description, etc.

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={e => e.preventDefault()} // Prevent default form submission
        noValidate
        autoComplete="off"
        className="container" 
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input {...name_validation} />
          <Input {...password_validation} />
          {/* ... add other input fields here ... */}
        </div>
        <div className="mt-5">
          {success && ( 
            <p className="flex items-center gap-1 mb-5 font-semibold text-green-500">
              <BsFillCheckSquareFill /> Form has been submitted successfully
            </p>
          )}
          <button
            onClick={onSubmit}
            className="flex items-center gap-1 p-5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-800"
          >
            <GrMail />
            Submit Form
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

