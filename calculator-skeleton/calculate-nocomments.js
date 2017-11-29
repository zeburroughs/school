function operate(a, operator, b) {
  switch (operator) {
    case '+':
      return a + b
      break;
    case '-':
      return a - b
      break;
    case '/':
      return a / b
      break;
    case '*':
      return a * b
      break;
  }
}

function calculate (list) {
  let total = 0
  let operator = '+'
  list.forEach(function (item) {
    let number = parseFloat(item)
    total = operate(total, operator, number);
    operator = item.split('').reverse()[0]
  })
  return total
}

function parse (equation) {
  let regex = /[0-9].*?[\+\-\*\/](?=[0-9])|[0-9\.]+/g
  let list = equation.match(regex)
  return list
}


function allowFloatsOnly (e) {
  if (!!parseInt(e.key)) return
  if (e.key === '0') return
  if (e.key === '.') return
  if (e.key === '+') return
  if (e.key === '-') return
  if (e.key === '/') return
  if (e.key === '*') return
  if (e.key === 'Backspace') return
  if (e.key === 'Enter' || e.key === '=') e.target.value = calculate(parse(e.target.value))
  e.preventDefault()
}
