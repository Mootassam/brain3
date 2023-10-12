import UserModel from "../models/User";
import CountryFormat from "./CountryFormat";
class PhoneNumberGenerator {
  static async generatePhoneNumbers(req) {
    let countryCode = req.body.country.value;
    const phoneNumbers: string[] = [];
    const formatFunction = CountryFormat[countryCode];
    for (let i = 0; i < 1000; i++) {
      let phoneNumber = await formatFunction();
      let isDuplicate = await this.checkDuplicatePhoneNumber(phoneNumber);
      if (!isDuplicate) {
        phoneNumbers.push(phoneNumber);
      }
    }
    return phoneNumbers;
  }
  static async checkDuplicatePhoneNumber(
    phoneNumber: string
  ): Promise<boolean> {
    const existingUser = await UserModel.findOne({ phonenumber: phoneNumber });
    return !!existingUser;
  }
  // static generatePhoneNumber(req) {
  //   // HK //
  //   // const areaCode = "852"; // Hong Kong's country code
  //   // const validFirstDigits = ["5", "6", "9"];

  //   // India
  //   const areaCode = "91"; // Hong Kong's country code
  //   const validFirstDigits = ["7", "8", "9", "6"];
  //   const firstDigit =
  //     validFirstDigits[Math.floor(Math.random() * validFirstDigits.length)];
  //   const number = Math.floor(Math.random() * 900000000) + 100000000; // Random 7-digit number
  //   return areaCode + firstDigit + number;
  // }
}

export default PhoneNumberGenerator;
