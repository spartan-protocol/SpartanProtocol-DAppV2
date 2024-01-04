import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Icon } from '../../components/Icons'
import { friends } from './types'
import styles from './styles.module.scss'

const Friends = () => (
  <>
    <Row>
      {friends.map((item) => (
        <Col key={item.name} className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <Icon
                icon={item.logo}
                width="100%"
                style={{ marginTop: '8px', marginBottom: '8px' }}
              />
            </Card.Header>
            <Card.Body style={{ minHeight: '105px', textAlign: 'center' }}>
              {item.desc}
              <br />
              <br />
              <small>Providing: {item.providing}</small>
            </Card.Body>
            <Card.Footer>
              <Row>
                {item.linkText.map((child, index) => (
                  <Col key={child} className={styles.buttons}>
                    <a
                      href={item.linkUrl[index]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button className="w-100">{child}</Button>
                    </a>
                  </Col>
                ))}
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  </>
)

export default Friends
