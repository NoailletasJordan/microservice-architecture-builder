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
    content: (
      <>
        <Box>
          Welcome! This app that allows you to present your application's
          architecture in no time.
        </Box>
        <Box>
          If you're new here, here's a quick introduction to help you get
          started.
        </Box>
      </>
    ),
  },
  {
    title: 'Services',
    Icon: Service,
    content: (
      <>
        <Box>
          <Highlight>Services</Highlight> represent different parts of your
          application.
        </Box>
        <Box>
          They can be <Highlight>dragged, renamed, and connected</Highlight> to
          each other using the handles on their sides.
        </Box>
      </>
    ),
  },
  {
    title: 'Connections',
    Icon: Connexion,
    content: (
      <>
        <Box>
          The links between services indicate the communication protocols they
          use to interact.
        </Box>
        <Box>
          Clicking on a link opens a menu where you can specify additional
          details if needed.
        </Box>
      </>
    ),
  },
  {
    title: 'Sharing',
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
