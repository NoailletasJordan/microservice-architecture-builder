import Connexion from '@/components/Icons/Connexion'
import Service from '@/components/Icons/Service'
import Share from '@/components/Icons/Share'
import Welcome from '@/components/Icons/Welcome'
import { Box } from '@mantine/core'
import Highlight from './components/Highlight'

export const SECTIONS = [
  {
    title: 'Welcome',
    Icon: Welcome,
    artboard: 'welcome',
    content: (
      <>
        <Box>
          <Highlight> Welcome! </Highlight> This app that allows you to
          represent application's
          <Highlight> distributed architecture in no time.</Highlight>
        </Box>
        <Box>
          If you're new here, here's a
          <Highlight> quick introduction </Highlight> to help you get started.
        </Box>
      </>
    ),
  },
  {
    title: 'Services',
    artboard: 'service',
    Icon: Service,
    content: (
      <>
        <Box>
          <Highlight>Services </Highlight> represent different parts of your
          application.
        </Box>
        <Box>
          They can be <Highlight>dragged, renamed, and connected</Highlight> to
          each other using the <Highlight> connectors </Highlight> on their
          sides.
        </Box>
        <Box>
          An <Highlight> action menu </Highlight> will appear at the top when
          the mouse is hovered over the service.
        </Box>
      </>
    ),
  },
  {
    title: 'Connections',
    artboard: 'connexion',
    Icon: Connexion,
    content: (
      <>
        <Box>
          <Highlight> Links </Highlight> between services represent a
          <Highlight> communication channel</Highlight>.
        </Box>
        <Box>
          Clicking on those links will <Highlight> open a menu </Highlight> that
          is used to add specifications about the communication protocol.
        </Box>
      </>
    ),
  },
  {
    title: 'Sharing',
    artboard: 'share',
    Icon: Share,
    content: (
      <>
        <Box>
          Once your representation is complete, you can
          <Highlight> generate a shareable link </Highlight> by clicking the
          button in the top-right corner.
        </Box>
        <Box>
          Your progress is also automatically stored in your browser and will be
          loaded when you return.
        </Box>
      </>
    ),
  },
]
