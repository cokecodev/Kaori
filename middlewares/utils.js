function checkIsRouteValid(input){
  if (Number.isNaN(input)|| input == 0) return false
  return true
}

module.exports = {
  checkIsRouteValid,
}
