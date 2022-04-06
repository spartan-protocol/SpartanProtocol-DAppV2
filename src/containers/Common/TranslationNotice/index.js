import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import completedLanguages from '../../../locales/completed.json'

const Message = () => {
  const { t } = useTranslation()

  return (
    <div>
      <div>{t('translationNoticeText')}</div>
      <div>
        <a
          href="https://github.com/spartan-protocol/SpartanProtocol-DAppV2/issues/513"
          className="toast-link"
        >
          https://github.com/spartan-protocol/SpartanProtocol-DAppV2/issues/513
        </a>
      </div>
    </div>
  )
}

const TranslationNotice = () => {
  // check what language user is using and return translation notice
  // if the dApp hasn't been fully translated to this language
  const { i18n, t } = useTranslation()

  const [show, setShow] = useState(false)
  useEffect(() => {
    const lang = i18n.language.split('-')[0]
    if (completedLanguages.includes(lang)) {
      setShow(false)
    } else {
      setShow(true)
    }
  }, [i18n.language])

  return (
    <ToastContainer
      position="top-end"
      style={{ marginTop: '50px', marginRight: '20px' }}
    >
      <Toast onClose={() => setShow(false)} show={show} className="bg-2">
        <Toast.Header className="bg-2">
          <strong className="me-auto">{t('translationNoticeTitle')}</strong>
        </Toast.Header>
        <Toast.Body>
          <Message />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default TranslationNotice
