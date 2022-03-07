import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Toast, ToastContainer } from 'react-bootstrap'
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
  const { i18n, t } = useTranslation()

  const [show, setShow] = useState(false)
  useEffect(() => {
    if (completedLanguages.includes(i18n.language)) {
      setShow(false)
    } else {
      setShow(true)
    }
  }, [i18n.language])

  return (
    <ToastContainer
      position="top-end"
      style={{ marginTop: '70px', marginRight: '3px' }}
    >
      <Toast onClose={() => setShow(false)} show={show}>
        <Toast.Header>
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
