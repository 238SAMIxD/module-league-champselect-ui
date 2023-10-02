import React, { useEffect, useState } from 'react'
import Overlay from './europe/Overlay'
import convertState from './convertState'

function App() {
  const [globalState, setGlobalState] = useState({})
  const [config, setConfig] = useState({
    frontend: {
      scoreEnabled: false,
      spellsEnabled: true,
      coachesEnabled: false,
      blueTeam: {
        coach: '',
        color: 'rgb(0,151,196)',
        logo: '',
        name: 'Team Blue',
        score: 0,
        standing: '',
        tag: 'BLU'
      },
      redTeam: {
        coach: '',
        color: 'rgb(222,40,70)',
        logo: '',
        name: 'Team Red',
        score: 0,
        standing: '',
        tag: 'RED'
      },
      patch: ''
    }
  })
  useEffect(() => {
    window.LPTE.onready(async () => {
      window.LPTE.on('module-league-state', 'champselect-update', (e) => {
        e.data.isActive = e.isActive
        e.data.isActive = true
        setGlobalState(e.data)
      })

      window.LPTE.on('module-teams', 'update', changeColors)

      const themeBlue = document
        .querySelector(':root')
        .style.getPropertyValue('--blue-team')
      const themeRed = document
        .querySelector(':root')
        .style.getPropertyValue('--red-team')

      function changeColors(e) {
        setConfig({frontend: {
          scoreEnabled: config.frontend.scoreEnabled,
          spellsEnabled: config.frontend.spellsEnabled,
          coachesEnabled: config.frontend.coachesEnabled,
          blueTeam: e.teams.blueTeam,
          redTeam: e.teams.redTeam,
          patch: config.frontend.patch
        }})
        if (e.teams.blueTeam.color !== '#000000') {
          document
            .querySelector(':root')
            .style.setProperty('--blue-team', e.teams.blueTeam.color)
        } else {
          document
            .querySelector(':root')
            .style.setProperty('--blue-team', themeBlue)
        }
        if (e.teams.redTeam.color !== '#000000') {
          document
            .querySelector(':root')
            .style.setProperty('--red-team', e.teams.redTeam.color)
        } else {
          document
            .querySelector(':root')
            .style.setProperty('--red-team', themeRed)
        }
      }

      const teams = await window.LPTE.request({
        meta: {
          namespace: 'module-teams',
          type: 'request-current',
          version: 1
        }
      })

      if (teams === undefined) return
      changeColors(teams)
    })
  }, [])

  return (
    <div className="App">
      <Overlay state={convertState(globalState)} config={config} />
    </div>
  )
}

export default App
