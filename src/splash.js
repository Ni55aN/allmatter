import './style/common.sass';
import checkBrowserComp from './check-compatibility';

var s = (selector) => document.querySelector(selector);
var sAll = (selector) => document.querySelectorAll(selector);
var compatibility = checkBrowserComp();

if (compatibility.status) {
    window.onload = () => {
        s('.loading-screen').style.display = 'none';
        s('#app').style.visibility = 'visible';
    }
    window.stopIfNotCompatible = () => {}
} else 
    window.stopIfNotCompatible = () => {
        window.stop();
        sAll('img').forEach(img => img.src = img.src);
        s('.cssload-container').innerHTML = compatibility.message;
    }