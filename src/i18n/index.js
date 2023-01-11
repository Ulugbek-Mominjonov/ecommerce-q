import uz from './uz'
import uk from './uk'
import ru from './ru'

import xs_uz from './xs/uz'
import xs_uk from './xs/uk'
import xs_ru from './xs/ru'
//
const ext_ru = Object.assign(ru, xs_ru);
const ext_uz = Object.assign(uz, xs_uz);
const ext_uk = Object.assign(uk, xs_uk);
export default {
  'uz': ext_uz,
  'uk': ext_uk,
  'ru': ext_ru
}
