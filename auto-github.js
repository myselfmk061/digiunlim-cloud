// Auto GitHub Push Function
const { exec } = require('child_process');

function autoGitHubPush() {
  console.log('🚀 Starting automatic GitHub push...');
  
  const commands = [
    'git add .',
    'git commit -m "Auto update: ' + new Date().toLocaleString() + '"',
    'git push origin main --force'
  ];
  
  commands.forEach((cmd, index) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error && !error.message.includes('nothing to commit')) {
        console.error(`❌ Error in step ${index + 1}:`, error.message);
        return;
      }
      
      if (index === commands.length - 1) {
        console.log('✅ Successfully pushed to GitHub!');
        console.log('📁 All files uploaded automatically');
      }
    });
  });
}

module.exports = { autoGitHubPush };