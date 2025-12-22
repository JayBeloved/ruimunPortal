/**
 * @fileoverview This file contains the list of authorized admin emails.
 * 
 * To add a new admin, simply add their email address to the ADMIN_EMAILS array.
 * To remove an admin, remove their email address from the array.
 * 
 * This list is used by the middleware to protect the admin routes.
 */

export const ADMIN_EMAILS = [
  'contact.johnjlawal@gmail.com',
  // Add any other admin emails here, for example:
  // 'admin2@example.com',
];
