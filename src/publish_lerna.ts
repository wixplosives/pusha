import * as semver from 'semver'
const childProcess = require( 'child_process')
const getPackages = require( 'get-monorepo-packages' )
const pacote = require('pacote')

async function runPublishCommand(pathToFolder: string) {
    return childProcess.execSync('yarn publish' , {cwd: pathToFolder})
}

async function publishIfRequired(pathToFolder: string, pkgJsonContent: {name: string, version: string}) {
    const pjson = pkgJsonContent
    const opts = {
        '//registry.npmjs.org/:token': process.env.NPM_TOKEN
    }

    try {
        const manifest = await pacote.manifest(pkgJsonContent.name, opts)
        const pkjJsonVer = pjson.version
        const globalVer = manifest.version
        if ( pkjJsonVer !== undefined &&
            globalVer !== undefined &&
            semver.gt(pkjJsonVer, globalVer)) {
            console.log('<<<<<<<<<<<Do publish on:' + pathToFolder)
            await runPublishCommand(pathToFolder)
        }
    } catch (error) {
        return error
    }
    return 0
}

export async function CheckAndPublishMonorepo(pathToProject: string) {
    const packages = await getPackages(pathToProject)
    let retVal = -1
    for (const entry of packages) {
        retVal = 0
        await publishIfRequired(entry.location, entry.package)
    }
    return retVal
}
