import { figiCurrencies } from '../constants.js';
import { round } from './../helpers.js';
import { getOrderBook } from "./../plugins/tinkoff.invest.js";

const calcPortfolio = async (positions) => {
  const portfolio = {};

  const figiCurrenciesList = figiCurrencies.map(el => el.figi);

  for (const f of positions) {
    // Исключаем из статистики действия с валютой
    if (figiCurrenciesList.includes(f.figi)) {
      continue
    }

    const figi = f.figi;
    if (!portfolio[figi]) {
      portfolio[figi] = {};
    }
    portfolio[figi].balance = f.balance

    const orderBook = await getOrderBook(figi)
    portfolio[figi].totalPrice = round(orderBook.lastPrice * f.balance)
    portfolio[figi].orderBook = orderBook
  }

  return portfolio;
}


export default calcPortfolio;
