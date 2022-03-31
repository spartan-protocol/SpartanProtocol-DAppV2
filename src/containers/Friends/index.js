import React from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
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
import { useTheme } from '../../providers/Theme'

const Friends = () => {
  const { isDark } = useTheme()

  return (
    <>
      <Row>
        <Col className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <img src={isDark ? Immunefi : ImmunefiDark} alt="immunefi" />
            </Card.Header>
            <Card.Body style={{ minHeight: '84px' }}>
              Web3&apos;s leading bug bounty platform, protecting $100 billion
              in user funds.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://www.immunefi.com/bounty/spartanprotocol"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-100">View $100k Bounty</Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <img src={isDark ? C4 : C4Dark} alt="codearena" height="26px" />
            </Card.Header>
            <Card.Body style={{ minHeight: '84px' }}>
              C4 audit contests find more bugs faster than any other method.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://code423n4.com/reports/2021-07-spartan/"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-100">View $96k Contest</Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <img
                src={isDark ? Certik : CertikDark}
                alt="certik"
                height="26px"
              />
            </Card.Header>
            <Card.Body style={{ minHeight: '84px' }}>
              Utilizing best-in-class AI technology to secure & monitor
              blockchain protocols & smart contracts.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://github.com/spartan-protocol/resources/blob/master/certik-audit.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-100">View Audit</Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <img
                src={isDark ? GitHub : GitHubDark}
                alt="github"
                height="26px"
              />
            </Card.Header>
            <Card.Body style={{ minHeight: '84px' }}>
              Everything built by the community is open source! GitHub is
              critical to enabling such transparency.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://github.com/spartan-protocol/spartanswap-contracts"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-100">Dont trust, verify!</Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <img
                src={isDark ? Coingecko : CoingeckoDark}
                alt="Coingecko"
                height="26px"
              />
            </Card.Header>
            <Card.Body style={{ minHeight: '84px' }}>
              CoinGecko provides a fundamental analysis of the crypto market
              including prices, volume, market caps & more.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://www.coingecko.com/en/coins/spartan-protocol-token"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-100">CoinGecko</Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <img
                src={Moonlight}
                alt="moonlight"
                height="26px"
                className="rounded-0 me-1"
              />{' '}
              Moonlight
            </Card.Header>
            <Card.Body style={{ minHeight: '84px' }}>
              Ground-breaking way of exploring tokens on BSC, visually revealing
              connections between wallets.
            </Card.Body>
            <Card.Footer>
              <a
                href="https://bubbles.moonlighttoken.com/token/0x3910db0600ea925f63c36ddb1351ab6e2c6eb102"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-100">View Bubblemap</Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
        <Col className="my-2" lg="4" md="6" sm="12">
          <Card>
            <Card.Header className="text-center">
              <img
                src={isDark ? OntoWallet : OntoWalletDark}
                alt="onto wallet"
                height="26px"
              />
            </Card.Header>
            <Card.Body style={{ minHeight: '84px' }}>
              Decentralized, cross-chain wallet, allowing users to securely
              manage their identities, data, & digital assets.
            </Card.Body>
            <Card.Footer>
              <a href="https://onto.app" target="_blank" rel="noreferrer">
                <Button className="w-100">ONTO Wallet</Button>
              </a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Friends
