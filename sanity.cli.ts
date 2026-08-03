import { defineCliConfig } from 'sanity/cli'
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

import { dataset, projectId } from './src/sanity/env'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
