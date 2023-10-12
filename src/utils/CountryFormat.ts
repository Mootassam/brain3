const UkFormat = () => {};
const UsFormat = () => {};
const InFormat = () => {
  const areaCode = "91"; // India's country code
  const validFirstDigits = ["7", "8", "9", "6"];
  const firstDigit = validFirstDigits[Math.floor(Math.random() * validFirstDigits.length)];
  const number = Math.floor(Math.random() * 900000000) + 100000000; // Random 7-digit number
  return areaCode + firstDigit + number;
};
const HkFormat = () => {
  const areaCode = "852"; // Hong Kong's country code
  const validFirstDigits = ["5", "6", "9"];
  const firstDigit = validFirstDigits[Math.floor(Math.random() * validFirstDigits.length)];
  const number = Math.floor(Math.random() * 9000000) + 1000000; // Random 7-digit number
  return areaCode + firstDigit + number;
};
const CountrFormat = { HK: HkFormat, IN: InFormat };
export default CountrFormat;
