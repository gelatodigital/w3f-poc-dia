import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['web3-functions/supra/supra/browserfy.js'],
  bundle: true,
  platform:"browser",
  outfile: 'web3-functions/supra/supra/out.js',
  define:process.env={}
})