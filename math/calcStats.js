import { getOrderBook } from './../plugins/tinkoff.invest.js';
import { fixed, round } from './../helpers.js';
import { figiCurrencies } from './../constants.js';

const calcStats = async (stats, portfolio) => {
  const res = { debit: {}, commission: {} };
  const resByTicket = [];

  // Расчет дохода каждой компании в портфеле
  // по сравнению с их текущей стоимостью
  for (const portfolioItem in portfolio) {
    for (const currency in stats[portfolioItem].payment) {
      stats[portfolioItem].payment[currency] = round(portfolio[portfolioItem].totalPrice + stats[portfolioItem].payment[currency])
    }
    stats[portfolioItem].inStock = true
  }

  // Суммирование
  for (const portfolioItem in stats) {
    for (const currency in stats[portfolioItem].payment) {
      res.debit[currency] = round((res.debit[currency] || 0) + stats[portfolioItem].payment[currency]);
    }

    for (const currency in stats[portfolioItem].commission) {
      res.commission[currency] = round((res.commission[currency] || 0) + stats[portfolioItem].commission[currency]);
    }

    const dataItem = {
      name: stats[portfolioItem].name,
      value: Object.values(stats[portfolioItem].payment)[0],
      currency: Object.keys(stats[portfolioItem].payment)[0],
      inStock: Boolean(stats[portfolioItem].inStock),
    };

    resByTicket.push(dataItem);
  }


  // Форматируем для отображения
  for(const k in res.debit) {
    res.debit[k] = fixed(round(res.debit[k]));
  }
  for(const k in res.commission) {
    res.commission[k] = fixed(round(res.commission[k]));
  }

  // Получить стоимость валют
  const lastPrice = {};
  try {
    const asyncGets = figiCurrencies.map(async (currency) => {
      lastPrice[currency.name] = (await getOrderBook(currency.figi)).lastPrice;
    })

    await Promise.all(asyncGets);
  } catch(e) {
    console.error('Не удалось получить стоимость валют');
    throw Error(e);
  }

  console.log(lastPrice);

  resByTicket.map(el => {
    if (el.currency !== 'RUB') {
      el.valueInRub = round(el.value * lastPrice[el.currency]);
    } else {
      el.valueInRub = el.value;
    }
    return el;
  })

  resByTicket.sort((portfolioItem, b) => {
    if (portfolioItem.currency > b.currency) return 1;
    if (portfolioItem.currency < b.currency) return -1;
    return 0;
  });
  resByTicket.sort((portfolioItem, b) => b.valueInRub - portfolioItem.valueInRub);
  resByTicket.sort((portfolioItem, b) => b.inStock - portfolioItem.inStock);

  return {
    res,
    resByTicket,
  };
}


export default calcStats;
