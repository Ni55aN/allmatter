export default {
    write(key, obj) {
        localStorage[key] = JSON.stringify(obj);
    },
    read(key) {
        if (!localStorage[key]) 
            return null;
        
        try {
            return JSON.parse(localStorage[key]);
        } catch (e) {
            console.error(e);
            alert(e.message);
        }

        return null;
    }
};