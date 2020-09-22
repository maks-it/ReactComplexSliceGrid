export default function GetSiteLang (host) {
  let siteLang = host.split('.').shift()
  if (!['en', 'it', 'ru'].includes(siteLang)) {
    siteLang = 'en'
  }

  return siteLang
}
