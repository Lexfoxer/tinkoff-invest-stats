import { round } from './../helpers.js';
import { getOrderBook } from "./../plugins/tinkoff.invest.js";

const calcPortfolio = async (positions) => {
  const portfolio = {};

  for (const f of positions) {
    // Исключаем из статистики действия с валютой
    if (f.figi === 'BBG0013HGFT4') { // BBG0013HGFT4 => USD
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
