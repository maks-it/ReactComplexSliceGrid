import CanUseDOM from './CanUseDOM'
import JwtDecode from './JwtDecode'

export default function Authorize (roles) {
  let authorized = false

  if (CanUseDOM()) {
    if (localStorage.getItem('auth')) {
      const token = JwtDecode(JSON.parse(localStorage.getItem('auth')).sysToken)

      console.log(`Authorize. User role: ${token.role}`)
      if (roles.includes(token.role)) {
        authorized = true
      }
    }
  }

  return authorized
}
