const { execSync } = require('child_process')

const COMMIT_ID = 'git rev-parse HEAD'
const CURRENT_BRANCH = 'git name-rev --name-only HEAD'
// 1. git symbolic-ref --short -q HEAD
// 2. git rev-parse --abbrev-ref HEAD
// 3. git symbolic-ref HEAD | sed -e "s/^refs\/heads\///"
const COMMIT_DETAIL = 'git log --pretty=format:"%h - %an, %ar : %s"  -1'

let commitId = ''
let currentBranch = ''
let commitDetail = ''
const buildTime = new Date() * 1

try {
  commitId = execSync(COMMIT_ID).toString().trim()
} catch (ex) {
  console.log(ex)
}

try {
  commitDetail = execSync(COMMIT_DETAIL).toString().trim()
} catch (ex) {
  console.log(ex)
}
try {
  currentBranch = execSync(CURRENT_BRANCH).toString().trim()
} catch (ex) {
  console.log(ex)
}

module.exports = {
  NODE_ENV: '"production"',
  POOL_NAME: JSON.stringify(process.env.POOL_NAME),
  COMMIT_ID: JSON.stringify(commitId),
  CURRENT_BRANCH: JSON.stringify(currentBranch),
  COMMIT_DETAIL: JSON.stringify(commitDetail),
  BUILD_TIME: JSON.stringify(buildTime)
}
