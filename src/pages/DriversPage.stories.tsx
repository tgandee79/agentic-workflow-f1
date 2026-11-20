import type { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter } from '@/test/story-router'
import { DriversPage } from './DriversPage'

const meta = { title: 'Pages/Driver standings', component: DriversPage } satisfies Meta<typeof DriversPage>
export default meta
export const Default: StoryObj<typeof meta> = { decorators: [withRouter('/drivers')] }
