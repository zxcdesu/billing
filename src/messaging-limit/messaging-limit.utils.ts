export class MessagingLimitUtils {
  static getMonthAndYear(date = new Date()): [number, number] {
    return [date.getMonth(), date.getFullYear()];
  }
}
