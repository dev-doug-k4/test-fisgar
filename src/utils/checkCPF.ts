export default function checkCPF(val: string | any[]) {
    if(!!val) {
        let v1 = 0;
        let v2 = 0;
        let aux = false;
        for (let i = 1; val.length > i; i++) {
            if (val[i - 1] != val[i]) {
                aux = true;
            }
        }
        if (aux == false) {
            return false;
        }
        for (let i = 0, p = 10; (val.length - 2) > i; i++, p--) {
            v1 += val[i] * p;
        }
        v1 = ((v1 * 10) % 11);
    
        if (v1 == 10) {
            v1 = 0;
        }
        if (v1 != val[9]) {
            return false;
        }
        for (let i = 0, p = 11; (val.length - 1) > i; i++, p--) {
            v2 += val[i] * p;
        }
        v2 = ((v2 * 10) % 11);
    
        if (v2 == 10) {
            v2 = 0;
        }
        if (v2 != val[10]) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}