export class Utils {
    
    static isPhantomJS(): boolean {
        const userAgent = navigator.userAgent;
        const found = userAgent.toLocaleLowerCase().indexOf('phantomjs');
        return found > 0 ? true : false;
    }   
    
    static isNodeJS(): boolean {
        let found = false;
        if (typeof module !== 'undefined' && module.exports) {
            found = true;
        }
        return found;
    }   
}