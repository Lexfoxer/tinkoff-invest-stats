import { getOrderBook } from './../plugins/tinkoff.invest.js';
import { fixed, round } from './../helpers.js';

const calcStats = async (s, p) => {
  const res = { debit: {}, commission: {} };
  const resByTicket = [];

  // Расчет дохода каждой компании в портфеле
  // по сравнению с их текущей стоимостью
  for (const a in p) {
    for (const k in s[a].payment) {
      s[a].payment[k] = round(p[a].totalPrice + s[a].payment[k])
    }
    s[a].inStock = true
  }

  // Суммирование
  for (const a in s) {
    for (const b in s[a].payment) {
      res.debit[b] = round((res.debit[b] || 0) + s[a].payment[b]);
    }

    for (const b in s[a].commission) {
      res.commission[b] = round((res.commission[b] || 0) + s[a].commission[b]);
    }

    const dataItem = {
      name: s[a].name,
      value: s[a].payment.USD || s[a].payment.RUB,
      currency: s[a].payment.USD ? 'USD' : 'RUB',
      inStock: Boolean(s[a].inStock),
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

  // Получить стоимость USD
  const { lastPrice: lastPriceUsd } = await getOrderBook('BBG0013HGFT4');

  resByTicket.map(el => {
    el.valueInRub = el.currency === 'USD'
      ? round(el.value * lastPriceUsd)
      : el.value;
    return el;
  })

  resByTicket.sort((a, b) => {
    if (a.currency > b.currency) return 1;
    if (a.currency < b.currency) return -1;
    return 0;
  });
  resByTicket.sort((a, b) => b.valueInRub - a.valueInRub);
  resByTicket.sort((a, b) => b.inStock - a.inStock);

  return {
    res,
    resByTicket,
  };
}


export default calcStats;
