import * as pinyin from 'pinyin'

export const convert = (sent: string) => {
  return pinyin(sent, {
    style: pinyin.STYLE_NORMAL,
    heteronym: true
  }).map(array  => array.join('')).join('')
};