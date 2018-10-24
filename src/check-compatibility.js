export default function () {

    var list = [];

    try {
        eval('async ()=>{}');
    } catch (e) {
        list.push('Async/await')
    }

    if (!document.createElement('canvas').getContext('webgl2')) 
        list.push('WebGL 2');
    
    if (!window.localStorage) 
        list.push('Local Storage');

    if (!window.fetch) {
        list.push('fetch');
    }
    
    if (list.length > 0) 
        return {
            status: false,
            message: 'Your browser or device doesn\'t support <i>' + list.join(', ') + '</i>'
        }
    
    return {status: true};
}