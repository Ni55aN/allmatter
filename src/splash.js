import './style/common.sass';
import checkBrowserComp from './check-compatibility';

const s = (selector) => document.querySelector(selector);
const sAll = (selector) => document.querySelectorAll(selector);
const compatibility = checkBrowserComp();

window.onerror = function(message) {
    try {
        document.getElementsByClassName('cssload-container')[0].innerHTML = message;
    }
    catch (e) {
        console.error(e);
    }
};

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