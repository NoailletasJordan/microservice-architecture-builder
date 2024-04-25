export const iconStyle = { width: '90%', height: '90%' }

export const serviceConfig = {
  frontend: {
    imageUrl: '/board/a-frontend.svg',
    label: 'Frontend',
  },
  'service-payment': {
    imageUrl: '/board/a-payment.svg',
    label: 'Payment service',
  },
  database: {
    imageUrl: '/board/a-database.svg',
    label: 'Database',
  },
  server: {
    imageUrl: '/board/a-server.svg',
    label: 'Server',
  },
  'service-email': {
    imageUrl: '/board/a-email.svg',
    label: 'Email-service',
  },
  authentification: {
    imageUrl: '/board/a-auth.svg',
    label: 'Authentification',
  },
}

export type ServiceIdType = keyof typeof serviceConfig
