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
    <div className="bg-gray-800 text-light-400 text-center h-100vh">
      <h1 className="border-b-1px border-b-blue-200 py-4">LangPage</h1>
      <main className="w-screen py-2">
        <span>{intl.formatMessage({ id: 'hello' })}</span>
        <br />
        <button
          className="inline-flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1 my-4"
          onClick={onLangChange}
        >
          切换语言
        </button>
        <br />
        <Link
          className="border-1px border-blue-600 border-solid py-2 px-5 rounded-md text-blue-300 hover:text-blue-400 no-underline"
          to="/lang/test"
        >
          to test
        </Link>
      </main>
    </div>
  )
}
