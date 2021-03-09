import columnify from 'columnify'
import { fixed, numberWithSpaces } from './../helpers.js';


export default columnify;

export const showStatisticByName = (data) => columnify(data, {
  columns: ['name', 'valueInRub', 'value', 'currency'],
  config: {
    valueInRub: {
      align: 'right',
      headingTransform: () => {
        return 'IN RUB'
      },
      dataTransform: (val) => {
        return numberWithSpaces(fixed(val));
      },
    },
    value: {
      align: 'right',
      headingTransform: () => {
        return 'VALUE'
      },
      dataTransform: (val) => {
        return numberWithSpaces(fixed(val));
      },
    },
    currency: { align: 'right' },
  }
});
