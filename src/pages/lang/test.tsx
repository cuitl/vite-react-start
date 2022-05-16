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
      <p>
        <FormattedMessage
          id="myMessage"
          defaultMessage="Today is {ts, date, ::yyyyMMdd}"
          values={{ ts: Date.now() }}
        />
        <br />
        <FormattedNumber value={19} style="currency" currency="EUR" />
      </p>

      <button onClick={onLangChange}>Change</button>
    </IntlProvider>
  )
}
