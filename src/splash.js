import './style/common.sass';

window.onload = () => {
    document
        .querySelector('.loading-screen')
        .style
        .display = 'none';
    document
        .querySelector('#app')
        .style
        .visibility = 'visible';
}