import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { season } from '@/data/season'
import { driverStandings } from '@/lib/standings'
import { renderAt } from '@/test/render'

describe('DriversPage', () => {
  it('lists every driver who scored a result, leader first', () => {
    renderAt('/drivers')
    const standings = driverStandings(season.races)
    expect(screen.getByRole('heading', { name: 'Driver standings' })).toBeInTheDocument()
    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows).toHaveLength(standings.length + 1)
    const leader = within(rows[1]!).getAllByRole('cell')
    expect(leader[0]).toHaveTextContent('1')
    expect(leader[1]).toHaveTextContent('Lando Norris')
    expect(leader[4]).toHaveTextContent(String(standings[0]!.points))
  })

  it('is reachable from the main nav', () => {
    renderAt('/')
    expect(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Drivers' })).toHaveAttribute('href', '/drivers')
  })
})
