export function getAllYear () { // 前二十年
  let y = new Date().getFullYear()
  let yearList = []
  for (let i = y; i > (y - 20); i--) {
    let obj = {
      label: i,
      value: i + ''
    }
    yearList.push(obj)
  }
  return yearList
}
