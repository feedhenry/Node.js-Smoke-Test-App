var config = {
  cloudData: [
    'This is data that was returned from the cloud.',
    'A special click event for this tab was bound in /client/default/js/init.js which causes a $fh.act() request to be made each time the tab is clicked.',
    'Look at the file /cloud/main.js (configCall() function)to see it reading the "cloudData" key from the /shared/config.js file.'
  ]
}
    
exports.config = config;
