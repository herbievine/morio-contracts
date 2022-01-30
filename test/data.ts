import { v4 } from 'uuid'

const testData: {
  id: string
  title: string
  content: string
  updatedAt: string
  createdAt: string
}[] = []

for (let i = 0; i < 10; i++) {
  testData.push({
    id: v4(),
    title: `Note number ${i + 1}`,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at nisi ut tortor lobortis aliquam ut eu turpis. Praesent ipsum nisi, cursus at mi at, congue pulvinar felis. Aenean porta, mauris rhoncus aliquet pulvinar, elit mauris lacinia massa, ac varius ante urna ut risus. In euismod suscipit lacus et varius. Proin in iaculis est, nec pretium massa. Mauris facilisis aliquam mauris, vel pharetra nisi pellentesque eget. Vestibulum et tempus orci, ut faucibus purus. Ut porttitor nibh ut commodo euismod. Donec eget dui purus. Mauris pretium, dolor vel vehicula facilisis, lacus leo molestie magna, ac porttitor justo odio et nulla. ',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  })
}

export { testData }
