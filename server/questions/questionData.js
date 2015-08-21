module.exports = [{
  qNumber: 1,
  title: "Capital Words",
  points: 5,
  description: "Validate whether a given string starts with a capital letter",
  truthy: ['Home', 'PC', 'Microsoft', 'Hack Reactor', 'London'],
  falsy: ['table', 'computer', 'hello', 'hEllo', '$Hello'],
  hints: ['What character could you use to specify the beginning of the string?', 'How do you select all alphanumeric characters with Regex?', 'Try using ^ and brackets!']
}, {
  qNumber: 2,
  title: "Does a Word Contain One 'a'",
  points: 5,
  description: "Validate whether the given word contains one and only one letter 'a'.",
  truthy: ['Apple', 'Marcus', 'hamburger', 'example', 'China'],
  falsy: ['Aaron', 'bottle', 'Canvas', 'PC', 'hackreactor'],
  hints: ['How do you select 0 or 1 characters in a string?', 'How do you account for both lowercase and uppercase letters?']
}, {
  qNumber: 3,
  title: "Username Validation",
  points: 5,
  description: "Determine whether a given username is valid according to the following restrictions: A username has to be between 6 and 10 characters and can only contain alphanumeric characters and '_'!",
  truthy: ['myname', 'ali_gator', '12345678', 'alpha123', '_USER_'],
  falsy: ['myreallylongname', '@symbol', '@#$%^&*()', 'name', '$myName$'],
  hints: ['How do you specify lengths in regex?', 'Try using positive look ahead']
}, {
  qNumber: 4,
  title: "Find Prices",
  points: 7,
  description: "Determine whether the given string is a valid price",
  truthy: ['$123', '$0', '$0.50', '$99.99', '$102472349.17'],
  falsy: ['hello', '123', '$0.577', '$123.4.3', '$823.h'],
  hints: ['Start here: what should each string begin with?', 'How do you restrict input to just numbers?', 'How do you account for decimal points?']
}, {
  qNumber: 5,
  title: "Hex Color Code",
  points: 10,
  description: "Determine whether a given string is valid Hex color code.",
  truthy: ['#FFF', '#abcabc', '#123', '#4d2', '#83e9db'],
  falsy: ['fff', '123123', '%FFF', '#897f', '#44444444'],
  hints: ['What should each string begin with?', 'In how many ways can hexadecimal codes be represented?']
}, {
  qNumber: 6,
  title: "Valid Number?",
  points: 10,
  description: "Match a valid phone number.",
  truthy: ['(123) 321-4444', '444-444-989', '000.123.4321', '(111) 111-1111', '752-491-4234'],
  falsy: ['(2342) 342-444', '4447864673', '(231) 770-000', '111.111.232.1', '888,888,8976'],
  hints: ['How many digits should be in each position?', 'What are acceptable number separators?']
}, {
  qNumber: 7,
  title: "Validate Password",
  points: 10,
  description: "Validate a password to have the following criteria:  \n8-16 characters \nmust include: 1 lowercase, 1 uppercase, 1 number \nonly lowercase, uppercase, and numbers are valid",
  truthy: ['Password1234', '111xxxYY', '123456aA', 'fhewoh123EWD', '12345abcdeFGHIJK'],
  falsy: ['#Password1234', '12345aA', 'no$pesialCharacter5', 'paws&*fsB', 'ThisIsTooLongOfAPassword'],
  hints: ['How do you specify lengths in regex?', 'Try using positive look ahead']
}, {
  qNumber: 8,
  title: "Date",
  description: "Determine whether or not an input is a valid date. \nE.g. YYYY/MM/DD or YYYY-MM-DD \nMonths and days must be in valid ranges",
  truthy: ['1918/11/11', '2010/06/13', '2015-05-01', '1100-12-04', '1933/4/12'],
  falsy: ['1234/323/4', '19e4/12/01', '1944/15/28', '2003/3/55'],
  hints: ['How many numbers can potentially occupy each space?', 'What are the upper and lower limits for each space?', 'Consider how you might check acceptable year/month/day separators']
}, ];
