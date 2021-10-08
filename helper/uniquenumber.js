function uniqueNumber(number) {
  let uidNumber = "";
  for (let i = 0; i < number; i++) {
    uidNumber += Math.floor(Math.random() * 10);
  }
  return uidNumber;
};

module.exports = uniqueNumber;
