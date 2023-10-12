import UserModel from "../models/User";

class PhoneNumberGenerator {
  static async generatePhoneNumbers() {
    const phoneNumbers: string[] = [];
    for (let i = 0; i < 1000; i++) {
      let phoneNumber = await this.generatePhoneNumber();
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
  static generatePhoneNumber(): string {
    const areaCode = "852"; // Hong Kong's country code
    const validFirstDigits = ["5", "6", "9"];
    const firstDigit =
      validFirstDigits[Math.floor(Math.random() * validFirstDigits.length)];
    const number = Math.floor(Math.random() * 9000000) + 1000000; // Random 7-digit number
    return areaCode + firstDigit + number;
  }
}

export default PhoneNumberGenerator;
