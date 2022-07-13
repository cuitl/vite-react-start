import { useState } from 'react'
import { FormattedMessage, FormattedNumber, IntlProvider } from 'react-intl'

// Translated messages in French with matching IDs to what you declared
const messagesInFrench = {
  myMessage: "Aujourd'hui, c'est le {ts, date, ::yyyyMMdd}",
}

const messagesInChinese = {
  myMessage: '当前日期: {ts, date, ::yyyyMMdd}',
}

export default function LangTestPage() {
  const [message, setMessage] = useState(messagesInFrench)
  const [toggle, setToggle] = useState(false)

  const onLangChange = () => {
    if (!toggle) {
      setMessage(messagesInChinese)
    } else {
      setMessage(messagesInFrench)
    }
    setToggle(!toggle)
  }

  return (
    <IntlProvider messages={message} locale="fr" defaultLocale="en">
      <div className="bg-gray-800 text-light-400 text-center h-100vh">
        <div className="border-b-1px border-b-blue-500 w-screen py-4">
          <FormattedMessage
            id="myMessage"
            defaultMessage="Today is {ts, date, ::yyyyMMdd}"
            values={{ ts: Date.now() }}
          />
        </div>

        <div className="py-4 border-b-1px border-b-blue-500">
          <FormattedNumber value={19} style="currency" currency="EUR" />
        </div>

        <button
          className="flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1 my-4 w-400px mx-auto"
          onClick={onLangChange}
        >
          Change
        </button>
      </div>
    </IntlProvider>
  )
}
