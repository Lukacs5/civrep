export interface User {
  id: number;
  title: string; // Required
  lastName: string; // Required
  firstName: string; // Required
  middleName?: string;
  gender: 'Nő' | 'Férfi'; // Required
  maidenName?: string;
  placeOfBirth: string; // Required
  dateOfBirth: Date; // Required, cannot be before 1900
  citizenship: string; // Required
  taxIdentificationNumber: string; // Required, must be 11 characters long, start with 8, and contain at least one '2'
  loanEligibility: 'Igen' | 'Nem'; // Fixed, based on conditions
}
