export const convertTime = (time) => {
    let h = String(Math.floor(time / 3600));
    time = String(time % 3600);
    let m = String(Math.floor(time / 60));
    time = String(time % 60);
    let s = String(Math.floor(time));
    time = String(time % 1);
    let ms = String(Math.floor(time * 100));
    
    if (ms.length < 2) 
      ms = '0'+ms;
    if (s.length < 2) 
      s = '0'+s;
    if (m.length < 2) 
      m = '0'+m;
    if (h.length < 2) 
      h = '0'+h;
  
    // let retString = ''
    // retString += h > 0 ? h + 'h:' : '';
    // retString += m > 0 ? m + 'm:' : '';
    // retString += s > 0 ? s + 's:' : '';
    // retString += ms > 0 ? ms + 'ms' : '';
  
    // return retString;
    return h+'h:'+m+'m:'+s+'s:'+ms+'ms';
}
  
export const getAbrev = (i) => {
    let abrev = ''
    switch (i) {
      case 1: {
        abrev = 'st'
        break;
      }
      case 2: {
        abrev = 'nd'
        break;
      }
      case 3: {
        abrev = 'rd'
        break;
      }
      case 4: {
        abrev = 'th'
        break;
      }
      case 5: {
        abrev = 'th'
        break;
      }
    }
    return String(i) + abrev;
}