import React from 'react'
import { Card, Col, Row, Button } from 'react-bootstrap'
import Immunefi from '../../assets/brands/immunefi-wht.svg'
import ImmunefiDark from '../../assets/brands/immunefi.svg'
import C4 from '../../assets/brands/C4.png'
import C4Dark from '../../assets/brands/C4Dark.png'
import Certik from '../../assets/brands/certik.svg'
import CertikDark from '../../assets/brands/certik-dark.svg'
import GitHub from '../../assets/brands/github-wht.svg'
import GitHubDark from '../../assets/brands/github-dark.svg'
import Moonlight from '../../assets/brands/moonlight.svg'
import OntoWallet from '../../assets/brands/ontoWhite.png'
import OntoWalletDark from '../../assets/brands/ontoDark.png'
import Coingecko from '../../assets/brands/coingecko.svg'
import CoingeckoDark from '../../assets/brands/coingecko-dark.svg'

const Friends = () => (
  <>
    <div className="content">
      <Row className="row-480 text-center">
        <Col xs="auto">
          <Card xs="auto" className="card-320" style={{ minHeight: '210px' }}>
            <Card.Header style={{ height: '49px' }}>
              {' '}
              <img
                src={Immunefi}
                alt="immunefi"
                className="rounded-0 friend-logo-dark"
              />
              <img
                src={ImmunefiDark}
                alt="immunefi"
                className="rounded-0 friend-logo-white"
              />
            </Card.Header>
            <Card.Body>
              Web3&apos;s leading bug bounty platform, protecting $100 billion
              in user funds.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://www.immunefi.com/bounty/spartanprotocol"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  View $100k Bounty
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-320" style={{ minHeight: '210px' }}>
            <Card.Header style={{ height: '49px' }}>
              {' '}
              <img
                src={C4}
                alt="codearena"
                height="26px"
                className="rounded-0 friend-logo-dark"
              />
              <img
                src={C4Dark}
                alt="codearena"
                height="26px"
                className="rounded-0 friend-logo-white"
              />
            </Card.Header>
            <Card.Body>
              C4 audit contests find more bugs faster than any other method.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://code423n4.com/reports/2021-07-spartan/"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  View $96k Contest
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-320" style={{ minHeight: '210px' }}>
            <Card.Header style={{ height: '49px' }}>
              {' '}
              <img
                src={Certik}
                alt="certik"
                height="26px"
                className="rounded-0 friend-logo-dark"
              />
              <img
                src={CertikDark}
                alt="certik"
                height="26px"
                className="rounded-0 friend-logo-white"
              />
            </Card.Header>
            <Card.Body>
              Utilizing best-in-class AI technology to secure & monitor
              blockchain protocols & smart contracts.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://github.com/spartan-protocol/resources/blob/master/certik-audit.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  View Audit
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-320" style={{ minHeight: '210px' }}>
            <Card.Header style={{ height: '49px' }}>
              {' '}
              <img
                src={GitHub}
                alt="github"
                height="26px"
                className="rounded-0 friend-logo-dark"
              />
              <img
                src={GitHubDark}
                alt="github"
                height="26px"
                className="rounded-0 friend-logo-white"
              />
            </Card.Header>
            <Card.Body>
              Everything built by the community is open source! GitHub is
              critical to enabling such transparency.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://github.com/spartan-protocol/spartanswap-contracts"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  Dont trust, verify!
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-320" style={{ minHeight: '210px' }}>
            <Card.Header style={{ height: '49px' }}>
              {' '}
              <img
                src={Moonlight}
                alt="moonlight"
                height="26px"
                className="rounded-0 me-1"
              />{' '}
              Moonlight
            </Card.Header>
            <Card.Body>
              Ground-breaking way of exploring tokens on BSC, visually revealing
              connections between wallets.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://bubbles.moonlighttoken.com/token/0x3910db0600ea925f63c36ddb1351ab6e2c6eb102"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="info" className="w-100">
                  View Bubblemap
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-320" style={{ minHeight: '210px' }}>
            <Card.Header style={{ height: '49px' }}>
              <img
                src={OntoWallet}
                alt="onto wallet"
                height="26px"
                className="rounded-0 friend-logo-dark"
              />
              <img
                src={OntoWalletDark}
                alt="onto wallet"
                height="26px"
                className="rounded-0 friend-logo-white"
              />
            </Card.Header>
            <Card.Body>
              Decentralized, cross-chain wallet, allowing users to securely
              manage their identities, data, & digital assets.
            </Card.Body>
            <Card.Footer>
              <a href="https://onto.app" target="_blank" rel="noreferrer">
                <Button variant="info" className="w-100">
                  ONTO Wallet
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs="auto">
          <Card xs="auto" className="card-320" style={{ minHeight: '210px' }}>
            <Card.Header style={{ height: '49px' }}>
              <img
                src={Coingecko}
                alt="Coingecko"
                height="26px"
                className="rounded-0 friend-logo-dark"
              />
              <img
                src={CoingeckoDark}
                alt="Coingecko"
                height="26px"
                className="rounded-0 friend-logo-white"
              />
            </Card.Header>
            <Card.Body>SPARTA market price provided by CoinGecko.</Card.Body>
            <Card.Footer>
              <a href="https://coingecko.com" target="_blank" rel="noreferrer">
                <Button variant="info" className="w-100">
                  Coingecko
                </Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  </>
)

export default Friends
