export default function CanUseDOM () {
  return !!((typeof window !== 'undefined' && window.document && window.document.createElement))
}
