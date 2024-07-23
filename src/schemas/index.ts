import * as z from "zod";
import { UserRole } from "@prisma/client";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;


// the below code was causing the error for the ADMIN undefined while building the project in vercel


// export const SettingsSchema = z.object({
//   name: z.optional(z.string()),
//   isTwoFactorEnabled: z.optional(z.boolean()),
//   role: z.enum([UserRole.ADMIN, UserRole.USER]),
//   email: z.optional(z.string().email()),
//   password: z.optional(z.string().min(6)),
//   newPassword: z.optional(z.string().min(6)),
// })
//   .refine((data) => {
//     if (data.password && !data.newPassword) {
//       return false;
//     }

//     return true;
//   }, {
//     message: "New password is required!",
//     path: ["newPassword"]
//   })
//   .refine((data) => {
//     if (data.newPassword && !data.password) {
//       return false;
//     }

//     return true;
//   }, {
//     message: "Password is required!",
//     path: ["password"]
//   })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }).regex(passwordRegex, {
    message: "Password must have at least one uppercase letter, one lowercase letter, one digit, and one special character",
  }),
  confirmpassword: z.string()
}).refine(
  (values) =>
   values.password === values.confirmpassword
  ,
  {
    message: "Please enter the same Password !",
    path: ["confirmpassword"],
  }
);

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});



export const NameUpdateSchema = z.object({
  firstname: z.string().min(1, {
    message: "firstname is required",
  }),
  lastname: z.string().min(1, {
    message: "lastname is required",
  }),
})



export const EmailUpdateSchema = z.object({
  email: z.string()
    .trim()
    .email({
      message: "Invalid email format",
    })
    .max(320, {
      message: "Email must be 320 characters or fewer",
    })
    .nonempty({
      message: "Email is required",
    }),
});

export const RegisterSchema = z.object({
  firstname: z.string().min(1, {
    message: "firstname is required",
  }),
  lastname: z.string().min(1, {
    message: "lastname is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }).regex(passwordRegex, {
    message: "Password must have at least one uppercase letter, one lowercase letter, one digit, and one special character",
  }),
  confirmpassword: z.string()
}).refine(
  (values) =>
   values.password === values.confirmpassword
  ,
  {
    message: "Please enter the same Password !",
    path: ["confirmpassword"],
  }
)

export const AddressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }).max(255),
  landmark: z.string().min(1, { message: "Landmark is required" }).max(255),
  city: z.string()
  .min(3, { message: "City should be at least 3 characters" })
  .max(255)
  .nonempty({ message: "City is required" })
  .regex(/^[^\d]+$/, { message: "City cannot contain numbers" }),
state: z.string()
  .min(3, { message: "State should be at least 3 characters" })
  .max(255)
  .nonempty({ message: "State is required" })
  .regex(/^[^\d]+$/, { message: "State cannot contain numbers" }),
country: z.string()
  .min(3, { message: "Country should be at least 3 characters" })
  .max(255)
  .nonempty({ message: "Country is required" })
  .regex(/^[^\d]+$/, { message: "Country cannot contain numbers" }),
  postalCode: z
  .string()
  .nonempty({ message: "Postal code is required" })
  .regex(/^\d+$/, { message: "Postal code must be a number" }),
  firstName: z.string().min(1, { message: "First name is required" }).max(100),
  lastName: z.string().min(1, { message: "Last name is required" }).max(100),
  apartment: z.string().min(1, { message: "Apartment is required" }).max(100),
  phoneNumber: z
  .string()
  .nonempty({ message: "Phone number is required" })
  .regex(/^\d+$/, { message: "Phone number must be a number" }),


});



const isFutureDate = (expirationDate: string) => {
  const [month, year] = expirationDate.split('/').map(Number);
  const today = new Date();
  const expiration = new Date(2000 + year, month - 1); // Adjust the year to full year

  return expiration > today;
};



export const PaymentSchema = z.object({
  cardNumber: z
    .string()
    .nonempty({ message: "Card number is required" })
    .regex(/^\d{13,19}$/, { message: "Card number must be a number between 13 and 19 digits " }),
    expirationDate: z
    .string()
    .nonempty({ message: "Expiration date is required" })
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiration date must be in MM/YY format" })
    .refine(isFutureDate, { message: "Expiration date must be in the future" }),
  cvv: z
    .string()
    .nonempty({ message: "CVV is required" })
    .regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 number and not alphabets" }),
  nameOnCard: z
    .string()
    .nonempty({ message: "Name on card is required" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name on card must contain only letters and not numbers" }), // Ensures only alphabetic characters and spaces
});



// Define the schema
export const ReviewSchema = z.object({
  rating: z.number()
    .min(1, { message: 'Please add the Rating' })
    .max(5, { message: 'Rating must be at most 5' })
    .int({ message: 'Rating must be an integer' })
    .nonnegative({ message: 'Rating must be a positive number' }),
    images: z.array(z.string().url().refine(url => url.endsWith('.jpeg') || url.endsWith('.jpg'), {
      message: 'Only JPEG files are allowed',
    })).optional(),
  title: z.string().optional(),
  review: z.string().optional(),
}).refine(
  data => (data.title && data.review) || (!data.title && !data.review),
  {
    message: 'Both title and review must be filled or both must be empty',
    path: ['title'], // You can set the path to highlight either title or review
  }
).refine(
  data => data.rating !== undefined && data.rating !== null,
  {
    message: 'Rating is required',
    path: ['rating'],
  }
);