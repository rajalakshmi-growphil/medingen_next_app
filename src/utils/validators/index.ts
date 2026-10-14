export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhone(phone: string): boolean {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.trim());
}

export function isValidPincode(pincode: string): boolean {
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pincode.trim());
}
