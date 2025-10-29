// 判断是否为number类型
const asNumber = (val: number) => {
  const isNum = typeof val == 'number'
  if (!isNum) throw new Error('is not a number')
  return val
}

export default function vw(px: number, base = 750, unit = true) {
  asNumber(px)
  asNumber(base)
  return (Math.round(px) / base) * 100 + (unit ? 'vw' : '')
}
