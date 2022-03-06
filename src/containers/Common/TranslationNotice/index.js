import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import completedLanguages from '../../../locales/completed.json'

const Message = () => {
  const { t } = useTranslation()

  return (
    <div>
      <div>{t('translationNoticeText')}</div>
      <div>
        <a href="https://github.com/spartan-protocol/SpartanProtocol-DAppV2/issues/513">
          https://github.com/spartan-protocol/SpartanProtocol-DAppV2/issues/513
        </a>
      </div>
    </div>
  )
}

const TranslationNotice = () => {
  // check what language user is using and return translation notice
  // if the dApp hasn't been fully translated to this language
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language

  // prevent toast from showing up, when it was closed
  const [toastClosed, setToastClosed] = useState(false)

  if (completedLanguages.includes(currentLanguage) || toastClosed) return null

  // use 100% width on mobile screens
  const width = window.screen.width > 600 ? '80vw' : '100vw'

  toast.info(<Message />, {
    toastId: 'translation-notice',
    position: toast.POSITION.BOTTOM_LEFT,
    style: {
      width,
    },
    autoClose: false,
    progress: false,
    theme: 'dark',
    icon: false,
    onClose: () => setToastClosed(true),
  })

  return <ToastContainer autoClose={false} />
}

export default TranslationNotice
