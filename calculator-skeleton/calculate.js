function operate(a, operator, b) {
  switch (operator) {
    // if operator is + then add
    case '+':
      return a + b
      break;
    // if operator is - then subtract
    case '-':
      return a - b
      break;
    // if operator is + then divide
    case '/':
      return a / b
      break;
    // if operator is + then multiply
    case '*':
      return a * b
      break;
  }
}

function calculate (list) {
  // reset the total everytime you call this function.
  let total = 0
  // reset the default operator to a + sign.
  let operator = '+'
  // go through each item in the list. then run a function.
  list.forEach(function (item) {
    // get the number from that item. parseFloat('1.24+-') = 1.24
    let number = parseFloat(item)
    // add, subtract, multiply, or divide from the total.
    total = operate(total, operator, number);
    // set the next operator. if item = '1.24+-'
    // then the operator would be a - sign
    operator = item.split('').reverse()[0]
  })
  // return the total
  // this makes it so calculate() = total
  return total
}

function parse (equation) {
  // this is the regular expression for finding numbers and their operator.
  // use https://regex101.com/ to play around with regular expression.
  let regex = /[0-9].*?[\+\-\*\/](?=[0-9])|[0-9\.]+/g
  // take all the matches that were found by the regular expression and put it in a list.
  let list = equation.match(regex)
  // return the list.
  // this makes it so parse() = list
  return list
}


function allowFloatsOnly (e) {
  // double exclamation points is the inverse of an inverse. So it always returns true or false.
  // !false = true; !true = false; !!true = true; !!false = false;
  // this line checks if the key is a nubmer
  if (!!parseInt(e.key)) return
  // this line checks if the key is a 0
  if (e.key === '0') return
  // this line checks if the key is a .
  if (e.key === '.') return
  // this line checks if the key is a +
  if (e.key === '+') return
  // this line checks if the key is a -
  if (e.key === '-') return
  // this line checks if the key is a /
  if (e.key === '/') return
  // this line checks if the key is a *
  if (e.key === '*') return
  // this line checks if the key is a Backspace
  if (e.key === 'Backspace') return
  // this line checks if the key is a Enter or an =
  // if it is it takes the value of the input and calculates the parsed values.
  // for example calculate(parse('1+2+3')) would equal 6
  // also notice that this line does not have a RETURN statement. That's because if I did it would
  // show the equal sign inside of the input.
  if (e.key === 'Enter' || e.key === '=') e.target.value = calculate(parse(e.target.value))
  // if the value did not RETURN then prevent it from writing to the input.
  e.preventDefault()
}
