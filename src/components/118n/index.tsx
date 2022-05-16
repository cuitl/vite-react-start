/**
 * @file 国际化公共组件
 */
import { ReactNode, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'

import en from '@/locales/en-US'
import zh from '@/locales/zh-CN'

export type Locale = 'zh-CN' | 'en-US'

const localeLangMap = {
  'zh-CN': zh,
  'en-US': en,
}

interface Provider118nProps {
  children: ReactNode
}

type SetLocale = (locale: Locale) => void
let __setLocale: SetLocale | undefined

export const setLocale = (locale: Locale) => {
  if (__setLocale) {
    localStorage.setItem('_locale', locale)
    __setLocale(locale)
  }
}

export const getLocale = () => {
  const locale = localStorage.getItem('_locale') as Locale
  return locale || 'en-US'
}

const useLocale = () => {
  const [locale, _setLocale] = useState<Locale>(getLocale)

  console.log('locale........', locale)

  useEffect(() => {
    __setLocale = _setLocale
    return () => {
      __setLocale = undefined
    }
  }, [])

  return {
    locale,
  }
}

export default function Provider118n(props: Provider118nProps) {
  const { locale } = useLocale()

  return (
    <IntlProvider
      messages={localeLangMap[locale]}
      locale={locale}
      defaultLocale="en-US"
    >
      {props.children}
    </IntlProvider>
  )
}