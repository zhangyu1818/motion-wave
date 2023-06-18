const fs = require('fs-extra')
const { rimraf } = require('rimraf')
const { execSync } = require('child_process')

const tsBuildESM = {
  extends: './tsconfig.json',
  include: ['src'],
  compilerOptions: {
    module: 'ES2015',
    jsx: 'react',
    outDir: 'dist/esm',
    emitDeclarationOnly: false,
    noEmit: false,
  },
}

const tsBuildCJS = {
  extends: './tsconfig.json',
  include: ['src'],
  compilerOptions: {
    module: 'commonjs',
    jsx: 'react',
    outDir: 'dist/cjs',
    emitDeclarationOnly: false,
    noEmit: false,
  },
}

async function build() {
  await rimraf('dist')

  for (const config of [tsBuildESM, tsBuildCJS]) {
    await fs.writeJson('.temp.json', config)
    execSync('tsc --project .temp.json')
  }
}

build()
  .then(() => {
    console.log('build completed')
  })
  .finally(() => rimraf('.temp.json'))
