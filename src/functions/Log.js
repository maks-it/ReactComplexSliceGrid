const Log = (message) => {
  // const dateTimeFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  console.log(`${new Date().toUTCString()}: SSR. ${message}`)
}
export default Log
