import envs from './../plugins/dotenv.js';
import OpenAPI from '@tinkoff/invest-openapi-js-sdk';

const apiURL = 'https://api-invest.tinkoff.ru/openapi'
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const secretToken = envs.API_TOKEN;

const sdk = new OpenAPI({ apiURL, secretToken, socketURL });


// SDK
export default sdk;

// Functions
export async function getOperations(figi, dateStart) {
  const params = {
    from: dateStart
      ? dateStart.toISOString()
      : (new Date(2015, 0, 1)).toISOString(),
    to: (new Date()).toISOString(),
  };

  if (figi) {
    params.figi = figi;
  }

  const { operations } = await sdk.operations(params);
  return operations;
}

export async function getPortfolio() {
  const { positions } = await sdk.portfolio();
  return positions;
}

export async function getTicketInfo(figi) {
  const data = await sdk.searchOne({ figi });
  return data;
}

export const getOrderBook = async (figi) => {
  const data = await sdk.orderbookGet({ figi, depth: 1 });
  return data;
}
