import columnify, { showStatisticByName } from './plugins/columnify.js';
import { getOperations, getPortfolio } from './plugins/tinkoff.invest.js';
import calcOperations from './math/calcOperations.js';
import calcPortfolio from './math/calcPortfolio.js';
import calcStats from './math/calcStats.js';

async function app({
  showDetail = true,
}) {
  const operations = await getOperations();
  const { stats, statsServiceCommission } = await calcOperations(operations);

  const positions = await getPortfolio();
  const portfolio = await calcPortfolio(positions);

  const {
    res: calcStatsResult,
    resByTicket: calcStatsResultByTicket,
  } = await calcStats(stats, portfolio);

  if (calcStatsResultByTicket.length > 0 && showDetail) {
    console.log('Статистика по активному портфелю:');
    console.log(
      showStatisticByName(calcStatsResultByTicket.filter(el => el.inStock))
    );
    console.log('\n');

    console.log('Статистика по закрытым позициям:');
    console.log(
      showStatisticByName(calcStatsResultByTicket.filter(el => !el.inStock))
    );
    console.log('\n');
  }

  console.log('За все время торговли на бирже "Доход":');
  console.log(columnify(calcStatsResult.debit, {
    showHeaders: false,
    config: {
      key: { minWidth: 10 },
      value: { align: 'right' },
    },
  }));
  console.log();

  console.log('За все время торговли на бирже "Комиссия":');
  console.log(columnify(calcStatsResult.commission, {
    showHeaders: false,
    config: {
      key: { minWidth: 10 },
      value: { align: 'right' },
    },
  }));
  console.log();

  console.log('Уплачено за обслуживание:', statsServiceCommission);
  console.log();

  console.log('--- При расчете не учитывались операции напрямую с валютой ---');
};


// Init
try {
  const globalArgs = process.argv.slice(2);
  const findArg = (a) => globalArgs.findIndex(el => el === a) > -1;

  const params = {
    showDetail: findArg('detail'),
  };

  (async () => await app(params))();
} catch(e) {
  console.error(e);
}
