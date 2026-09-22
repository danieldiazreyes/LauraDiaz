const {spawnSync}=require('node:child_process');
const readline=require('node:readline');
if(process.stdin.isTTY)process.stdin.setRawMode(true);
process.stdout.write('Ready for credential on stdin (hidden).\n');
let input='';
process.stdin.on('data',chunk=>{input+=chunk;if(!/[\r\n]/.test(input))return;process.stdin.pause();if(process.stdin.isTTY)process.stdin.setRawMode(false);try{
const credential=JSON.parse(input);const env={...process.env,GIT_TERMINAL_PROMPT:'0',SITES_GIT_AUTHORIZATION:'Authorization: Bearer '+credential.token};
for(const key of Object.keys(env))if(key.startsWith('GIT_TRACE')||key==='GIT_CURL_VERBOSE')delete env[key];
function git(args,network=false){const auth=network?['-c','credential.helper=','-c','http.extraHeader=','-c','http.followRedirects=false','--config-env=http.'+credential.remote_url+'.extraHeader=SITES_GIT_AUTHORIZATION']:[];const r=spawnSync('git',[...auth,...args],{env,encoding:'utf8',cwd:'C:/LuaraDiaz/landing'});if(r.status!==0)throw Error((r.stderr||'Git failed').split(credential.token).join('[redacted]'));return r.stdout.trim();}
git(['add','--all']);git(['commit','-m','Keep navigation visible and animate collection entrances']);const sha=git(['rev-parse','HEAD']);git(['push',credential.remote_url,sha+':refs/heads/'+credential.branch],true);const remote=git(['ls-remote','--heads',credential.remote_url,'refs/heads/'+credential.branch],true).split(/\s/)[0];if(remote!==sha)throw Error('Source verification failed');console.log(JSON.stringify({commit_sha:sha}));
}catch(error){console.error(error.message);process.exitCode=1;}});
