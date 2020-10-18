const CanUseDOM = () => {
  return !!((typeof window !== 'undefined' && window.document && window.document.createElement))
}

export {
  CanUseDOM
}