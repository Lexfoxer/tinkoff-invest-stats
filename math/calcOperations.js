import { getTicketInfo } from "./../plugins/tinkoff.invest.js";
import { round } from "./../helpers.js";

const calcOperations = async (operations) => {
  const statsServiceCommission = { value: 0 };
  const stats = {};

  for (const data of operations) {
    // Исключаем из статистики действия с валютой
    if (data.figi === 'BBG0013HGFT4') { // BBG0013HGFT4 => USD
      continue
    }

    if (data.operationType === 'ServiceCommission') {
      statsServiceCommission.value =
        round(statsServiceCommission.value + data.payment)
    }

    if (data.status !== "Done" || !data.figi) {
      continue
    }

    if (!stats[data.figi]) {
      stats[data.figi] = {
        payment: {},
        commission: {},
      }
    }

    if (['Buy', 'BuyCard', 'Sell'].includes(data.operationType)) {
      if (data.operationType === 'Sell') {
        stats[data.figi].payment[data.currency] = round(
          (stats[data.figi].payment[data.currency] || 0)
          + Math.abs(data.payment)
        )
      } else {
        stats[data.figi].payment[data.currency] = round(
          (stats[data.figi].payment[data.currency] || 0)
          - Math.abs(data.payment)
        )
      }

      if (data.commission) {
        stats[data.figi].commission[data.commission.currency] = round(
          (stats[data.figi].commission[data.commission.currency] || 0)
          + Math.abs(data.commission.value)
        )
      }
    }
  }

  const promisesRequests = [];
  for (const figi in stats) {
    promisesRequests
      .push(getTicketInfo(figi).then(({ name }) => stats[figi].name = name));
  }
  await Promise.all(promisesRequests);

  return {
    statsServiceCommission: Math.abs(statsServiceCommission.value),
    stats,
  };
}


export default calcOperations;
