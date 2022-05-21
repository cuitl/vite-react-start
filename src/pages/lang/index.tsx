import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { getLocale, setLocale } from '@/components/i18n'

export default function LangPage() {
  const intl = useIntl()
  const locale = getLocale()
  console.log(intl, 'LangPage.....')

  const onLangChange = () => {
    if (locale === 'en-US') {
      setLocale('zh-CN')
    } else {
      setLocale('en-US')
    }
  }

  return (
    <div>
      <h1>LangPage</h1>
      <main>
        <span>{intl.formatMessage({ id: 'hello' })}</span>
        <br />
        <button onClick={onLangChange}>切换语言</button>
        <br />
        <Link to="/lang/test">test</Link>
      </main>
    </div>
  )
}
