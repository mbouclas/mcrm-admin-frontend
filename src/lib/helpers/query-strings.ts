export function qs(a){
    if(!a)return {};
    a=a.split('#')[0].split('&');
    var b=a.length,c={},d,k,v;
    while(b--){
        d=a[b].split('=');
        k=d[0].replace('[]',''),v=decodeURIComponent(d[1]||'');
        c[k]?typeof c[k]==='string'?(c[k]=[v,c[k]]):(c[k].unshift(v)):c[k]=v;
    }
    return c
}
