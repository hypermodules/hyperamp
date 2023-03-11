const test = require('tape')
const { formatCount } = require('./lib')

test('format disk and track objects correctly', function (t) {
  const tests = [
    {
      in: { no: 14, of: 17 },
      expect: '14 of 17'
    },
    {
      in: { no: 0, of: 0 },
      expect: ''
    },
    {
      in: { no: 5, of: 0 },
      expect: '5'
    }
  ]

  tests.forEach(function (testCase) {
    t.equal(formatCount(testCase.in), testCase.expect, `${JSON.stringify(testCase.in)} formats to ${testCase.expect}`)
  })

  t.end()
})
